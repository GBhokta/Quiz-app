import { useState } from "react";
import { createQuestion } from "../api/questions.api";

export default function CreateQuestion({ onCreated }) {
  const [formData, setFormData] = useState({
    question_text: "",
    question_type: "MCQ",
    difficulty: "EASY",
    is_public: true,
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
    numerical_answer: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }

  function buildPayload() {
    const payload = {
      question_text: formData.question_text,
      question_type: formData.question_type,
      difficulty: formData.difficulty,
      is_public: formData.is_public,
    };

    if (formData.question_type === "NAT") {
      payload.numerical_answer = Number(formData.numerical_answer);
      return payload;
    }

    const options = [
      { key: "A", text: formData.option_a },
      { key: "B", text: formData.option_b },
      { key: "C", text: formData.option_c },
      { key: "D", text: formData.option_d },
    ].filter(o => o.text.trim());

    const correctKeys =
      formData.question_type === "MSQ"
        ? formData.correct_answer.split(",").map(k => k.trim().toUpperCase())
        : [formData.correct_answer.trim().toUpperCase()];

    payload.options = options.map(opt => ({
      option_text: opt.text,
      is_correct: correctKeys.includes(opt.key),
    }));

    return payload;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = buildPayload();
      const res = await createQuestion(payload);

      onCreated(res.data); // 🔥 notify parent

      setFormData({
        question_text: "",
        question_type: "MCQ",
        difficulty: "EASY",
        is_public: true,
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "",
        numerical_answer: "",
      });
    } catch {
      setError("Failed to create question");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>Add Question</h3>
      {error && <p className="text-error">{error}</p>}

      <form className="form-stack" onSubmit={handleSubmit}>
        <textarea
          name="question_text"
          value={formData.question_text}
          onChange={handleChange}
          required
        />

        <select name="question_type" value={formData.question_type} onChange={handleChange}>
          <option value="MCQ">MCQ</option>
          <option value="MSQ">MSQ</option>
          <option value="NAT">NAT</option>
        </select>

        {formData.question_type !== "NAT" ? (
          <>
            <input name="option_a" placeholder="Option A" onChange={handleChange} />
            <input name="option_b" placeholder="Option B" onChange={handleChange} />
            <input name="option_c" placeholder="Option C" onChange={handleChange} />
            <input name="option_d" placeholder="Option D" onChange={handleChange} />
            <input
              name="correct_answer"
              placeholder={formData.question_type === "MSQ" ? "A,C" : "A"}
              onChange={handleChange}
              required
            />
          </>
        ) : (
          <input
            name="numerical_answer"
            placeholder="Correct numerical answer"
            onChange={handleChange}
            required
          />
        )}

        <button className="btn-primary" disabled={loading}>
          {loading ? "Adding…" : "Add Question"}
        </button>
      </form>
    </div>
  );
}
