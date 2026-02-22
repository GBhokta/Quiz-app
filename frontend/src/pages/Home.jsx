import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Footer from "../component/footer";
export default function Home() {
  const { user, isTestMaker, isStudent, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="page relative overflow-hidden">
      {/* Background Decorative Glowing Orbs */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      {/* ================= HERO ================= */}
      <section className="section" style={{ paddingBlock: "8rem 4rem", position: "relative", zIndex: 10 }}>
        <div className="container">
          <div className="flex-column text-center hero-text" style={{ margin: "0 auto", maxWidth: "800px" }}>
            
            {/* Animated Gradient Text */}
            <h1 className="hero-title">
              Create tests. Share securely.<br />
              <span className="text-gradient-animate">Analyze instantly.</span>
            </h1>
            
            <p className="text-muted" style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "1rem auto 2rem" }}>
              A modern quiz platform for educators and students. Simple access,
              strong security, and beautiful analytics that make grading obsolete.
            </p>

            <div className="flex-center" style={{ gap: "var(--space-4)", marginTop: "var(--space-2)" }}>
              {!user && (
                <>
                  <Link to="/register" className="btn-primary btn-glow" style={{ padding: "var(--space-3) var(--space-5)", fontSize: "1.1rem" }}>
                    Start
                  </Link>
                  <Link to="/login" className="btn-primary btn-glow" style={{ padding: "var(--space-3) var(--space-5)", fontSize: "1.1rem" }}>
                    Login
                  </Link>
                </>
              )}

              {isTestMaker && (
                <Link to="/tests/my" className="btn-primary btn-glow" style={{ padding: "var(--space-3) var(--space-5)", fontSize: "1.1rem" }}>
                  Go to Dashboard
                </Link>
              )}

              {isStudent && (
                <Link to="/access" className="btn-primary btn-glow" style={{ padding: "var(--space-3) var(--space-5)", fontSize: "1.1rem" }}>
                  Take a Test
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= INFINITE SCROLLING MARQUEE ================= */}
      <section className="section--tight" style={{ borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface)", position: "relative", zIndex: 10 }}>
        <div className="marquee-container">
          <div className="marquee-content text-muted">
            <span> Mobile-first</span>
            <span className="dot">•</span>
            <span> Secure passcodes</span>
            <span className="dot">•</span>
            <span> Auto-evaluation</span>

            <span className="dot">•</span>
            <span> Instant feedback</span> 
            <span className="dot">•</span>
            {/* Duplicated for seamless loop */}
            <span> Mobile-first</span>
            <span className="dot">•</span>
            <span> Secure passcodes</span>
            <span className="dot">•</span>
            <span> Auto-evaluation</span>
         
            <span className="dot">•</span>
            <span> Instant feedback</span>
          </div>
        </div>
      </section>

      {/* ================= GLASSMORPHISM FEATURES ================= */}
      <section className="section" style={{ position: "relative", zIndex: 10 }}>
        <div className="container">
          <div className="grid grid-3">
            <div className="card-box glass-card card-hover-up">
              <div className="icon-wrapper">📝</div>
              <h3>Create & Manage</h3>
              <p className="text-muted" style={{ marginTop: "var(--space-2)" }}>
                Build MCQ, MSQ, and numerical tests with full control over passcodes, timing, and visibility.
              </p>
            </div>

            <div className="card-box glass-card card-hover-up" style={{ transform: "translateY(20px)" }}>
              <div className="icon-wrapper">🛡️</div>
              <h3>Secure Access</h3>
              <p className="text-muted" style={{ marginTop: "var(--space-2)" }}>
                Students enter using a test code + passcode. Change passcodes anytime to instantly revoke access.
              </p>
            </div>

            <div className="card-box glass-card card-hover-up">
              <div className="icon-wrapper">📊</div>
              <h3>Deep Analytics</h3>
              <p className="text-muted" style={{ marginTop: "var(--space-2)" }}>
                Automatic evaluation, accuracy tracking, time taken, and detailed performance insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ROLE BASED CTA ================= */}
      {!user && (
        <section className="section" style={{ position: "relative", zIndex: 10 }}>
          <div className="container">
            <div className="grid grid-2">
              <div className="card-box glass-card card-hover-up" style={{ textAlign: "center", padding: "var(--space-5)" }}>
                <h3>For Test Creators</h3>
                <p className="text-muted" style={{ margin: "var(--space-3) auto" }}>
                  Create tests, manage passcodes, reuse questions, and monitor performance securely.
                </p>
                <Link to="/register" className="btn-primary btn-glow">
                  Start Creating
                </Link>
              </div>

              <div className="card-box glass-card card-hover-up" style={{ textAlign: "center", padding: "var(--space-5)" }}>
                <h3>For Students</h3>
                <p className="text-muted" style={{ margin: "var(--space-3) auto" }}>
                  Attempt tests using a simple code. No clutter, no confusion, just focus on solving.
                </p>
                <Link to="/access" className="btn-primary btn-glow">
                  Enter Test Code
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}