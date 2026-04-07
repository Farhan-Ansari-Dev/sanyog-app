import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { setAdminToken } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/admin/auth/login", { email, password });
      setAdminToken(res.data.token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.error || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Sanyog</h1>
        <p className="login-subtitle">Admin Panel — Secure Login</p>

        {error && <p className="text-error" style={{ marginBottom: 16, textAlign: "center" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sanyogconformity.com"
              required
              autoFocus
            />
          </div>

          <div className="input-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 16, height: 16 }}></span>
                Logging in...
              </>
            ) : (
              "Login →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
