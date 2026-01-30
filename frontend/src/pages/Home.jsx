import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { user, isTestMaker, isStudent, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="page">
      {/* ================= HERO ================= */}
      <section className="section">
        <div className="container">
          <div className="card text-center flex-column">
            <h1>Create tests. Share securely. Analyze results.</h1>
            <p className="text-muted">
              A modern quiz platform for educators and students. Simple access,
              strong security, and clean analytics.
            </p>

            {!user && (
              <div className="flex-center" style={{ gap: "var(--space-3)" }}>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn-primary">
                  Login
                </Link>
              </div>
            )}

            {isTestMaker && (
              <Link to="/tests/my" className="btn-primary">
                Go to Dashboard
              </Link>
            )}

            {isStudent && (
              <Link to="/access" className="btn-primary">
                Take a Test
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            <div className="card">
              <h3>Create & Manage Tests</h3>
              <p className="text-muted">
                Build MCQ, MSQ, and numerical tests with full control over
                passcodes, timing, and visibility.
              </p>
            </div>

            <div className="card">
              <h3>Secure Test Access</h3>
              <p className="text-muted">
                Students enter using test code + passcode. Change passcodes
                anytime to instantly revoke access.
              </p>
            </div>

            <div className="card">
              <h3>Instant Results & Analytics</h3>
              <p className="text-muted">
                Automatic evaluation, accuracy, time taken, and performance
                insights for every attempt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ROLE BASED CTA ================= */}
      {!user && (
        <section className="section">
          <div className="container">
            <div className="grid grid-2">
              <div className="card">
                <h3>For Test Creators</h3>
                <p className="text-muted">
                  Create tests, manage passcodes, reuse questions, and monitor
                  performance securely.
                </p>
                <Link to="/register" className="btn-primary">
                  Create Tests
                </Link>
              </div>

              <div className="card">
                <h3>For Students</h3>
                <p className="text-muted">
                  Attempt tests using a simple code. No clutter, no confusion,
                  just focus on solving.
                </p>
                <Link to="/access" className="btn-primary">
                  Enter Test Code
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= TRUST STRIP ================= */}
      <section className="section section--tight">
        <div className="container flex-center">
          <div className="card text-center">
            <p className="text-muted">
              Mobile-first • Secure passcodes • Auto-evaluation • Scales to
              thousands of students
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
