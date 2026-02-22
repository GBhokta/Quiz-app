import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function TestSessionPage() {
  const navigate = useNavigate();

  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // START TEST
  // ===============================
  useEffect(() => {
    const test_id = sessionStorage.getItem("test_id");
    const session_token = sessionStorage.getItem("session_token");

    async function startTest() {
      try {
        const res = await api.post("/session/start/", {
          test_id,
          session_token,
        });

        setAttemptId(res.data.attempt_id);
        setQuestions(res.data.questions);
        setTimeLeft(res.data.duration_minutes * 60);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    startTest();
  }, []);

  // ===============================
  // TIMER
  // ===============================
  useEffect(() => {
    if (!timeLeft) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // ===============================
  // HANDLE ANSWER CHANGE
  // ===============================
  function handleAnswerChange(questionId, value, type) {
    if (type === "MSQ") {
      setAnswers((prev) => {
        const existing = prev[questionId] || [];
        if (existing.includes(value)) {
          return {
            ...prev,
            [questionId]: existing.filter((v) => v !== value),
          };
        } else {
          return {
            ...prev,
            [questionId]: [...existing, value],
          };
        }
      });
    } else {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value,
      }));
    }
  }

  // ===============================
  // SUBMIT TEST
  // ===============================
  async function handleSubmit() {
    try {
      const res = await api.post("/session/submit/", {
        attempt_id: attemptId,
        answers,
      });

      navigate(`/results/${res.data.result_id}`);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div>Loading test...</div>;
  if (!questions.length) return <div>No questions found.</div>;

  const currentQuestion = questions[currentIndex];

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="page">
      <section className="section">
        <div className="container">

          {/* Timer */}
          <div className="card-box">
            <h3>
              Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </h3>
          </div>

          {/* Question */}
          <div className="card-box" style={{ marginTop: "20px" }}>
            <h4>
              Question {currentIndex + 1} of {questions.length}
            </h4>

            <p>{currentQuestion.text}</p>

            {/* MCQ */}
            {currentQuestion.type === "MCQ" &&
              currentQuestion.options.map((opt) => (
                <div key={opt.id}>
                  <input
                    type="radio"
                    name={`q-${currentQuestion.id}`}
                    value={opt.id}
                    checked={
                      answers[currentQuestion.id] === String(opt.id)
                    }
                    onChange={() =>
                      handleAnswerChange(
                        currentQuestion.id,
                        String(opt.id),
                        "MCQ"
                      )
                    }
                  />
                  {opt.text}
                </div>
              ))}

            {/* MSQ */}
            {currentQuestion.type === "MSQ" &&
              currentQuestion.options.map((opt) => (
                <div key={opt.id}>
                  <input
                    type="checkbox"
                    value={opt.id}
                    checked={
                      answers[currentQuestion.id]?.includes(String(opt.id)) ||
                      false
                    }
                    onChange={() =>
                      handleAnswerChange(
                        currentQuestion.id,
                        String(opt.id),
                        "MSQ"
                      )
                    }
                  />
                  {opt.text}
                </div>
              ))}

            {/* NAT */}
            {currentQuestion.type === "NAT" && (
              <input
                type="text"
                value={answers[currentQuestion.id] || ""}
                onChange={(e) =>
                  handleAnswerChange(
                    currentQuestion.id,
                    e.target.value,
                    "NAT"
                  )
                }
              />
            )}
          </div>

          {/* Navigation */}
          <div style={{ marginTop: "20px" }}>
            {currentIndex > 0 && (
              <button
                className="btn-primary"
                onClick={() => setCurrentIndex((prev) => prev - 1)}
              >
                Previous
              </button>
            )}

            {currentIndex < questions.length - 1 ? (
              <button
                className="btn-primary"
                style={{ marginLeft: "10px" }}
                onClick={() => setCurrentIndex((prev) => prev + 1)}
              >
                Next
              </button>
            ) : (
              <button
                className="btn-primary"
                style={{ marginLeft: "10px" }}
                onClick={handleSubmit}
              >
                Submit Test
              </button>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}