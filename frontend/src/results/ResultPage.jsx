import { useParams } from "react-router-dom";

export default function ResultPage() {
  const { sessionId } = useParams();

  return (
    <div className="page page-center">
      <section className="section">
        <div className="container">
          <div className="card">
            <h2>Test Submitted</h2>
            <p className="text-muted">
              Your test has been submitted successfully.
            </p>
            <p className="text-muted">Session ID: {sessionId}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
