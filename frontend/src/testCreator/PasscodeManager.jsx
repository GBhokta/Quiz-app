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
      <h3>Passcode Manager</h3>

      {message && <p className="text-success">{message}</p>}
      {error && <p className="text-error">{error}</p>}

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

      <p className="text-muted">
        Changing passcode will invalidate all previous access.
      </p>
    </div>
  );
}
