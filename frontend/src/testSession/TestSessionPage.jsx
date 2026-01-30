import { useEffect, useState } from "react";
import { startSession, submitSession } from "../api/session.api";
import { useNavigate } from "react-router-dom";

import QuestionRenderer from "./QuestionRenderer";
import Timer from "./Timer";
import QuestionPalette from "./QuestionPalette";

export default function TestSessionPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visited, setVisited] = useState({});
  const [marked, setMarked] = useState({});

  /* ---------------- Answer Handling ---------------- */

  function handleAnswerChange(questionId, value) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }

  /* ---------------- Navigation ---------------- */

  function goNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }

  /* ---------------- Mark for Review ---------------- */

  function toggleMark() {
    const qid = questions[currentIndex].id;
    setMarked((prev) => ({
      ...prev,
      [qid]: !prev[qid],
    }));
  }

  /* ---------------- Timer ---------------- */

  function handleTimeUp() {
    handleSubmit(true);
  }

  /* ---------------- Submit ---------------- */

  async function handleSubmit(isAuto = false) {
    try {
      setLoading(true);

      await submitSession({
        session_id: session.id,
        answers: answers,
      });

      sessionStorage.removeItem("session_token");
      sessionStorage.removeItem("test_id");
      sessionStorage.removeItem(`session_state_${session.id}`);
      sessionStorage.removeItem("started_at");

      navigate(`/results/${session.id}`);
    } catch {
      setError("Failed to submit test. Please try again.");
      setLoading(false);
    }
  }

  /* ---------------- Session Init ---------------- */

  useEffect(() => {
    async function initSession() {
      const testId = sessionStorage.getItem("test_id");
      const sessionToken = sessionStorage.getItem("session_token");

      if (!testId || !sessionToken) {
        setError("Session expired. Please re-enter test.");
        setLoading(false);
        return;
      }

      try {
        const res = await startSession({
          test_id: testId,
          session_token: sessionToken,
        });

        setSession(res.data);
        setQuestions(res.data.questions || []);

        // timer start (only once)
        if (!sessionStorage.getItem("started_at")) {
          sessionStorage.setItem("started_at", Date.now().toString());
        }

        // restore saved state
        const saved = sessionStorage.getItem(
          `session_state_${res.data.id}`
        );

        if (saved) {
          const parsed = JSON.parse(saved);
          setCurrentIndex(parsed.currentIndex ?? 0);
          setAnswers(parsed.answers ?? {});
          setVisited(parsed.visited ?? {});
          setMarked(parsed.marked ?? {});
        }
      } catch {
        setError("Unable to start test session.");
      } finally {
        setLoading(false);
      }
    }

    initSession();
  }, []);

  /* ---------------- Persist State ---------------- */

  useEffect(() => {
    if (!session) return;

    const state = {
      currentIndex,
      answers,
      visited,
      marked,
    };

    sessionStorage.setItem(
      `session_state_${session.id}`,
      JSON.stringify(state)
    );
  }, [currentIndex, answers, visited, marked, session]);

  /* ---------------- Track Visited ---------------- */

  useEffect(() => {
    if (questions[currentIndex]) {
      setVisited((prev) => ({
        ...prev,
        [questions[currentIndex].id]: true,
      }));
    }
  }, [currentIndex, questions]);

  /* ---------------- Guards ---------------- */

  if (loading) {
    return (
      <div className="page page-center">
        <div className="container">
          <p className="loader">Loading test…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page page-center">
        <div className="container">
          <p className="text-error">{error}</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="page page-center">
        <div className="container">
          <p className="text-muted">No questions available.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  /* ---------------- Render ---------------- */

  return (
    <div className="page">
      {/* Header */}
      <section className="section section--tight">
        <div className="container">
          <div className="card flex-between">
            <div>
              <h2>{session?.test_title || "Test"}</h2>
              <p className="text-muted">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>

            <Timer
              durationMinutes={session?.duration_minutes || 0}
              onTimeUp={handleTimeUp}
            />
          </div>
        </div>
      </section>

      {/* Question */}
      <section className="section">
        <div className="container">
          <div className="card">
            <QuestionRenderer
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onAnswerChange={handleAnswerChange}
            />

            <button type="button" onClick={toggleMark}>
              {marked[currentQuestion.id]
                ? "Unmark Review"
                : "Mark for Review"}
            </button>

            <div className="btn-row">
              <button
                className="btn-primary"
                type="button"
                onClick={goPrev}
                disabled={currentIndex === 0}
              >
                Previous
              </button>

              <button
                className="btn-primary"
                type="button"
                onClick={goNext}
                disabled={currentIndex === questions.length - 1}
              >
                Next
              </button>

              <button
                className="btn-primary"
                type="button"
                onClick={() => handleSubmit(false)}
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Palette */}
      <section className="section section--tight">
        <div className="container">
          <QuestionPalette
            questions={questions}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            answers={answers}
            visited={visited}
            marked={marked}
          />

          <div className="card">
            <h4>Legend</h4>
            <ul>
              <li className="text-muted">⬜ Not Visited</li>
              <li className="text-muted">⬛ Visited</li>
              <li className="text-success">Answered</li>
              <li className="text-warning">Marked for Review</li>
              <li style={{ color: "#7c3aed" }}>
                Marked + Answered
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
