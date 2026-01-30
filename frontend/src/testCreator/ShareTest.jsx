export default function ShareTest({ test }) {
  if (!test?.access_code) return null;

  const shareLink = `${window.location.origin}/access?code=${test.access_code}`;

  function copyToClipboard() {
    navigator.clipboard.writeText(shareLink);
  }

  return (
    <div className="card">
      <h3>Share Test</h3>

      <p className="text-muted">
        Share this link with students. Passcode will be required.
      </p>

      <div className="form-field">
        <label>Test Link</label>
        <input type="text" value={shareLink} readOnly />
      </div>

      <button className="btn-primary" onClick={copyToClipboard}>
        Copy Link
      </button>
    </div>
  );
}
