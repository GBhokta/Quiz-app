import { useEffect, useState } from "react";
import { getQuestionsByTest } from "../api/questions.api";
import { useParams } from "react-router-dom";

export default function QuestionList() {
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getQuestionsByTest(testId).then((res) =>
      setQuestions(res.data || [])
    );
  }, [testId]);

  return (
    <div className="card">
      <h3>Questions</h3>

      {questions.length === 0 ? (
        <p className="text-muted">No questions added yet.</p>
      ) : (
        questions.map((q, i) => (
          <div key={q.id} className="border py-2">
            <p>
              {i + 1}. {q.question_text}
            </p>
            <p className="text-muted">
              Type: {q.question_type} | Marks: {q.marks}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
