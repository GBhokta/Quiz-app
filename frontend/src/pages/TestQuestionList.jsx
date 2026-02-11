import { removeQuestionFromTest } from "../api/tests.api";

export default function TestQuestionList({ questions, onChange }) {
  async function handleRemove(qid) {
    await removeQuestionFromTest(qid);
    onChange();
  }

  return (
    <div>
      <h3>Test Questions</h3>

      {questions.length === 0 && (
        <div className="card">
          <p className="text-muted">No questions added yet.</p>
        </div>
      )}

      <div className="grid">
        {questions
          .sort((a, b) => a.question_order - b.question_order)
          .map((q, idx) => (
            <div key={q.id} className="card">
              <strong>Q{idx + 1}</strong>
              <p>{q.question_text}</p>
              <p className="text-muted">
                {q.question_type} · Marks: {q.marks}
              </p>
              <button
                className="text-error"
                onClick={() => handleRemove(q.id)}
              >
                Remove
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
