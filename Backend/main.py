from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from urllib.request import Request, urlopen, HTTPRedirectHandler, build_opener
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse, quote
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
    allow_headers=["*"]
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

    github_api_url = (
        f"https://api.github.com/repos/"
        f"{owner}/{repo}"
    )

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
# Repository Statistics Analyzer
# ============================================================

def analyze_repository_tree(tree):

    """
    Analyze a recursive GitHub repository tree.

    Returns repository statistics and
    language classification without
    downloading file contents.
    """

    files = []
    folders = []

    extension_counts = {}

    # --------------------------------------------------------
    # Language mapping
    # --------------------------------------------------------

    language_map = {

        # JavaScript
        ".js": "JavaScript",
        ".jsx": "JavaScript",
        ".mjs": "JavaScript",
        ".cjs": "JavaScript",

        # TypeScript
        ".ts": "TypeScript",
        ".tsx": "TypeScript",

        # Python
        ".py": "Python",

        # Java
        ".java": "Java",

        # C
        ".c": "C",
        ".h": "C",

        # C++
        ".cpp": "C++",
        ".cc": "C++",
        ".cxx": "C++",
        ".hpp": "C++",

        # C#
        ".cs": "C#",

        # Go
        ".go": "Go",

        # Rust
        ".rs": "Rust",

        # PHP
        ".php": "PHP",

        # Ruby
        ".rb": "Ruby",

        # Swift
        ".swift": "Swift",

        # Kotlin
        ".kt": "Kotlin",
        ".kts": "Kotlin",

        # Dart
        ".dart": "Dart",

        # Styling
        ".css": "CSS",
        ".scss": "SCSS",
        ".sass": "Sass",
        ".less": "Less",

        # HTML
        ".html": "HTML",
        ".htm": "HTML",

        # SQL
        ".sql": "SQL",

        # Shell
        ".sh": "Shell",
        ".bash": "Shell",

        # XML
        ".xml": "XML",

        # JSON
        ".json": "JSON",

        # YAML
        ".yaml": "YAML",
        ".yml": "YAML",

        # Markdown
        ".md": "Markdown",

        # SVG
        ".svg": "SVG"
    }

    language_counts = {}

        # --------------------------------------------------------
    # Important file classification
    # --------------------------------------------------------

    important_file_rules = {

        "documentation": {
            "README.md",
            "README",
            "README.txt",
            "CONTRIBUTING.md",
            "CHANGELOG.md"
        },

        "dependency": {
            "package.json",
            "package-lock.json",
            "yarn.lock",
            "pnpm-lock.yaml",
            "requirements.txt",
            "requirements-dev.txt",
            "Pipfile",
            "Pipfile.lock",
            "pyproject.toml",
            "poetry.lock",
            "pom.xml",
            "build.gradle",
            "build.gradle.kts",
            "Cargo.toml",
            "Cargo.lock",
            "go.mod",
            "go.sum"
        },

        "configuration": {
            "tsconfig.json",
            "jsconfig.json",
            ".eslintrc",
            ".eslintrc.json",
            ".eslintrc.js",
            ".prettierrc",
            ".prettierrc.json",
            "vite.config.js",
            "vite.config.ts",
            "webpack.config.js",
            "webpack.config.ts",
            "next.config.js",
            "next.config.ts",
            "tailwind.config.js",
            "tailwind.config.ts"
        },

        "containerization": {
            "Dockerfile",
            "docker-compose.yml",
            "docker-compose.yaml",
            ".dockerignore"
        },

        "environment": {
            ".env.example",
            ".env.sample",
            ".env.template"
        },

        "version_control": {
            ".gitignore",
            ".gitattributes"
        },

        "testing": {
            "jest.config.js",
            "jest.config.ts",
            "vitest.config.js",
            "vitest.config.ts",
            "pytest.ini",
            "tox.ini"
        }
    }

    important_files = []

    # --------------------------------------------------------
    # Process repository tree
    # --------------------------------------------------------

    for item in tree:

        item_type = item.get("type")
        path = item.get("path", "")

        # ----------------------------------------------------
        # Files
        # ----------------------------------------------------

        if item_type == "file":

            files.append(path)

            # Get file name

            filename = path.split("/")[-1]

                        # ------------------------------------------------
            # Detect important repository files
            # ------------------------------------------------

            for category, filenames in important_file_rules.items():

                if filename in filenames:

                    important_files.append({
                        "path": path,
                        "category": category
                    })

                    break

            # ------------------------------------------------
            # Get file extension
            # ------------------------------------------------

            if "." in filename:

                extension = (
                    "." +
                    filename.split(".")[-1].lower()
                )

                # Count extension

                extension_counts[extension] = (
                    extension_counts.get(extension, 0) + 1
                )

                # ------------------------------------------------
                # Detect language
                # ------------------------------------------------

                language = language_map.get(extension)

                if language:

                    language_counts[language] = (
                        language_counts.get(language, 0) + 1
                    )

            else:

                extension_counts["[no extension]"] = (
                    extension_counts.get(
                        "[no extension]",
                        0
                    ) + 1
                )

        # ----------------------------------------------------
        # Folders
        # ----------------------------------------------------

        elif item_type == "folder":

            folders.append(path)

    # --------------------------------------------------------
    # Top-level directories
    # --------------------------------------------------------

    top_level_directories = set()

    for path in folders:

        parts = path.split("/")

        if len(parts) >= 1:

            top_level_directories.add(parts[0])

    # --------------------------------------------------------
    # Top-level files
    # --------------------------------------------------------

    top_level_files = []

    for path in files:

        if "/" not in path:

            top_level_files.append(path)

    # --------------------------------------------------------
    # Sort extension counts
    # --------------------------------------------------------

    extension_counts = dict(
        sorted(
            extension_counts.items(),
            key=lambda item: item[1],
            reverse=True
        )
    )

    # --------------------------------------------------------
    # Sort language counts
    # --------------------------------------------------------

    language_counts = dict(
        sorted(
            language_counts.items(),
            key=lambda item: item[1],
            reverse=True
        )
    )

    # --------------------------------------------------------
    # Return analysis
    # --------------------------------------------------------

    return {

        "file_count": len(files),

        "folder_count": len(folders),

        "extension_counts": extension_counts,

        "language_counts": language_counts,

        "important_files": important_files,

        "top_level_directories": sorted(
            top_level_directories
        ),

        "top_level_files": sorted(
            top_level_files
        )
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

                redirect_url = error.headers.get(
                    "Location"
                )

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


# ============================================================
# Recursive Repository Tree Endpoint
# ============================================================

@app.get("/repository-tree")
def get_repository_tree(repo_url: str):

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

    if repo.endswith(".git"):

        repo = repo[:-4]

    # --------------------------------------------------------
    # Step 1 — Get repository metadata
    # --------------------------------------------------------

    metadata_url = (
        f"https://api.github.com/repos/"
        f"{owner}/{repo}"
    )

    metadata_request = Request(
        metadata_url,
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": "RepoLens",
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "X-GitHub-Api-Version": "2022-11-28"
        }
    )

    try:

        with urlopen(metadata_request) as response:

            metadata = json.loads(
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

    # --------------------------------------------------------
    # Get default branch
    # --------------------------------------------------------

    default_branch = metadata["default_branch"]

    # --------------------------------------------------------
    # Step 2 — Get recursive Git tree
    # --------------------------------------------------------

    encoded_branch = quote(
        default_branch,
        safe=""
    )

    tree_url = (
        f"https://api.github.com/repos/"
        f"{owner}/{repo}/git/trees/"
        f"{encoded_branch}?recursive=1"
    )

    tree_request = Request(
        tree_url,
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": "RepoLens",
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "X-GitHub-Api-Version": "2022-11-28"
        }
    )

    try:

        with urlopen(tree_request) as response:

            tree_data = json.loads(
                response.read().decode("utf-8")
            )

    except HTTPError as error:

        error_body = error.read().decode("utf-8")

        raise HTTPException(
            status_code=error.code,
            detail=f"GitHub tree API error: {error_body}"
        )

    except URLError as error:

        raise HTTPException(
            status_code=503,
            detail=f"Could not connect to GitHub: {error.reason}"
        )

    # --------------------------------------------------------
    # Validate GitHub tree response
    # --------------------------------------------------------

    if "tree" not in tree_data:

        raise HTTPException(
            status_code=500,
            detail="Unexpected response from GitHub Git Trees API"
        )

    # --------------------------------------------------------
    # Convert GitHub tree into RepoLens format
    # --------------------------------------------------------

    items = []

    file_count = 0
    folder_count = 0

    for item in tree_data["tree"]:

        item_type = item.get("type")

        if item_type == "blob":

            repo_type = "file"
            file_count += 1

        elif item_type == "tree":

            repo_type = "folder"
            folder_count += 1

        else:

            continue

        items.append({
            "path": item["path"],
            "type": repo_type,
            "sha": item.get("sha"),
            "size": item.get("size")
        })

    # --------------------------------------------------------
    # Return structured repository tree
    # --------------------------------------------------------

    return {

        "repository": f"{owner}/{repo}",

        "default_branch": default_branch,

        "summary": {
            "files": file_count,
            "folders": folder_count
        },

        "truncated": tree_data.get(
            "truncated",
            False
        ),

        "tree": items
    }


# ============================================================
# Repository Statistics Endpoint
# ============================================================

@app.get("/repository-statistics")
def get_repository_statistics(repo_url: str):

    # --------------------------------------------------------
    # Get repository tree
    # --------------------------------------------------------

    tree_response = get_repository_tree(repo_url)

    # --------------------------------------------------------
    # Analyze tree
    # --------------------------------------------------------

    analysis = analyze_repository_tree(
        tree_response["tree"]
    )

    # --------------------------------------------------------
    # Return structured statistics
    # --------------------------------------------------------

    return {

        "repository": tree_response["repository"],

        "default_branch": tree_response["default_branch"],

        "truncated": tree_response["truncated"],

        "statistics": analysis
    }