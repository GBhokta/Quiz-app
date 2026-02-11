import { useEffect, useState } from "react";
import { getPublicQuestions } from "../api/questions.api";

export default function PublicQuestionsList({ selected, onSelect }) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await getPublicQuestions();
      setQuestions(res.data || []);
    }
    load();
  }, []);

  function toggle(id) {
    onSelect(
      selected.includes(id)
        ? selected.filter(q => q !== id)
        : [...selected, id]
    );
  }

  return (
    <div className="grid">
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
