import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ResultPage() {
  const { resultId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      try {
        const res = await api.get(`/session/results/${resultId}/`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [resultId]);

  if (loading) return <div>Loading result...</div>;
  if (!data) return <div>No result found.</div>;

  return (
    <div className="page">
      <section className="section">
        <div className="container">

          {/* ================= SUMMARY ================= */}
          <div className="card-box">
            <h2>Test Result</h2>
            <p><strong>Score:</strong> {data.score}</p>
            <p><strong>Percentage:</strong> {data.percentage.toFixed(2)}%</p>
            <p>
              <strong>Correct:</strong> {data.correct} |{" "}
              <strong>Wrong:</strong> {data.wrong} |{" "}
              <strong>Unattempted:</strong> {data.unattempted}
            </p>
          </div>

          {/* ================= QUESTIONS ================= */}
          {data.questions.map((q, index) => (
            <div key={q.question_id} className="card-box" style={{ marginTop: "20px" }}>

              <h4>
                Question {index + 1}
              </h4>

              <p>{q.question_text}</p>

              {/* ---------- MCQ / MSQ ---------- */}
              {q.question_type !== "NAT" && q.options.map((opt) => {
                const isSelected = q.selected_options.includes(opt.id);

                let style = {};

                if (opt.is_correct) {
                  style = { color: "green", fontWeight: "bold" };
                }

                if (isSelected && !opt.is_correct) {
                  style = { color: "red" };
                }

                return (
                  <div key={opt.id} style={{ marginBottom: "6px" }}>
                    <span style={style}>
                      {opt.option_text}
                    </span>

                    {isSelected && !opt.is_correct && (
                      <span style={{ marginLeft: "10px", color: "red" }}>
                        (Your Answer)
                      </span>
                    )}

                    {opt.is_correct && (
                      <span style={{ marginLeft: "10px", color: "green" }}>
                        (Correct Answer)
                      </span>
                    )}
                  </div>
                );
              })}

              {/* ---------- NAT ---------- */}
              {q.question_type === "NAT" && (
                <div style={{ marginTop: "10px" }}>
                  <p>
                    <strong>Your Answer:</strong>{" "}
                    {q.numerical_answer || "Not Attempted"}
                  </p>
                </div>
              )}

              {/* ---------- STATUS ---------- */}
              <p style={{ marginTop: "10px" }}>
                {q.is_correct ? (
                  <span style={{ color: "green" }}>✔ Correct</span>
                ) : (
                  <span style={{ color: "red" }}>✘ Incorrect</span>
                )}
              </p>

              <p><strong>Marks Awarded:</strong> {q.marks_awarded}</p>

              {/* ---------- EXPLANATION ---------- */}
              {q.explanation && (
                <div style={{ marginTop: "10px", background: "#f4f4f4", padding: "10px" }}>
                  <strong>Explanation:</strong>
                  <p>{q.explanation}</p>
                </div>
              )}

            </div>
          ))}

        </div>
      </section>
    </div>
  );
}