import { useEffect, useState } from "react";
import { getMyQuestions } from "../api/questions.api";

export default function MyQuestionsList({ selected, onSelect }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getMyQuestions();
        setQuestions(res.data || []);
      } catch (err) {
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function toggle(id) {
    if (selected.includes(id)) {
      onSelect(selected.filter(q => q !== id));
    } else {
      onSelect([...selected, id]);
    }
  }

  if (loading) {
    return <p className="text-muted">Loading questions…</p>;
  }

  if (error) {
    return <p className="text-error">{error}</p>;
  }

  if (questions.length === 0) {
    return (
      <div className="card">
        <p className="text-muted">You haven’t created any questions yet.</p>
      </div>
    );
  }

  return (
    <div className="grid section">
        <h2>My Questions</h2>
      {questions.map(q => (
        <div key={q.id} className="card">
          <label className="flex" style={{ gap: "var(--space-3)" }}>
            <input
              type="checkbox"
              checked={selected.includes(q.id)}
              onChange={() => toggle(q.id)}
            />
            <div>
              <p>{q.question_text}</p>
              <p className="text-muted">
                {q.question_type} · {q.difficulty}
              </p>
            </div>
          </label>
        </div>
      ))}
    </div>
  );
}
