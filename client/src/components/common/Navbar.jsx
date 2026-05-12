import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/sites", label: "Sites" },
  { to: "/equipment", label: "Equipment" },
  { to: "/images", label: "Images" },
  { to: "/status", label: "Status" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <nav style={{
      background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 24px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: 20,
          fontWeight: 700,
          color: "var(--accent)",
          letterSpacing: 1,
          textTransform: "uppercase",
        }}>
          ⬡ Field Ops
        </span>

        <div style={{ display: "flex", gap: 4 }}>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: 6,
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "all 0.15s",
                background: isActive ? "var(--bg-elevated)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "var(--blue-dim)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "var(--blue)",
          }}>
            {initials}
          </div>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{user?.name}</span>
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              fontSize: 11, fontWeight: 600,
              padding: "5px 12px", borderRadius: 6,
              cursor: "pointer", fontFamily: "var(--font-body)",
              textTransform: "uppercase", letterSpacing: "0.5px",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
