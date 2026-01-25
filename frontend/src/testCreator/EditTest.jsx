import { useParams } from "react-router-dom";
import PasscodeManager from "./PasscodeManager";
import CreateQuestion from "./CreateQuestion";
import QuestionList from "./QuestionList";

export default function EditTest() {
  const { testId } = useParams();

  return (
    <div className="page">
      <section className="section">
        <div className="container">
          <div className="card">
            <h2>Edit Test</h2>
            <p className="text-muted">Test ID: {testId}</p>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <PasscodeManager testId={testId} />
        </div>
      </section>
      <section className="section section--tight">
        <div className="container grid grid-2">
            <CreateQuestion />
            <QuestionList />
        </div>
        </section>

    </div>
  );
}
