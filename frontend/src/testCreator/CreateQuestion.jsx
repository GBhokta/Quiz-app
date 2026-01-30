import { useState } from "react";
import { createQuestion } from "../api/questions.api";

export default function CreateQuestion({ testId, onCreated }) {
  const [formData, setFormData] = useState({
    question_text: "",
    question_type: "MCQ",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createQuestion({
        ...formData,
        test_id: testId,
      });

      // reset after success
      setFormData({
        question_text: "",
        question_type: "MCQ",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "",
      });

      onCreated?.();
    } catch {
      setError("Failed to create question.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>Add Question</h3>

      {error && <p className="text-error">{error}</p>}

      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Question</label>
          <textarea
            name="question_text"
            value={formData.question_text}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Question Type</label>
          <select
            name="question_type"
            value={formData.question_type}
            onChange={handleChange}
          >
            <option value="MCQ">MCQ</option>
            <option value="MSQ">MSQ</option>
            <option value="NAT">NAT</option>
          </select>
        </div>

        {formData.question_type !== "NAT" && (
          <>
            <div className="form-field">
              <label>Option A</label>
              <input name="option_a" value={formData.option_a} onChange={handleChange} />
            </div>

            <div className="form-field">
              <label>Option B</label>
              <input name="option_b" value={formData.option_b} onChange={handleChange} />
            </div>

            <div className="form-field">
              <label>Option C</label>
              <input name="option_c" value={formData.option_c} onChange={handleChange} />
            </div>

            <div className="form-field">
              <label>Option D</label>
              <input name="option_d" value={formData.option_d} onChange={handleChange} />
            </div>
          </>
        )}

        <div className="form-field">
          <label>Correct Answer</label>
          <input
            name="correct_answer"
            value={formData.correct_answer}
            onChange={handleChange}
            placeholder={
              formData.question_type === "MSQ"
                ? "Example: A,C"
                : "Example: A or 42"
            }
            required
          />
        </div>

        <button className="btn-primary" disabled={loading}>
          {loading ? "Adding…" : "Add Question"}
        </button>
      </form>
    </div>
  );
}
