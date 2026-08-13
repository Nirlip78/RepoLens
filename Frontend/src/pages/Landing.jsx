import { Link } from "react-router-dom";
import "./Landing.css";


function Landing() {
  return (
    <div className="landing-page">


      {/* Navbar */}
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



      {/* Hero Section */}
      <main className="landing-hero">


        {/* Animated Pipeline Background */}
        <div className="landing-pipeline-bg" aria-hidden="true">
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



        {/* Repository Input */}
        <div className="repo-input-container">


          <div className="repo-input-wrapper">
            <span className="repo-input-icon">⌘</span>


            <input
              type="text"
              placeholder="Paste a GitHub repository URL..."
            />
          </div>


          <button className="analyze-button">
            Analyze Repository →
          </button>


        </div>


        <p className="hero-note">
          No repository connected yet · Try any public GitHub repository
        </p>



        {/* Simple Flow */}
        <div className="hero-flow">
          <span>REPOSITORY</span>


          <div className="flow-line"></div>


          <span>ANALYSIS</span>


          <div className="flow-line"></div>


          <span>UNDERSTANDING</span>


          <div className="flow-line"></div>


          <span>AI INSIGHTS</span>
        </div>


      </main>



      {/* Main Features */}
      <section className="core-section">


        <div className="section-heading">
          <p className="section-label">CORE CAPABILITIES</p>


          <h2>What do you want to understand?</h2>


          <p>
            Choose how RepoLens should help you explore a repository.
          </p>
        </div>



        <div className="feature-grid">


          {/* Feature 1 */}
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


            <a href="#overview" className="feature-link">
              Explore repository →
            </a>


          </div>



          {/* Feature 2 */}
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


            <a href="#code" className="feature-link">
              Explore code →
            </a>


          </div>



          {/* Feature 3 */}
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


            <a href="#changes" className="feature-link">
              Plan a change →
            </a>


          </div>


        </div>


      </section>



      {/* How It Works */}
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



        <a href="#learn" className="learn-more-button">
          Learn how RepoLens works →
        </a>


      </section>



      {/* Footer */}
      <footer className="landing-footer">


        <div className="footer-brand">


          <Link to="/" className="landing-brand">
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

      {/* Main pipeline line */}

      <path
        id="landingTracePath"
        d="M40 60 C 180 10, 260 110, 340 60 S 540 10, 620 60 S 800 110, 860 60"
        stroke="url(#landingTraceGrad)"
        strokeWidth="1.2"
        strokeDasharray="3 7"
      />


      {/* Moving pulse */}

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


      {/* Code */}

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


      {/* Repository */}

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


      {/* AI */}

      <g
        transform="translate(620,60)"
        className="landing-trace-node"
      >

        <circle r="9" />

        <path
          d="M0 -4 L1.4 -0.6 L5 0 L1.4 0.6 L0 4 L-1.4 0.6 L-5 0 L-1.4 -0.6 Z"
        />

      </g>


      {/* Understanding */}

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


      {/* Gradient */}

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