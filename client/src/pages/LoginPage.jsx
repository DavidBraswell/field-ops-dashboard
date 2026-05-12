import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Btn, ErrorAlert } from "../components/common/UI";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/equipment");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-base)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 36,
            fontWeight: 700,
            color: "var(--accent)",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}>
            ⬡ Field Ops
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 2, marginTop: 6 }}>
            Field Operations Platform
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          overflow: "hidden",
        }}>
          <div style={{
            padding: "16px 24px",
            borderBottom: "1px solid var(--border)",
          }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text-primary)",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}>
              Sign In
            </span>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <ErrorAlert message={error} />

            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>

            <div style={{ marginTop: 4 }}>
              <Btn type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Btn>
            </div>

            <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
              No account?{" "}
              <Link to="/register" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
