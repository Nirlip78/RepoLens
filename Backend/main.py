from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from urllib.request import Request, urlopen, HTTPRedirectHandler, build_opener
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
import json
import os
from dotenv import load_dotenv


# ============================================================
# Load environment variables
# ============================================================

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")


# ============================================================
# GitHub redirect handling
# ============================================================

class NoRedirectHandler(HTTPRedirectHandler):

    def http_error_301(self, req, fp, code, msg, headers):
        raise HTTPError(req.full_url, code, msg, headers, fp)

    def http_error_302(self, req, fp, code, msg, headers):
        raise HTTPError(req.full_url, code, msg, headers, fp)

    def http_error_303(self, req, fp, code, msg, headers):
        raise HTTPError(req.full_url, code, msg, headers, fp)

    def http_error_307(self, req, fp, code, msg, headers):
        raise HTTPError(req.full_url, code, msg, headers, fp)

    def http_error_308(self, req, fp, code, msg, headers):
        raise HTTPError(req.full_url, code, msg, headers, fp)


github_opener = build_opener(NoRedirectHandler)


# ============================================================
# FastAPI application
# ============================================================

app = FastAPI()


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Root endpoint
# ============================================================

@app.get("/")
def root():
    return {
        "message": "RepoLens backend is running"
    }


# ============================================================
# Repository Metadata Endpoint
# ============================================================

@app.post("/analyze")
def analyze_repository(repo_url: str):

    # Check that the URL belongs to GitHub
    parsed_url = urlparse(repo_url)

    if parsed_url.netloc not in ["github.com", "www.github.com"]:
        raise HTTPException(
            status_code=400,
            detail="Please provide a valid GitHub repository URL"
        )

    # Extract owner and repository name
    path_parts = parsed_url.path.strip("/").split("/")

    if len(path_parts) < 2:
        raise HTTPException(
            status_code=400,
            detail="Invalid GitHub repository URL"
        )

    owner = path_parts[0]
    repo = path_parts[1]

    # Remove .git if the URL contains it
    if repo.endswith(".git"):
        repo = repo[:-4]

    # GitHub API URL
    github_api_url = f"https://api.github.com/repos/{owner}/{repo}"

    try:

        request = Request(
            github_api_url,
            headers={
                "Accept": "application/vnd.github+json",
                "User-Agent": "RepoLens",
                "Authorization": f"Bearer {GITHUB_TOKEN}"
            }
        )

        with urlopen(request) as response:

            data = json.loads(
                response.read().decode("utf-8")
            )

    except HTTPError as error:

        error_body = error.read().decode("utf-8")

        raise HTTPException(
            status_code=error.code,
            detail=f"GitHub API error: {error_body}"
        )

    except URLError as error:

        raise HTTPException(
            status_code=503,
            detail=f"Could not connect to GitHub: {error.reason}"
        )

    # Return repository information
    return {
        "name": data["name"],
        "owner": data["owner"]["login"],
        "description": data["description"],
        "stars": data["stargazers_count"],
        "forks": data["forks_count"],
        "language": data["language"],
        "default_branch": data["default_branch"],
        "github_url": data["html_url"]
    }


# ============================================================
# Repository Structure Endpoint
# ============================================================

@app.get("/repository-structure")
def get_repository_structure(repo_url: str):

    # --------------------------------------------------------
    # Validate GitHub URL
    # --------------------------------------------------------

    parsed_url = urlparse(repo_url)

    if parsed_url.netloc not in ["github.com", "www.github.com"]:
        raise HTTPException(
            status_code=400,
            detail="Please provide a valid GitHub repository URL"
        )

    # --------------------------------------------------------
    # Extract owner and repository
    # --------------------------------------------------------

    path_parts = parsed_url.path.strip("/").split("/")

    if len(path_parts) < 2:
        raise HTTPException(
            status_code=400,
            detail="Invalid GitHub repository URL"
        )

    owner = path_parts[0]
    repo = path_parts[1]

    # Remove .git if present
    if repo.endswith(".git"):
        repo = repo[:-4]

    # --------------------------------------------------------
    # GitHub Contents API
    # --------------------------------------------------------

    github_contents_url = (
        f"https://api.github.com/repos/"
        f"{owner}/{repo}/contents"
    )

    request = Request(
        github_contents_url,
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": "RepoLens",
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "X-GitHub-Api-Version": "2022-11-28"
        }
    )

    try:

        # ----------------------------------------------------
        # First request: prevent urllib from automatically
        # following redirects.
        # ----------------------------------------------------

        try:

            with github_opener.open(request) as response:

                data = json.loads(
                    response.read().decode("utf-8")
                )

        except HTTPError as error:

            # ------------------------------------------------
            # GitHub redirect handling
            # ------------------------------------------------

            if error.code in [301, 302, 303, 307, 308]:

                redirect_url = error.headers.get("Location")

                if not redirect_url:

                    raise HTTPException(
                        status_code=502,
                        detail=(
                            "GitHub returned a redirect "
                            "without a location."
                        )
                    )

                # --------------------------------------------
                # Create a new authenticated request
                # --------------------------------------------

                redirect_request = Request(
                    redirect_url,
                    headers={
                        "Accept": "application/vnd.github+json",
                        "User-Agent": "RepoLens",
                        "Authorization": f"Bearer {GITHUB_TOKEN}",
                        "X-GitHub-Api-Version": "2022-11-28"
                    }
                )

                # --------------------------------------------
                # Follow redirect manually
                # --------------------------------------------

                with urlopen(redirect_request) as response:

                    data = json.loads(
                        response.read().decode("utf-8")
                    )

            else:

                error_body = error.read().decode("utf-8")

                raise HTTPException(
                    status_code=error.code,
                    detail=f"GitHub API error: {error_body}"
                )

    except URLError as error:

        raise HTTPException(
            status_code=503,
            detail=f"Could not connect to GitHub: {error.reason}"
        )

    # --------------------------------------------------------
    # Validate GitHub response
    # --------------------------------------------------------

    if not isinstance(data, list):

        raise HTTPException(
            status_code=500,
            detail="Unexpected response from GitHub Contents API"
        )

    # --------------------------------------------------------
    # Convert GitHub response into RepoLens structure
    # --------------------------------------------------------

    items = []

    for item in data:

        items.append({
            "name": item["name"],
            "path": item["path"],
            "type": item["type"]
        })

    # --------------------------------------------------------
    # Return repository structure
    # --------------------------------------------------------

    return {
        "repository": f"{owner}/{repo}",
        "items": items
    }