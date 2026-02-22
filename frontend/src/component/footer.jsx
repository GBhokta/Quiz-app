import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ 
      backgroundColor: "var(--color-surface)", 
      borderTop: "1px solid var(--color-border)",
      paddingTop: "var(--space-6)",
      paddingBottom: "var(--space-4)",
      position: "relative",
      zIndex: 10
    }}>
      <div className="container">
        {/* Top Section: Brand & Links */}
        <div className="grid grid-auto" style={{ gap: "var(--space-6)", alignItems: "start" }}>
          
          {/* Brand Column */}
          <div className="flex-column" style={{ alignItems: "flex-start", gap: "var(--space-3)" }}>
            {/* Reusing the gradient text class from the Home page! */}
            <h2 className="text-gradient-animate" style={{ fontSize: "1.75rem", margin: 0 }}>
              QuizPlatform
            </h2>
            <p className="text-muted" style={{ maxWidth: "250px", fontSize: "0.95rem" }}>
              Empowering educators and students with seamless, secure, and smart assessments.
            </p>
          </div>

          {/* Product Links */}
          <div className="flex-column footer-links" style={{ alignItems: "flex-start", gap: "var(--space-2)" }}>
            <h4 style={{ marginBottom: "var(--space-1)" }}>Product</h4>
            <Link to="/register">Create a Test</Link>
            <Link to="/access">Join a Test</Link>
            <Link to="/features">Features</Link>
          </div>

          {/* Resources Links */}
          <div className="flex-column footer-links" style={{ alignItems: "flex-start", gap: "var(--space-2)" }}>
            <h4 style={{ marginBottom: "var(--space-1)" }}>Resources</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/guides">Educator Guides</Link>
            <Link to="/contact">Contact Support</Link>
          </div>

          {/* Legal Links */}
          <div className="flex-column footer-links" style={{ alignItems: "flex-start", gap: "var(--space-2)" }}>
            <h4 style={{ marginBottom: "var(--space-1)" }}>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div 
          className="flex-between" 
          style={{ 
            marginTop: "var(--space-6)", 
            paddingTop: "var(--space-4)", 
            borderTop: "1px solid var(--color-border)",
            flexWrap: "wrap",
            gap: "var(--space-3)"
          }}
        >
          <p className="text-muted" style={{ fontSize: "0.875rem", margin: 0 }}>
            © {new Date().getFullYear()} QuizPlatform. All rights reserved.
          </p>
          
          <div className="flex footer-socials" style={{ gap: "var(--space-4)" }}>
            <a href="#" aria-label="Twitter">Twitter</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
            <a href="#" aria-label="GitHub">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}