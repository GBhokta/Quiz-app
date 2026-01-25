import { useEffect, useState } from "react";
import { startSession } from "../api/session.api";
import QuestionRenderer from "./QuestionRenderer";
import Timer from "./Timer";
import { submitSession } from "../api/session.api";
import { useNavigate } from "react-router-dom";

export default function TestSessionPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  function handleAnswerChange(questionId, value) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }
function handleTimeUp() {
  handleSubmit(true);
}


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
const navigate = useNavigate();

async function handleSubmit(isAuto = false) {
  try {
    setLoading(true);

    await submitSession({
      session_id: session.id,
      answers: answers,
    });

    sessionStorage.removeItem("session_token");
    sessionStorage.removeItem("test_id");

    navigate(`/results/${session.id}`);
  } catch (err) {
    setError("Failed to submit test. Please try again.");
  } finally {
    setLoading(false);
  }
}


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
        const response = await startSession({
          test_id: testId,
          session_token: sessionToken,
        });

        setSession(response.data);
        setQuestions(response.data.questions || []);
      } catch (err) {
        setError("Unable to start test session.");
      } finally {
        setLoading(false);
      }
    }

    initSession();
  }, []);

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

  return (
    <div className="page">
      {/* Test Header */}
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


      {/* Question Area */}
    <section className="section">
    <div className="container">
        <div className="card">
        <QuestionRenderer
            question={currentQuestion}
            answer={answers[currentQuestion.id]}
            onAnswerChange={handleAnswerChange}
        />

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
            <button className="btn-primary"
            type="button"
            onClick={() => handleSubmit(false)}>
  
                Submit Test
            </button>

        </div>
        </div>
    </div>
    </section>

    </div>
  );
}
