import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validateAccess } from "../api/access.api";

export default function TestAccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    test_code: searchParams.get("code") || "",
    passcode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await validateAccess(formData);

      sessionStorage.setItem("session_token", res.data.session_token);
      sessionStorage.setItem("test_id", res.data.test_id);

      navigate("/session/start");
    } catch (err) {
      setError("Invalid test code or passcode.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page page-center">
      <section className="section">
        <div className="container">
          <div className="card">
            <h2>Enter Test</h2>

            {error && <p className="text-error">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div>
                <label>Test Code</label>
                <input
                  type="text"
                  name="test_code"
                  value={formData.test_code}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Passcode</label>
                <input
                  type="password"
                  name="passcode"
                  value={formData.passcode}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="btn-primary" disabled={loading}>
                {loading ? "Validating…" : "Start Test"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}