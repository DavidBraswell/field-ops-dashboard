import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Btn, ErrorAlert } from "../components/common/UI";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/equipment");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 36,
            fontWeight: 700,
            color: "var(--accent)",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}>
            ⬡ FieldOps
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 2, marginTop: 6 }}>
            Field Operations Platform
          </div>
        </div>

        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          overflow: "hidden",
        }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)" }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--text-primary)",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}>
              Create Account
            </span>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <ErrorAlert message={error} />

            <div>
              <label>Full name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Smith" />
            </div>
            <div>
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
            </div>
            <div>
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} placeholder="Min. 8 characters" />
            </div>

            <div style={{ marginTop: 4 }}>
              <Btn type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Btn>
            </div>

            <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
