import { Link, useNavigate } from "react-router-dom";
import { logout } from "../auth/auth.utils";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, loading, isTestMaker, isStudent, loadUser } = useAuth();

  const handleLogout = () => {
    logout();        // clears token/localStorage
    loadUser();      // updates context → forces re-render
    navigate("/login");
  };

  if (loading) return null;

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <div className="nav-brand">
          <Link to="/">QuizApp</Link>
        </div>

        <nav className="nav-links">
          {/* Guest only */}
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/register">Register</Link>}

          {/* Authenticated */}
          {user && isTestMaker && <Link to="/tests/my">My Tests</Link>}
          {user && isStudent && <Link to="/results/my">My Results</Link>}
          {user && <Link to="/dashboard">Dashboard</Link>}
          {user && isStudent && <p>Student</p>} 
          {user && isTestMaker && <p>Test Maker</p>}
          <Link to="/access">Take Test</Link>

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
