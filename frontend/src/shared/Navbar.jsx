import { Link, useNavigate } from "react-router-dom";
import { logout } from "../auth/auth.utils";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, loading, isTestMaker, isStudent } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // Prevent incorrect render before auth state is resolved
  if (loading) return null;

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <div className="nav-brand">QuizApp</div>

        <nav className="nav-links">
          {/* Guest */}
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/register">Register</Link>}

          {/* Test Maker */}
          {isTestMaker && <Link to="/tests/my">My Tests</Link>}

          {/* Student */}
          {isStudent && <Link to="/results/my">My Results</Link>}

          {/* Everyone */}
          <Link to="/access">Take Test</Link>

          {/* Authenticated */}
          {user && (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
