export default function QuestionPalette({
  questions,
  currentIndex,
  setCurrentIndex,
  answers,
  visited,
  marked,
}) {
  function getClass(q) {
    if (marked[q.id] && answers[q.id]) return "palette-marked-answered";
    if (marked[q.id]) return "palette-marked";
    if (answers[q.id]) return "palette-answered";
    if (visited[q.id]) return "palette-visited";
    return "palette-not-visited";
  }

  return (
    <div className="card">
      <h3>Question Palette</h3>

      <div className="grid grid-auto">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`palette-btn ${getClass(q)}`}
            disabled={currentIndex === idx}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
