import { useState } from "react";
import { updatePasscode } from "../api/tests.api";

export default function PasscodeManager({ testId }) {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await updatePasscode(testId, { passcode });
      setMessage("Passcode updated successfully.");
      setPasscode("");
    } catch {
      setError("Failed to update passcode.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>Passcode Settings</h3>

      <p className="text-muted">
        Changing the passcode will immediately invalidate old access.
      </p>

      {error && <p className="text-error">{error}</p>}
      {message && <p className="text-success">{message}</p>}

      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>New Passcode</label>
          <input
            type="text"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            required
          />
        </div>

        <button className="btn-primary" disabled={loading}>
          {loading ? "Updating…" : "Update Passcode"}
        </button>
      </form>
    </div>
  );
}
