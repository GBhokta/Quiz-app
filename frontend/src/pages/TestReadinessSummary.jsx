export default function TestReadinessSummary({ test, questions }) {

  // Safety guard (extra protection)
  if (!test) return null;

  const hasQuestions = questions.length > 0;
  const hasDuration = Number(test.duration_minutes) > 0;
  const hasPasscode = test.access?.passcode_version > 0;
  const isActive = test.is_active !== false;

  const checks = [
    { label: "Has questions", ok: hasQuestions },
    { label: "Duration set", ok: hasDuration },
    { label: "Passcode set", ok: hasPasscode },
    { label: "Test active", ok: isActive },
  ];

  const canPublish = checks.every(c => c.ok);

  return (
    <div className="card">
      <h3>Test Readiness</h3>

      <ul>
        {checks.map((c) => (
          <li
            key={c.label}
            className={c.ok ? "text-success" : "text-error"}
          >
            {c.ok ? "✓" : "✗"} {c.label}
          </li>
        ))}
      </ul>

      <button
        className="btn-primary"
        disabled={!canPublish}
      >
        Publish Test
      </button>
    </div>
  );
}
