import { useState } from "react";
import { createEquipment } from "../../utils/api";
import { Btn, Field, ErrorAlert } from "../common/UI";

const AddEquipmentModal = ({ jobSites, onClose, onAdded }) => {
  const [form, setForm] = useState({
    name: "", type: "", serial_number: "", status: "available", job_site_id: "", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await createEquipment(form);
      onAdded(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add equipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, padding: 24,
    }}>
      <div style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        width: "100%",
        maxWidth: 520,
        overflow: "hidden",
      }}>
        {/* Modal header */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 700,
            color: "var(--text-primary)",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}>
            Add Equipment
          </span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Modal body */}
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          <ErrorAlert message={error} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Equipment name *">
                <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Excavator #3" />
              </Field>
            </div>
            <Field label="Type">
              <input name="type" value={form.type} onChange={handleChange} placeholder="e.g. Heavy machinery" />
            </Field>
            <Field label="Serial number">
              <input name="serial_number" value={form.serial_number} onChange={handleChange} placeholder="Optional" />
            </Field>
            <Field label="Status">
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </Field>
            <Field label="Assign to site">
              <select name="job_site_id" value={form.job_site_id} onChange={handleChange}>
                <option value="">Unassigned</option>
                {jobSites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Notes">
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Optional notes..." />
              </Field>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <Btn type="submit" disabled={loading}>{loading ? "Adding..." : "Add Equipment"}</Btn>
            <Btn ghost onClick={onClose}>Cancel</Btn>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEquipmentModal;
