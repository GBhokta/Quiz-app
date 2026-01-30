import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
  const { user, isTestMaker, isStudent } = useAuth();

  return (
    <div className="page">
      {/* Welcome */}
      <section className="section">
        <div className="container">
          <div className="card">
            <h2>Welcome, {user?.name || "User"} 👋</h2>
            <p className="text-muted">
              What would you like to do today?
            </p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="section section--tight">
        <div className="container grid grid-2">
          {isTestMaker && (
            <>
              <div className="card">
                <h3>Create a Test</h3>
                <p className="text-muted">
                  Build a new test and add questions.
                </p>
                <Link className="btn-primary" to="/tests/create">
                  Create Test
                </Link>
              </div>

              <div className="card">
                <h3>My Tests</h3>
                <p className="text-muted">
                  View and manage tests you created.
                </p>
                <Link className="btn-primary" to="/tests/my">
                  View Tests
                </Link>
              </div>
            </>
          )}

          {isStudent && (
            <>
              <div className="card">
                <h3>Take a Test</h3>
                <p className="text-muted">
                  Enter a test code and start attempting.
                </p>
                <Link className="btn-primary" to="/access">
                  Enter Test
                </Link>
              </div>

              <div className="card">
                <h3>My Results</h3>
                <p className="text-muted">
                  Review your past test results.
                </p>
                <Link className="btn-primary" to="/results/my">
                  View Results
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
