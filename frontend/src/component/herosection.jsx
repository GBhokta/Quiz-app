export const HeroSection = ({ user, isTestMaker, isStudent }) => {
  return (
    <section className="section" style={{ paddingBlock: "8rem 4rem", position: "relative", zIndex: 10 }}>
      <div className="container">
        <div className="flex-column text-center hero-text" style={{ margin: "0 auto", maxWidth: "800px" }}>
          
          <h1 className="hero-title">
            Create tests. Share securely.<br />
            <span className="text-gradient-animate">Analyze instantly.</span>
          </h1>
          
          <p className="text-muted" style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "1rem auto 2rem" }}>
            A modern quiz platform for educators and students.
          </p>

          <div className="flex-center" style={{ gap: "var(--space-4)", marginTop: "var(--space-2)" }}>

            {!user && (
              <>
                <Link to="/register" className="btn-primary btn-glow">
                  Start
                </Link>
                <Link to="/login" className="btn-primary btn-glow">
                  Login
                </Link>
              </>
            )}

            {isTestMaker && (
              <Link to="/tests/my" className="btn-primary btn-glow">
                Go to Dashboard
              </Link>
            )}

            {isStudent && (
              <Link to="/access" className="btn-primary btn-glow">
                Take a Test
              </Link>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};