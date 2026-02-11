import { getAllQuestions } from "../api/questions.api";
import { useEffect, useState } from "react";
export default function AllQuestionsPage() {
    const [questions, setQuestions] = useState([]);
      useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await getAllQuestions();

        // response.data is already JSON
        setQuestions(response.data);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      }
    }
    fetchQuestions();
  }, []);
  return (
    <div className="AllQuestion">
      {questions.map((q) => (
        <div key={q.id}>
          <h4>{q.question_text}</h4>
          <p>Type: {q.question_type}</p>
          <p>Difficulty: {q.difficulty}</p>
          <p>Public: {q.is_public ? "Yes" : "No"}</p>
        </div>
      ))}
    </div>
  );
}