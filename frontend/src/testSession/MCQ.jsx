export function MCQ({ question, answer, onAnswerChange }) {
  return (
    <div className="form-stack">
      <p>{question.question_text}</p>

      {question.options.map((opt) => (
        <label key={opt.id} className="form-field">
          <input
            type="radio"
            name={`q-${question.id}`}
            value={opt.id}
            checked={answer === opt.id}
            onChange={() => onAnswerChange(question.id, opt.id)}
          />
          {opt.option_text}
        </label>
      ))}
    </div>
  );
}
