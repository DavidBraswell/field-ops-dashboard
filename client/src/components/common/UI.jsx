// Btn - primary amber button
export const Btn = ({ children, onClick, disabled, type = "button", danger = false, ghost = false, sm = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    style={{
      background: danger ? "transparent" : ghost ? "transparent" : "var(--accent)",
      color: danger ? "var(--red)" : ghost ? "var(--text-secondary)" : "#0f1117",
      border: danger ? "1px solid var(--red-dim)" : ghost ? "1px solid var(--border)" : "none",
      fontFamily: "var(--font-body)",
      fontSize: sm ? 11 : 12,
      fontWeight: 700,
      padding: sm ? "5px 10px" : "8px 18px",
      borderRadius: 6,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      transition: "all 0.15s",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </button>
);

// Card wrapper
export const Card = ({ children, style = {} }) => (
  <div style={{
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    ...style,
  }}>
    {children}
  </div>
);

// Page layout wrapper
export const Page = ({ children }) => (
  <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
    {children}
  </div>
);

// Page header
export const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
    <div>
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: 32,
        fontWeight: 700,
        color: "var(--text-primary)",
        textTransform: "uppercase",
        letterSpacing: 1,
        margin: 0,
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, margin: "4px 0 0" }}>
          {subtitle}
        </p>
      )}
    </div>
    {action}
  </div>
);

// Status badge
export const StatusBadge = ({ status }) => {
  const map = {
    available: { bg: "var(--green-dim)", color: "var(--green)" },
    assigned:  { bg: "var(--blue-dim)",  color: "var(--blue)"  },
    maintenance:{ bg: "var(--accent-dim)", color: "var(--accent)" },
    retired:   { bg: "#1a1a2e",          color: "var(--text-muted)" },
  };
  const s = map[status] || map.available;
  return (
    <span style={{
      background: s.bg,
      color: s.color,
      fontSize: 10,
      fontWeight: 700,
      padding: "3px 8px",
      borderRadius: 4,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
};

// Field group
export const Field = ({ label, children }) => (
  <div>
    <label>{label}</label>
    {children}
  </div>
);

// Spinner
export const Spinner = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
    <div style={{
      width: 32,
      height: 32,
      border: "2px solid var(--border)",
      borderTop: "2px solid var(--accent)",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// Empty state
export const Empty = ({ message }) => (
  <div style={{ textAlign: "center", padding: "64px 0", color: "var(--text-muted)", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>
    {message}
  </div>
);

// Error alert
export const ErrorAlert = ({ message }) =>
  message ? (
    <div style={{
      background: "var(--red-dim)",
      border: "1px solid #5a1f1f",
      color: "var(--red)",
      fontSize: 13,
      borderRadius: 6,
      padding: "10px 14px",
      marginBottom: 20,
    }}>
      {message}
    </div>
  ) : null;

// Stat card
export const StatCard = ({ label, value, color }) => (
  <div style={{
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: 16,
  }}>
    <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{label}</div>
    <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, color: color || "var(--text-primary)" }}>{value}</div>
  </div>
);
