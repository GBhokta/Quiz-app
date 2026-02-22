import axios from "axios";
import { useState } from "react";
import { publishTest } from "../api/tests.api";

export default function TestReadinessSummary({ test, questions, onPublished }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handlePublish = async () => {
    try {
      setLoading(true);
      setError("");

      await publishTest(test.id);

      if (onPublished) onPublished();  // refresh parent
    } catch (err) {
      setError(err.response?.data?.error || "Failed to publish");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Test Readiness</h3>

      <ul>
        {checks.map((c) => (
          <li key={c.label} className={c.ok ? "text-success" : "text-error"}>
            {c.ok ? "✓" : "✗"} {c.label}
          </li>
        ))}
      </ul>

      {error && <p className="text-error">{error}</p>}

      <button
        className="btn-primary"
        disabled={!canPublish || loading}
        onClick={handlePublish}
      >
        {loading ? "Publishing..." : "Publish Test"}
      </button>
    </div>
  );
}
