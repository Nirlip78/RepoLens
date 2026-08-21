import { Link } from "react-router-dom";
import { useState } from "react";
import "./Landing.css";


function Landing() {

  const [repoUrl, setRepoUrl] = useState("");
  const [response, setResponse] = useState(null);
  const [repositoryStructure, setRepositoryStructure] = useState(null);
  const [loading, setLoading] = useState(false);


  // ============================================================
  // Analyze Repository
  // ============================================================

  const analyzeRepository = async () => {

    if (!repoUrl.trim()) {
      setResponse({
        error: "Please enter a GitHub repository URL."
      });
      return;
    }

    setLoading(true);
    setResponse(null);
    setRepositoryStructure(null);

    try {

      // --------------------------------------------------------
      // Step 1 — Repository information
      // --------------------------------------------------------

      const response = await fetch(
        `http://127.0.0.1:8000/analyze?repo_url=${encodeURIComponent(repoUrl)}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setResponse({
          error: data.detail || "Repository analysis failed."
        });

        setLoading(false);
        return;
      }

      setResponse(data);


      // --------------------------------------------------------
      // Step 2 — Repository structure
      // --------------------------------------------------------

      const structureResponse = await fetch(
        `http://127.0.0.1:8000/repository-structure?repo_url=${encodeURIComponent(repoUrl)}`,
        {
          method: "GET",
        }
      );

      const structureData = await structureResponse.json();

      if (!structureResponse.ok) {

        setRepositoryStructure({
          error:
            structureData.detail ||
            "Could not load repository structure."
        });

      } else {

        setRepositoryStructure(structureData);

      }

    } catch (error) {

      console.error(error);

      setResponse({
        error:
          "Could not connect to RepoLens backend. Make sure FastAPI is running."
      });

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="landing-page">


      {/* ======================================================
          Navbar
          ====================================================== */}

      <nav className="landing-navbar">

        <Link to="/" className="landing-brand">
          <span>◈</span>
          RepoLens
        </Link>


        <div className="landing-nav-links">

          <Link to="/login" className="nav-login">
            Login
          </Link>

          <Link to="/signup" className="nav-signup">
            Sign Up
          </Link>

        </div>

      </nav>



      {/* ======================================================
          Hero
          ====================================================== */}

      <main className="landing-hero">

        <div
          className="landing-pipeline-bg"
          aria-hidden="true"
        >
          <PipelineTrace />
        </div>


        <div className="hero-badge">
          AI-POWERED CODEBASE INTELLIGENCE
        </div>


        <h1>
          Understand any
          <span>GitHub repository.</span>
        </h1>


        <p className="hero-description">
          RepoLens analyzes your codebase and helps you understand
          its architecture, locate important code, and safely plan
          changes with AI.
        </p>



        {/* ==================================================
            Repository Input
            ================================================== */}

        <div className="repo-input-container">

          <div className="repo-input-wrapper">

            <span className="repo-input-icon">
              ⌘
            </span>

            <input
              type="text"
              placeholder="Paste a GitHub repository URL..."
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  analyzeRepository();
                }
              }}
              disabled={loading}
            />

          </div>


          <button
            className="analyze-button"
            onClick={analyzeRepository}
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Analyzing Repository...
              </>
            ) : (
              "Analyze Repository →"
            )}

          </button>

        </div>



        {/* ==================================================
            Analysis Output
            ================================================== */}

        {response && !response.error && (

          <RepositoryAnalysis
            response={response}
            repositoryStructure={repositoryStructure}
          />

        )}



        {/* ==================================================
            Error
            ================================================== */}

        {response && response.error && (

          <div className="analysis-error">

            <div className="error-icon">
              !
            </div>

            <div>
              <strong>
                We couldn't analyze this repository
              </strong>

              <p>
                {response.error}
              </p>
            </div>

          </div>

        )}



        {!response && !loading && (

          <p className="hero-note">
            No repository connected yet · Try any public GitHub repository
          </p>

        )}



        {/* ==================================================
            Flow
            ================================================== */}

        <div className="hero-flow">

          <span>
            REPOSITORY
          </span>

          <div className="flow-line"></div>

          <span>
            ANALYSIS
          </span>

          <div className="flow-line"></div>

          <span>
            UNDERSTANDING
          </span>

          <div className="flow-line"></div>

          <span>
            AI INSIGHTS
          </span>

        </div>

      </main>



      {/* ======================================================
          Main Features
          ====================================================== */}

      <section className="core-section">

        <div className="section-heading">

          <p className="section-label">
            CORE CAPABILITIES
          </p>

          <h2>
            What do you want to understand?
          </h2>

          <p>
            Choose how RepoLens should help you explore a repository.
          </p>

        </div>


        <div className="feature-grid">


          <div className="feature-card">

            <div className="feature-icon overview-icon">
              ◫
            </div>

            <span className="feature-number">
              01
            </span>

            <h3>
              Repository Overview
            </h3>

            <p className="feature-description">
              Understand what the project does, its technologies,
              folder structure, dependencies, and overall architecture.
            </p>

            <a
              href="#overview"
              className="feature-link"
            >
              Explore repository →
            </a>

          </div>



          <div className="feature-card">

            <div className="feature-icon code-icon">
              {"{ }"}
            </div>

            <span className="feature-number">
              02
            </span>

            <h3>
              Find & Explain Code
            </h3>

            <p className="feature-description">
              Find where a particular feature is implemented and
              understand the exact files and code responsible for it.
            </p>

            <a
              href="#code"
              className="feature-link"
            >
              Explore code →
            </a>

          </div>



          <div className="feature-card">

            <div className="feature-icon change-icon">
              ⚡
            </div>

            <span className="feature-number">
              03
            </span>

            <h3>
              Change Advisor
            </h3>

            <p className="feature-description">
              Describe a new feature and RepoLens identifies where
              changes should be made and whether they may be risky.
            </p>

            <a
              href="#changes"
              className="feature-link"
            >
              Plan a change →
            </a>

          </div>

        </div>

      </section>



      {/* ======================================================
          How It Works
          ====================================================== */}

      <section className="how-section">

        <div className="section-heading">

          <p className="section-label">
            HOW REPOLENS WORKS
          </p>

          <h2>
            From repository to understanding
          </h2>

        </div>


        <div className="workflow">

          <div className="workflow-step">

            <div className="workflow-number">
              01
            </div>

            <h3>
              Connect
            </h3>

            <p>
              Provide a GitHub repository.
            </p>

          </div>


          <div className="workflow-connector"></div>


          <div className="workflow-step">

            <div className="workflow-number">
              02
            </div>

            <h3>
              Analyze
            </h3>

            <p>
              RepoLens studies the codebase.
            </p>

          </div>


          <div className="workflow-connector"></div>


          <div className="workflow-step">

            <div className="workflow-number">
              03
            </div>

            <h3>
              Ask
            </h3>

            <p>
              Ask questions about the code.
            </p>

          </div>


          <div className="workflow-connector"></div>


          <div className="workflow-step">

            <div className="workflow-number">
              04
            </div>

            <h3>
              Understand
            </h3>

            <p>
              Get repository-aware answers.
            </p>

          </div>

        </div>


        <a
          href="#learn"
          className="learn-more-button"
        >
          Learn how RepoLens works →
        </a>

      </section>



      {/* ======================================================
          Footer
          ====================================================== */}

      <footer className="landing-footer">

        <div className="footer-brand">

          <Link
            to="/"
            className="landing-brand"
          >
            <span>◈</span>
            RepoLens
          </Link>

          <p>
            AI-powered codebase intelligence.
          </p>

        </div>


        <div className="footer-links">

          <Link to="/login">
            Login
          </Link>

          <Link to="/signup">
            Sign Up
          </Link>

          <a href="#github">
            GitHub
          </a>

        </div>


        <div className="footer-bottom">

          <span>
            RepoLens
          </span>

          <span>
            Built for developers.
          </span>

        </div>

      </footer>

    </div>
  );
}



/* ============================================================
   Repository Analysis Component
   ============================================================ */

function RepositoryAnalysis({
  response,
  repositoryStructure
}) {

  const items =
    repositoryStructure?.items || [];


  const folders = items.filter(
    item => item.type === "tree"
  );

  const files = items.filter(
    item => item.type === "blob"
  );


  /*
   * GitHub's tree API can return "tree" for directories
   * and "blob" for files.
   */

  const sortedItems = [...items].sort((a, b) => {

    if (a.type === b.type) {
      return a.path.localeCompare(b.path);
    }

    return a.type === "tree" ? -1 : 1;

  });


  return (

    <section className="analysis-dashboard">


      {/* ==================================================
          Header
          ================================================== */}

      <div className="analysis-header">

        <div className="analysis-header-left">

          <div className="analysis-status">
            <span className="status-dot"></span>
            ANALYSIS COMPLETE
          </div>


          <h2>
            Repository Analysis
          </h2>


          <p>
            Here's a clear overview of what RepoLens found.
          </p>

        </div>


        <a
          href={response.github_url}
          target="_blank"
          rel="noreferrer"
          className="github-repository-link"
        >
          View on GitHub ↗
        </a>

      </div>



      {/* ==================================================
          Repository Identity
          ================================================== */}

      <div className="repository-identity">

        <div className="repository-avatar">
          {response.name?.charAt(0).toUpperCase()}
        </div>


        <div className="repository-title">

          <div className="repository-name-row">

            <h3>
              {response.name}
            </h3>

            <span className="public-badge">
              PUBLIC
            </span>

          </div>


          <p>
            {response.description ||
              "This repository does not have a description yet."}
          </p>


          <div className="repository-owner">

            <span>
              @{response.owner}
            </span>

            <span className="owner-separator">
              /
            </span>

            <strong>
              {response.name}
            </strong>

          </div>

        </div>

      </div>



      {/* ==================================================
          Metrics
          ================================================== */}

      <div className="repository-metrics">


        <MetricCard
          icon="★"
          label="Stars"
          value={formatNumber(response.stars)}
          description="People who starred this project"
        />


        <MetricCard
          icon="⑂"
          label="Forks"
          value={formatNumber(response.forks)}
          description="Developer copies of this project"
        />


        <MetricCard
          icon="◈"
          label="Main Language"
          value={response.language || "Not specified"}
          description="Primary programming language"
        />


        <MetricCard
          icon="⑂"
          label="Default Branch"
          value={response.default_branch}
          description="Main development branch"
        />

      </div>



      {/* ==================================================
          Plain Language Explanation
          ================================================== */}

      <div className="understanding-card">

        <div className="understanding-icon">
          ✦
        </div>


        <div>

          <span className="analysis-eyebrow">
            IN SIMPLE TERMS
          </span>


          <h3>
            What is this repository?
          </h3>


          <p>
            {getSimpleExplanation(
              response.name,
              response.description,
              response.language
            )}
          </p>

        </div>

      </div>



      {/* ==================================================
          Structure Section
          ================================================== */}

      {repositoryStructure &&
        !repositoryStructure.error && (

          <div className="structure-section">


            <div className="structure-heading">

              <div>

                <span className="analysis-eyebrow">
                  CODEBASE MAP
                </span>

                <h3>
                  How is this project organized?
                </h3>

                <p>
                  RepoLens found these files and folders at the
                  root of the repository.
                </p>

              </div>


              <div className="structure-summary">

                <div>
                  <strong>
                    {items.length}
                  </strong>

                  <span>
                    Total items
                  </span>
                </div>


                <div>
                  <strong>
                    {folders.length}
                  </strong>

                  <span>
                    Folders
                  </span>
                </div>


                <div>
                  <strong>
                    {files.length}
                  </strong>

                  <span>
                    Files
                  </span>
                </div>

              </div>

            </div>



            {/* ==================================================
                Important Files
                ================================================== */}

            <div className="structure-highlights">

              {getImportantItems(items).map(
                (item, index) => (

                  <StructureHighlight
                    key={`${item.path}-${index}`}
                    item={item}
                  />

                )
              )}

            </div>



            {/* ==================================================
                Full Tree
                ================================================== */}

            <div className="file-tree">

              <div className="file-tree-header">

                <span>
                  Repository root
                </span>

                <span>
                  {items.length} items
                </span>

              </div>


              <div className="file-tree-body">

                {sortedItems.map(
                  (item, index) => (

                    <TreeItem
                      key={`${item.path}-${index}`}
                      item={item}
                    />

                  )
                )}

              </div>

            </div>



            {/* ==================================================
                Structure Explanation
                ================================================== */}

            <div className="structure-tip">

              <span>
                💡
              </span>

              <p>
                <strong>
                  How to read this:
                </strong>{" "}
                folders contain groups of related code, while
                files contain the actual configuration,
                documentation, or source code used by the project.
              </p>

            </div>


          </div>

        )}



      {repositoryStructure?.error && (

        <div className="structure-error">

          <strong>
            Repository structure could not be loaded.
          </strong>

          <p>
            {repositoryStructure.error}
          </p>

        </div>

      )}

    </section>
  );
}



/* ============================================================
   Metric Card
   ============================================================ */

function MetricCard({
  icon,
  label,
  value,
  description
}) {

  return (

    <div className="metric-card">

      <div className="metric-icon">
        {icon}
      </div>


      <div className="metric-content">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {description}
        </small>

      </div>

    </div>
  );
}



/* ============================================================
   Structure Highlight
   ============================================================ */

function StructureHighlight({ item }) {

  const info = explainStructureItem(item.path);


  return (

    <div className="structure-highlight">

      <div className="highlight-icon">
        {item.type === "tree" ? "📁" : "📄"}
      </div>


      <div>

        <strong>
          {item.path}
        </strong>

        <p>
          {info}
        </p>

      </div>

    </div>
  );
}



/* ============================================================
   Tree Item
   ============================================================ */

function TreeItem({ item }) {

  const isFolder = item.type === "tree";


  return (

    <div className="tree-item">

      <span className="tree-icon">

        {isFolder ? "📁" : "📄"}

      </span>


      <span className="tree-name">
        {item.path}
      </span>


      <span
        className={
          isFolder
            ? "tree-type folder-type"
            : "tree-type file-type"
        }
      >

        {isFolder ? "FOLDER" : "FILE"}

      </span>

    </div>
  );
}



/* ============================================================
   Important Repository Items
   ============================================================ */

function getImportantItems(items) {

  const importantNames = [
    "README.md",
    "package.json",
    "requirements.txt",
    "pyproject.toml",
    "src",
    "app",
    "packages",
    "tests",
    "test",
    ".github",
    "docs",
    "LICENSE"
  ];


  const found = [];


  importantNames.forEach(name => {

    const item = items.find(
      item =>
        item.path === name ||
        item.path.toLowerCase() === name.toLowerCase()
    );


    if (item) {
      found.push(item);
    }

  });


  return found.slice(0, 6);
}



/* ============================================================
   Explain Common Files/Folders
   ============================================================ */

function explainStructureItem(path) {

  const name = path.toLowerCase();


  if (name === "readme.md") {
    return "Usually contains the project's introduction, setup instructions, and documentation.";
  }


  if (name === "package.json") {
    return "Defines the JavaScript project, its dependencies, scripts, and configuration.";
  }


  if (name === "requirements.txt") {
    return "Lists Python packages required to run the project.";
  }


  if (name === "pyproject.toml") {
    return "Contains Python project configuration and dependency information.";
  }


  if (name === "license") {
    return "Explains how other people are legally allowed to use this project.";
  }


  if (name === ".github") {
    return "Contains GitHub-specific configuration such as workflows and issue templates.";
  }


  if (name === "src") {
    return "Usually contains the main source code of the application.";
  }


  if (name === "app") {
    return "Often contains the main application code and components.";
  }


  if (name === "tests" || name === "test") {
    return "Contains automated tests used to check whether the project works correctly.";
  }


  if (name === "docs") {
    return "Contains additional project documentation and guides.";
  }


  if (name === "packages") {
    return "Contains multiple reusable packages or modules that make up the project.";
  }


  if (name.endsWith(".md")) {
    return "A Markdown document, commonly used for project documentation.";
  }


  if (name.endsWith(".json")) {
    return "A JSON configuration or data file used by the project.";
  }


  if (name.endsWith(".js")) {
    return "A JavaScript source or configuration file.";
  }


  if (name.endsWith(".ts")) {
    return "A TypeScript source or configuration file.";
  }


  if (name.endsWith(".py")) {
    return "A Python source code file.";
  }


  if (name.endsWith(".css")) {
    return "A stylesheet that controls the visual appearance of the application.";
  }


  if (name.endsWith(".yml") || name.endsWith(".yaml")) {
    return "A configuration file commonly used for automation and development workflows.";
  }


  if (name.endsWith(".lock")) {
    return "Locks dependency versions so installations remain consistent.";
  }


  return "A repository item detected by RepoLens.";
}



/* ============================================================
   Simple Explanation
   ============================================================ */

function getSimpleExplanation(
  name,
  description,
  language
) {

  if (description) {

    return `${name} is a ${language || "software"} project. In simple terms, it is ${description.toLowerCase()} RepoLens has identified the main information and structure needed to start understanding how this project is built.`;

  }


  return `${name} is a software project primarily using ${language || "multiple technologies"}. RepoLens has analyzed its basic repository information and file structure to give you a starting point for understanding the codebase.`;
}



/* ============================================================
   Number Formatting
   ============================================================ */

function formatNumber(number) {

  if (number === null || number === undefined) {
    return "0";
  }


  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(number);
}



/* ============================================================
   Pipeline Animation
   ============================================================ */

function PipelineTrace() {

  return (

    <svg
      className="landing-pipeline"
      viewBox="0 0 900 120"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >

      <path
        id="landingTracePath"
        d="M40 60 C 180 10, 260 110, 340 60 S 540 10, 620 60 S 800 110, 860 60"
        stroke="url(#landingTraceGrad)"
        strokeWidth="1.2"
        strokeDasharray="3 7"
      />


      <circle
        r="4"
        fill="#7C9CFF"
        className="landing-trace-pulse"
      >

        <animateMotion
          dur="7s"
          repeatCount="indefinite"
          rotate="auto"
          path="M40 60 C 180 10, 260 110, 340 60 S 540 10, 620 60 S 800 110, 860 60"
        />

      </circle>


      <g
        transform="translate(40,60)"
        className="landing-trace-node"
      >

        <circle r="9" />

        <text
          x="0"
          y="4"
          textAnchor="middle"
        >
          {"{ }"}
        </text>

      </g>


      <g
        transform="translate(340,60)"
        className="landing-trace-node"
      >

        <circle r="9" />

        <path
          d="M-3.5 -4 L3.5 -4 M-3.5 0 L3.5 0 M-3.5 4 L1 4"
          strokeWidth="1.2"
        />

      </g>


      <g
        transform="translate(620,60)"
        className="landing-trace-node"
      >

        <circle r="9" />

        <path
          d="M0 -4 L1.4 -0.6 L5 0 L1.4 0.6 L0 4 L-1.4 0.6 L-5 0 L-1.4 -0.6 Z"
        />

      </g>


      <g
        transform="translate(860,60)"
        className="landing-trace-node"
      >

        <circle r="9" />

        <path
          d="M-4.5 0 C -2 -4, 2 -4, 4.5 0 C 2 4, -2 4, -4.5 0 Z"
          strokeWidth="1"
        />

        <circle r="1.3" />

      </g>


      <defs>

        <linearGradient
          id="landingTraceGrad"
          x1="0"
          y1="0"
          x2="900"
          y2="0"
        >

          <stop
            offset="0%"
            stopColor="#7C9CFF"
            stopOpacity="0.6"
          />

          <stop
            offset="50%"
            stopColor="#4FD1C5"
            stopOpacity="0.6"
          />

          <stop
            offset="100%"
            stopColor="#7C9CFF"
            stopOpacity="0.6"
          />

        </linearGradient>

      </defs>

    </svg>
  );
}


export default Landing;