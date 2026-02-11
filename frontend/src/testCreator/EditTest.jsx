import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getTestById,
  updateTest,
  getTestQuestions,
} from "../api/tests.api";

import PasscodeManager from "./PasscodeManager";
import ShareTest from "./ShareTest";
import TestQuestionList from "../pages/TestQuestionList";
import QuestionTabs from "../pages/QuestionTabs";
import MyQuestionsList from "../pages/MyQuestionsList";
import PublicQuestionsList from "../pages/PublicQuestionsList";
import AddToTestBar from "../pages/AddToTestBar";
import TestReadinessSummary from "../pages/TestReadinessSummary";
import CreateQuestion from "./CreateQuestion";

export default function EditTest() {
  const { testId } = useParams();

  const [test, setTest] = useState(null);
  const [testQuestions, setTestQuestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");

  const [activeTab, setActiveTab] = useState("my");
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [testRes, questionsRes] = await Promise.all([
        getTestById(testId),
        getTestQuestions(testId),
      ]);

      const t = testRes.data;

      setTest(t);
      setTitle(t.title || "");
      setDescription(t.description || "");
      setDuration(t.duration_minutes || "");
      setInstructions(t.instructions || "");
      setTestQuestions(questionsRes.data || []);
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

  async function handleSaveMeta() {
    try {
      await updateTest(testId, {
        title,
        description,
        duration_minutes: duration,
        instructions,
      });
      await loadData();
      alert("Test details saved.");
    } catch (err) {
      console.error(err);
      alert("Failed to save test details.");
    }
  }

  /* ===============================
     Render Guards
  ================================ */

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
          <p className="text-muted">Test not found.</p>
        </div>
      </div>
    );
  }

  /* ===============================
     MAIN LAYOUT
  ================================ */

  return (
    <div className="page">

      <section className="section">
        <div className="container">
          <div className="card">
            <div className="flex-between">
              <h2>Edit Test</h2>
              <span className="text-muted">{test.status}</span>
            </div>

            <label>
              <p className="text-muted">Title</p>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label>
              <p className="text-muted">Description</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <label>
              <p className="text-muted">Duration (minutes)</p>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </label>

            <button className="btn-primary" onClick={handleSaveMeta}>
              Save Details
            </button>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="card">
            <h3>Instructions to Students</h3>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <PasscodeManager testId={testId} />
          <ShareTest test={test} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <TestQuestionList
            questions={testQuestions}
            onChange={loadData}
          />
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <QuestionTabs
            active={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === "my" && (
            <MyQuestionsList
              selected={selectedQuestions}
              onSelect={setSelectedQuestions}
            />
          )}

          {activeTab === "public" && (
            <PublicQuestionsList
              selected={selectedQuestions}
              onSelect={setSelectedQuestions}
            />
          )}

          {activeTab === "create" && (
            <CreateQuestion
              onCreated={(question) => {
                setSelectedQuestions([question.id]);
                setActiveTab("my");
              }}
            />
          )}
        </div>
      </section>

      {selectedQuestions.length > 0 && (
        <AddToTestBar
          testId={testId}
          questionIds={selectedQuestions}
          onDone={() => {
            setSelectedQuestions([]);
            loadData();
          }}
        />
      )}

      <section className="section">
        <div className="container">
          <TestReadinessSummary
            test={test}
            questions={testQuestions}
          />
        </div>
      </section>

    </div>
  );
}
