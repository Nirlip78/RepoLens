import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

/**
 * Login page for RepoLens.
 *
 * This is UI ONLY — there is no real authentication yet.
 * The form stores the email and password in React state.
 *
 * Later, this page will communicate with:
 *
 * React
 *   ↓
 * FastAPI
 *   ↓
 * PostgreSQL
 *   ↓
 * Authentication
 */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    // Placeholder only — no real authentication yet.
    console.log("Sign in with:", {
      email,
      password,
    });
  }

  function handleGitHubLogin() {
    // Placeholder only.
    // Later this will connect to GitHub OAuth.
    console.log("Continue with GitHub clicked");
  }

  return (
    <div className="login-page">

      {/* Background decoration */}
      <div className="login-bg" aria-hidden="true">
        <div className="glow glow-a"></div>
        <div className="glow glow-b"></div>

        <PipelineTrace />
      </div>


      {/* Login Card */}
      <div className="login-card">

        {/* RepoLens Logo */}
        <div className="login-logo">
          <LogoMark />
          <span className="login-logo-text">
            RepoLens
          </span>
        </div>


        {/* Heading */}
        <h1 className="login-title">
          Welcome back to RepoLens
        </h1>

        <p className="login-subtitle">
          Sign in to continue exploring and understanding your codebases.
        </p>


        {/* Login Form */}
        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {/* Email */}
          <label className="login-field">

            <span className="login-label">
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
          <label className="login-field">

            <div className="login-label-row">

              <span className="login-label">
                Password
              </span>

              <a
                href="#"
                className="login-forgot"
              >
                Forgot password?
              </a>

            </div>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

          </label>


          {/* Sign In Button */}
          <button
            type="submit"
            className="login-submit"
          >
            Sign In
          </button>

        </form>


        {/* Signup Navigation */}

        <p className="login-signup">
          Don&apos;t have an account?{" "}

          <Link to="/signup">
            Create an account
          </Link>

        </p>


        {/* Divider */}

        <div className="login-divider">

          <span></span>

          <p>OR</p>

          <span></span>

        </div>


        {/* GitHub Login */}

        <button
          type="button"
          className="login-github"
          onClick={handleGitHubLogin}
        >

          <GitHubMark />

          Continue with GitHub

        </button>

      </div>

    </div>
  );
}


/* ============================================================
   RepoLens Logo
   ============================================================ */

function LogoMark() {
  return (
    <svg
      className="login-logo-mark"
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
        stroke="url(#logoGrad)"
        strokeWidth="1.5"
      />

      <path
        d="M10 9l-3.5 5L10 19"
        stroke="url(#logoGrad)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M18 9l3.5 5-3.5 5"
        stroke="url(#logoGrad)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="14"
        cy="14"
        r="1.6"
        fill="url(#logoGrad)"
      />

      <defs>

        <linearGradient
          id="logoGrad"
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
   GitHub Icon
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
   Code → Repository → AI → Understanding
   ============================================================ */

function PipelineTrace() {
  return (
    <svg
      className="login-pipeline"
      viewBox="0 0 900 120"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >

      {/* Main pipeline line */}

      <path
        id="tracePath"
        d="M40 60 C 180 10, 260 110, 340 60 S 540 10, 620 60 S 800 110, 860 60"
        stroke="url(#traceGrad)"
        strokeWidth="1.2"
        strokeDasharray="3 7"
      />


      {/* Moving pulse */}

      <circle
        r="4"
        fill="#7C9CFF"
        className="trace-pulse"
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
        className="trace-node"
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
        className="trace-node"
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
        className="trace-node"
      >

        <circle r="9" />

        <path
          d="M0 -4 L1.4 -0.6 L5 0 L1.4 0.6 L0 4 L-1.4 0.6 L-5 0 L-1.4 -0.6 Z"
        />

      </g>


      {/* Understanding */}

      <g
        transform="translate(860,60)"
        className="trace-node"
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
          id="traceGrad"
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


export default Login;