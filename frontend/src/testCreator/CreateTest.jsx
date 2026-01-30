import { useState } from "react";
import { createTest } from "../api/tests.api";
import { useNavigate } from "react-router-dom";

export default function CreateTest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration_minutes: 60,
    total_marks: null,
    start_time: null,
    end_time: null,
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
      await createTest(formData);
      navigate("/tests/my");
    } catch {
      setError("Failed to create test.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <section className="section">
        <div className="container">
          <div className="card">
            <h2>Create Test</h2>

            {error && <p className="text-error">{error}</p>}

            <form className="form-stack" onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleChange}
                  min="1"
                  required
        //                   fields = (
        //     "title",
        //     "description",
        //     "duration_minutes",
        //     "total_marks",
        //     "start_time",
        //     "end_time",
        // )
                />
              </div>
              <div className="form-field">
                <label>Total Marks</label>
                <input
                  type="number"
                  name="total_marks"
                  value={formData.total_marks || ""}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="from-field">
                <label>Start Time</label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>End Time</label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={formData.end_time || ""}
                  onChange={handleChange}
                />
              </div>

              <button className="btn-primary" disabled={loading}>
                {loading ? "Creating…" : "Create Test"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
