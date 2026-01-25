import { useState } from "react";
import { createQuestion } from "../api/questions.api";
import { useParams } from "react-router-dom";

export default function CreateQuestion() {
  const { testId } = useParams();

  const [form, setForm] = useState({
    question_text: "",
    question_type: "MCQ",
    marks: 1,
  });

  const [options, setOptions] = useState([
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
  ]);

  function updateOption(index, key, value) {
    setOptions((prev) =>
      prev.map((o, i) =>
        i === index ? { ...o, [key]: value } : o
      )
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await createQuestion({
      ...form,
      options,
      test_id: testId,
    });

    setForm({ question_text: "", question_type: "MCQ", marks: 1 });
    setOptions([
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
    ]);
  }

  return (
    <div className="card">
      <h3>Add Question</h3>

      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Question</label>
          <input
            value={form.question_text}
            onChange={(e) =>
              setForm({ ...form, question_text: e.target.value })
            }
            required
          />
        </div>

        <div className="form-field">
          <label>Marks</label>
          <input
            type="number"
            value={form.marks}
            onChange={(e) =>
              setForm({ ...form, marks: e.target.value })
            }
          />
        </div>

        {options.map((opt, idx) => (
          <div key={idx} className="form-field">
            <input
              placeholder={`Option ${idx + 1}`}
              value={opt.option_text}
              onChange={(e) =>
                updateOption(idx, "option_text", e.target.value)
              }
            />
            <label>
              <input
                type="checkbox"
                checked={opt.is_correct}
                onChange={(e) =>
                  updateOption(idx, "is_correct", e.target.checked)
                }
              />
              Correct
            </label>
          </div>
        ))}

        <button className="btn-primary">Add Question</button>
      </form>
    </div>
  );
}
