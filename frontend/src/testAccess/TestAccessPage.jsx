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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.test_code || !formData.passcode) {
      setError("Both test code and passcode are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await validateAccess(formData);

      if (!res?.data?.access_granted) {
        throw new Error("Access denied");
      }

      // Store session data
      sessionStorage.setItem("session_token", res.data.session_token);
      sessionStorage.setItem("test_id", res.data.test_id);

      // Redirect to session start
      navigate("/session/start");
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        "Invalid test code or passcode."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-center">
      <section className="section">
        <div className="container">
          <div className="card">
            <h2>Enter Test</h2>

            {error && (
              <p className="text-error">{error}</p>
            )}

            <form onSubmit={handleSubmit}>
              <div>
                <label>Test Code</label>
                <input
                  type="text"
                  name="test_code"
                  value={formData.test_code}
                  onChange={handleChange}
                  disabled={loading}
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
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? "Validating..." : "Start Test"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}