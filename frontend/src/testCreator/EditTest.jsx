import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getTestById,
  getTestQuestions,
  addQuestionToTest,
} from "../api/tests.api";

import { createQuestion } from "../api/questions.api";

import CreateQuestion from "./CreateQuestion";
import PasscodeManager from "./PasscodeManager";
import ShareTest from "./ShareTest";

export default function EditTest() {
  const { testId } = useParams();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =============================
     LOAD TEST + QUESTIONS
  ============================== */

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [testRes, questionsRes] = await Promise.all([
        getTestById(testId),
        getTestQuestions(testId),
      ]);

      setTest(testRes.data);
      setQuestions(questionsRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load test data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!testId) return;
    loadData();
  }, [testId]);

  /* =============================
     CREATE + AUTO-ADD QUESTION
  ============================== */

  async function handleCreateQuestion(questionPayload) {
    try {
      // 1️⃣ Create question in question bank
      const res = await createQuestion(questionPayload);
      const questionId = res.data.id;

      // 2️⃣ Attach question to test
      await addQuestionToTest(testId, {
        question_id: questionId,
        marks: 1, // default marks
      });

      // 3️⃣ Reload test questions
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to add question to test.");
    }
  }

  /* =============================
     RENDER GUARDS
  ============================== */

  if (loading) {
    return (
      <div className="page page-center">
        <div className="container">
          <p className="text-muted">Loading test…</p>
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

  if (!test) {
    return (
      <div className="page page-center">
        <div className="container">
          <p className="text-muted">Preparing test…</p>
        </div>
      </div>
    );
  }

  /* =============================
     MAIN UI
  ============================== */

  return (
    <div className="page">
      {/* Test header */}
      <section className="section">
        <div className="container">
          <div className="card">
            <h2>{test.title}</h2>
            <p className="text-muted">{test.description}</p>
          </div>
        </div>
      </section>

      {/* Passcode + Share */}
      <section className="section section--tight">
        <div className="container">
          <PasscodeManager testId={testId} />
          <ShareTest test={test} />
        </div>
      </section>

      {/* Create + Auto-add question */}
      <section className="section">
        <div className="container">
          <CreateQuestion onSubmit={handleCreateQuestion} />
        </div>
      </section>

      {/* Test question list */}
      <section className="section section--tight">
        <div className="container">
          <h3>Questions</h3>

          {questions.length === 0 ? (
            <div className="card">
              <p className="text-muted">No questions added yet.</p>
            </div>
          ) : (
            <div className="grid grid-auto">
              {questions.map((q, idx) => (
                <div key={q.id} className="card">
                  <strong>Q{idx + 1}.</strong>
                  <p>{q.question_text}</p>
                  <p className="text-muted">
                    Type: {q.question_type} · Marks: {q.marks}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
