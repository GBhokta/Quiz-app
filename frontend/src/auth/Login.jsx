import { useState } from "react";
import { loginUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { loadUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await loginUser(formData);

    // Store tokens
   // console.log("Login successful:", res.data);
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    // console.log(res.data.name);
    // Sync auth context
    await loadUser();
    // console.log("User loaded");
    // Redirect after auth is ready
    navigate("/dashboard");
    // navigate("/testpage");
    // console.log("Navigation done");

  } catch {
    setError("Invalid email or password.");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="page page-center">
      <section className="section">
        <div className="container">
          <div className="card">
            <h2>Login</h2>

            {error && <p className="text-error">{error}</p>}

            <form className="form-stack" onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="btn-primary" disabled={loading}>
                {loading ? "Logging in…" : "Login"}
              </button>
            </form>
          </div>
        </div>
      </section>
      
    </div>
  );
}
