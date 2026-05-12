import { useState } from "react";
import { StatusBadge, Btn } from "../common/UI";

const EquipmentCard = ({ item, jobSites, onAssign, onDelete }) => {
  const [selectedSite, setSelectedSite] = useState(item.job_site_id || "");
  const [assigning, setAssigning] = useState(false);

  const handleAssign = async () => {
    setAssigning(true);
    await onAssign(item.id, selectedSite || null);
    setAssigning(false);
  };

  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Accent bar */}
      <div style={{ height: 3, background: item.status === "available" ? "var(--green)" : item.status === "assigned" ? "var(--blue)" : item.status === "maintenance" ? "var(--accent)" : "var(--text-muted)" }} />

      {/* Header */}
      <div style={{
        padding: "14px 16px",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 8,
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text-primary)",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {item.name}
          </div>
          {item.type && (
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 2 }}>
              {item.type}
            </div>
          )}
          {item.serial_number && (
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              S/N: {item.serial_number}
            </div>
          )}
        </div>
        <StatusBadge status={item.status} />
      </div>

      {/* Body */}
      <div style={{ padding: "12px 16px", flex: 1 }}>
        {item.job_site_name ? (
          <div style={{ fontSize: 12, color: "var(--blue)", display: "flex", alignItems: "center", gap: 6 }}>
            <span>📍</span> {item.job_site_name}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>— Unassigned</div>
        )}

        {item.notes && (
          <div style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            marginTop: 8,
            padding: "8px 10px",
            background: "var(--bg-elevated)",
            borderRadius: 4,
            borderLeft: "2px solid var(--border)",
          }}>
            {item.notes}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{
        padding: "12px 16px",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        gap: 6,
        alignItems: "center",
      }}>
        <select
          value={selectedSite}
          onChange={(e) => setSelectedSite(e.target.value)}
          style={{ flex: 1, padding: "5px 8px !important", fontSize: "11px !important" }}
        >
          <option value="">Unassign</option>
          {jobSites.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <Btn sm onClick={handleAssign} disabled={assigning}>
          {assigning ? "..." : "Assign"}
        </Btn>
        <Btn sm danger onClick={() => onDelete(item.id)}>Del</Btn>
      </div>
    </div>
  );
};

export default EquipmentCard;
