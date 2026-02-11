import { useState } from "react";
import { createQuestion } from "../api/questions.api";

export default function QuestionEditor() {
  const [questionText, setQuestionText] = useState("");
  const [type, setType] = useState("MCQ");

  async function handleSave() {
    await createQuestion({
      question_text: questionText,
      question_type: type,
    });
    setQuestionText("");
    alert("Question saved to bank");
  }

  return (
    <div className="card">
      <h3>Create Question</h3>

      <textarea
        placeholder="Question text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="MCQ">MCQ</option>
        <option value="MSQ">MSQ</option>
        <option value="NAT">NAT</option>
      </select>

      <button className="btn-primary" onClick={handleSave}>
        Save Question
      </button>
    </div>
  );
}
