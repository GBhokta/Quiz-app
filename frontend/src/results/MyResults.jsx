import { useEffect, useState } from "react";
import { getMyResults } from "../api/results.api";

export default function MyResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getMyResults();
        setResults(res.data || []);
      } catch {
        setError("Failed to load results.");
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
          <p className="text-muted">Loading results…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="section">
        <div className="container">
          <div className="card">
            <h2>My Results</h2>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          {error && <p className="text-error">{error}</p>}

          {results.length === 0 ? (
            <div className="card">
              <p className="text-muted">
                You haven’t attempted any tests yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-auto">
              {results.map((r) => (
                <div key={r.id} className="card">
                  <h3>{r.test_title}</h3>

                  <p className="text-muted">
                    Score: {r.score} / {r.total_marks}
                  </p>

                  <p className="text-muted">
                    Accuracy: {r.percentage}%
                  </p>

                  <p className="text-muted">
                    Time Taken: {r.time_taken} mins
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
