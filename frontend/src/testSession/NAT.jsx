export function NAT({ question, answer, onAnswerChange }) {
  return (
    <div className="form-stack">
      <p>{question.question_text}</p>

      <input
        type="number"
        value={answer ?? ""}
        onChange={(e) =>
          onAnswerChange(question.id, e.target.value)
        }
        placeholder="Enter numeric answer"
      />
    </div>
  );
}
