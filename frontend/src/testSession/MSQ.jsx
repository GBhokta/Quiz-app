export function MSQ({ question, answer = [], onAnswerChange }) {
  function toggleOption(optionId) {
    if (answer.includes(optionId)) {
      onAnswerChange(
        question.id,
        answer.filter((id) => id !== optionId)
      );
    } else {
      onAnswerChange(question.id, [...answer, optionId]);
    }
  }

  return (
    <div className="form-stack">
      <p>{question.question_text}</p>

      {question.options.map((opt) => (
        <label key={opt.id} className="form-field">
          <input
            type="checkbox"
            checked={answer.includes(opt.id)}
            onChange={() => toggleOption(opt.id)}
          />
          {opt.option_text}
        </label>
      ))}
    </div>
  );
}
