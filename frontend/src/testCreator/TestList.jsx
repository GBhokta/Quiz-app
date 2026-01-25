import { useEffect, useState } from "react";
import { getMyTests } from "../api/tests.api";
import { Link } from "react-router-dom";

export default function TestList() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getMyTests();
        setTests(res.data || []);
      } catch {
        setError("Failed to load tests.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="page page-center">
        <div className="container">
          <p className="text-muted">Loading tests…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="section">
        <div className="container">
          <div className="card flex-between">
            <h2>My Tests</h2>
            <Link className="btn-primary" to="/tests/create">Create Test</Link>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          {error && <p className="text-error">{error}</p>}
          {tests.length === 0 ? (
            <div className="card">
              <p className="text-muted">No tests yet.</p>
            </div>
          ) : (
            <div className="grid grid-auto">
              {tests.map((t) => (
                <div key={t.id} className="card">
                  <h3>{t.title}</h3>
                  <p className="text-muted">{t.description}</p>
                  <Link to={`/tests/${t.id}/edit`}>Edit</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
