import { useState } from "react";
import { createTest } from "../api/tests.api";
import { useNavigate } from "react-router-dom";

export default function CreateTest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration_minutes: 60,
    total_marks: 100,
  });

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createTest(form);
      navigate("/tests/my");
    } catch {
      setError("Failed to create test.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page page-center">
      <section className="section">
        <div className="container">
          <div className="card">
            <h2>Create Test</h2>
            {error && <p className="text-error">{error}</p>}

            <form className="form-stack" onSubmit={onSubmit}>
              <div className="form-field">
                <label>Title</label>
                <input name="title" value={form.title} onChange={onChange} required />
              </div>

              <div className="form-field">
                <label>Description</label>
                <input name="description" value={form.description} onChange={onChange} />
              </div>

              <div className="form-field">
                <label>Duration (minutes)</label>
                <input type="number" name="duration_minutes" value={form.duration_minutes} onChange={onChange} />
              </div>

              <div className="form-field">
                <label>Total Marks</label>
                <input type="number" name="total_marks" value={form.total_marks} onChange={onChange} />
              </div>

              <button className="btn-primary" disabled={loading}>
                {loading ? "Creating…" : "Create"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
