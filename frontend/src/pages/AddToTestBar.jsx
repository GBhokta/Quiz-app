import { addQuestionsToTest } from "../api/tests.api";

export default function AddToTestBar({ testId, questionIds, onDone }) {
  async function handleAdd() {
    try {
      const payload = questionIds.map((qid) => ({
        question_id: qid,
        marks: 1,
      }));

      await addQuestionsToTest(testId, payload);
      onDone();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Failed to add questions to test");
    }
  }

  return (
    <section className="section section--tight bg-primary-soft">
      <div className="container flex-between">
        <p className="text-muted">
          {questionIds.length} question(s) selected
        </p>
        <button className="btn-primary" onClick={handleAdd}>
          Add to Test
        </button>
      </div>
    </section>
  );
}
