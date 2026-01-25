import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateTestAccess } from "../api/access.api";

export default function TestAccessPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [testCode, setTestCode] = useState("");
  const [passcode, setPasscode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTestCodeSubmit(e) {
    e.preventDefault();
    if (!testCode.trim()) return;
    setError("");
    setStep(2);
  }

  async function handlePasscodeSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await validateTestAccess({
        test_code: testCode,
        passcode: passcode,
      });

      const { access_granted, test_id, session_token } = response.data;

      if (!access_granted) {
        setError("Invalid test code or passcode");
        return;
      }

      // Store session token (scoped, not JWT)
      sessionStorage.setItem("session_token", session_token);
      sessionStorage.setItem("test_id", test_id);

      navigate(`/session/start`);
    } catch (err) {
      setError("Access denied. Please check the passcode.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page page-center">
      <section className="section">
        <div className="container">
          <div className="card">
            <h2>Access Test</h2>

            {error && <p className="text-error">{error}</p>}

            {step === 1 && (
              <form className="form-stack" onSubmit={handleTestCodeSubmit}>
                <div className="form-field">
                  <label>Test Code</label>
                  <input
                    type="text"
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value)}
                    required
                  />
                </div>

                <button className="btn-primary" type="submit">
                  Continue
                </button>
              </form>
            )}

            {step === 2 && (
              <form className="form-stack" onSubmit={handlePasscodeSubmit}>
                <div className="form-field">
                  <label>Passcode</label>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    required
                  />
                </div>

                <button className="btn-primary" type="submit" disabled={loading}>
                  {loading ? "Checking..." : "Start Test"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
