import { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // UI only for now.
    // Later this information will be sent to FastAPI.
    console.log("Create account:", {
      name,
      email,
      password,
    });
  }

  function handleGitHubSignup() {
    // Placeholder for GitHub OAuth.
    // This will be connected to FastAPI later.
    console.log("Continue with GitHub clicked");
  }

  return (
    <div className="signup-page">

      {/* =====================================================
          BACKGROUND DECORATION
          ===================================================== */}

      <div className="signup-bg" aria-hidden="true">

        <div className="signup-glow signup-glow-a"></div>

        <div className="signup-glow signup-glow-b"></div>

        <PipelineTrace />

      </div>


      {/* =====================================================
          SIGNUP CARD
          ===================================================== */}

      <div className="signup-card">

        {/* Logo */}

        <div className="signup-logo">

          <LogoMark />

          <span className="signup-logo-text">
            RepoLens
          </span>

        </div>


        {/* Heading */}

        <h1 className="signup-title">
          Create your RepoLens account
        </h1>

        <p className="signup-subtitle">
          Start understanding and navigating your codebases with AI.
        </p>


        {/* ===================================================
            SIGNUP FORM
            =================================================== */}

        <form
          className="signup-form"
          onSubmit={handleSubmit}
        >

          {/* Name */}

          <label className="signup-field">

            <span className="signup-label">
              Name
            </span>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />

          </label>


          {/* Email */}

          <label className="signup-field">

            <span className="signup-label">
              Email
            </span>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

          </label>


          {/* Password */}

          <label className="signup-field">

            <span className="signup-label">
              Password
            </span>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />

          </label>


          {/* Confirm Password */}

          <label className="signup-field">

            <span className="signup-label">
              Confirm Password
            </span>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />

          </label>


          {/* Create Account */}

          <button
            type="submit"
            className="signup-submit"
          >
            Create Account
          </button>

        </form>


        {/* ===================================================
            LOGIN LINK
            =================================================== */}

        <p className="signup-login">

          Already have an account?{" "}

          <Link to="/login">
            Sign in
          </Link>

        </p>


        {/* ===================================================
            DIVIDER
            =================================================== */}

        <div className="signup-divider">

          <span></span>

          <p>OR</p>

          <span></span>

        </div>


        {/* ===================================================
            GITHUB SIGNUP
            =================================================== */}

        <button
          type="button"
          className="signup-github"
          onClick={handleGitHubSignup}
        >

          <GitHubMark />

          Continue with GitHub

        </button>

      </div>

    </div>
  );
}


/* ============================================================
   REPO LENS LOGO
   ============================================================ */

function LogoMark() {
  return (
    <svg
      className="signup-logo-mark"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
    >

      <rect
        x="1"
        y="1"
        width="26"
        height="26"
        rx="7"
        stroke="url(#signupLogoGrad)"
        strokeWidth="1.5"
      />

      <path
        d="M10 9l-3.5 5L10 19"
        stroke="url(#signupLogoGrad)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M18 9l3.5 5-3.5 5"
        stroke="url(#signupLogoGrad)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="14"
        cy="14"
        r="1.6"
        fill="url(#signupLogoGrad)"
      />

      <defs>

        <linearGradient
          id="signupLogoGrad"
          x1="0"
          y1="0"
          x2="28"
          y2="28"
        >

          <stop
            offset="0%"
            stopColor="#7C9CFF"
          />

          <stop
            offset="100%"
            stopColor="#4FD1C5"
          />

        </linearGradient>

      </defs>

    </svg>
  );
}


/* ============================================================
   GITHUB ICON
   ============================================================ */

function GitHubMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="currentColor"
    >

      <path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.6 2.29 6.65 5.47 7.73.4.08.55-.18.55-.39 0-.19-.01-.82-.01-1.49-2.01.38-2.53-.5-2.7-.96-.09-.24-.48-.96-.82-1.16-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.24 1.87.89 2.33.68.07-.53.28-.89.51-1.1-1.78-.2-3.64-.91-3.64-4.02 0-.89.31-1.61.82-2.18-.08-.2-.36-1.03.08-2.15 0 0 .67-.22 2.2.83a7.4 7.4 0 0 1 4 0c1.53-1.06 2.2-.83 2.2-.83.44 1.12.16 1.95.08 2.15.51.57.82 1.28.82 2.18 0 3.12-1.87 3.81-3.65 4.02.29.26.54.76.54 1.53 0 1.11-.01 2-.01 2.27 0 .21.15.48.55.39A8.14 8.14 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z" />

    </svg>
  );
}


/* ============================================================
   PIPELINE
   Code → Repository → AI → Understanding
   ============================================================ */

function PipelineTrace() {
  return (
    <svg
      className="signup-pipeline"
      viewBox="0 0 900 120"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >

      {/* Main pipeline */}

      <path
        id="signupTracePath"
        d="M40 60 C 180 10, 260 110, 340 60 S 540 10, 620 60 S 800 110, 860 60"
        stroke="url(#signupTraceGrad)"
        strokeWidth="1.2"
        strokeDasharray="3 7"
      />


      {/* Moving pulse */}

      <circle
        r="4"
        fill="#7C9CFF"
        className="signup-trace-pulse"
      >

        <animateMotion
          dur="7s"
          repeatCount="indefinite"
          rotate="auto"
          path="M40 60 C 180 10, 260 110, 340 60 S 540 10, 620 60 S 800 110, 860 60"
        />

      </circle>


      {/* Code node */}

      <g
        transform="translate(40,60)"
        className="signup-trace-node"
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


      {/* Repository node */}

      <g
        transform="translate(340,60)"
        className="signup-trace-node"
      >

        <circle r="9" />

        <path
          d="M-3.5 -4 L3.5 -4 M-3.5 0 L3.5 0 M-3.5 4 L1 4"
          strokeWidth="1.2"
        />

      </g>


      {/* AI node */}

      <g
        transform="translate(620,60)"
        className="signup-trace-node"
      >

        <circle r="9" />

        <path
          d="M0 -4 L1.4 -0.6 L5 0 L1.4 0.6 L0 4 L-1.4 0.6 L-5 0 L-1.4 -0.6 Z"
        />

      </g>


      {/* Understanding node */}

      <g
        transform="translate(860,60)"
        className="signup-trace-node"
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
          id="signupTraceGrad"
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


export default Signup;