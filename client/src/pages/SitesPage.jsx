import { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import { Page, PageHeader, Btn, Field, Spinner, Empty, ErrorAlert, StatCard } from "../components/common/UI";
import { getSites, createSite, updateSite, deleteSite } from "../utils/api";

const SitesPage = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [form, setForm] = useState({ name: "", location: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const res = await getSites();
      setSites(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingSite(null);
    setForm({ name: "", location: "", description: "" });
    setError("");
    setShowForm(true);
  };

  const openEdit = (site) => {
    setEditingSite(site);
    setForm({ name: site.name, location: site.location || "", description: site.description || "" });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (editingSite) {
        const res = await updateSite(editingSite.id, form);
        setSites((prev) => prev.map((s) => s.id === editingSite.id ? { ...s, ...res.data } : s));
      } else {
        const res = await createSite(form);
        setSites((prev) => [{ ...res.data, equipment_count: 0 }, ...prev]);
      }
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save site");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this site? Equipment assigned to it will be unassigned.")) return;
    try {
      await deleteSite(id);
      setSites((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (site) => {
    try {
      const res = await updateSite(site.id, { ...site, active: !site.active });
      setSites((prev) => prev.map((s) => s.id === site.id ? { ...s, active: res.data.active } : s));
    } catch (err) {
      console.error(err);
    }
  };

  const activeSites = sites.filter((s) => s.active);
  const inactiveSites = sites.filter((s) => !s.active);
  const totalEquipment = sites.reduce((sum, s) => sum + parseInt(s.equipment_count || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <Page>
        <PageHeader
          title="Job Sites"
          subtitle="Manage field locations"
          action={<Btn onClick={openAdd}>+ Add Site</Btn>}
        />

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
          <StatCard label="Total Sites" value={sites.length} />
          <StatCard label="Active" value={activeSites.length} color="var(--green)" />
          <StatCard label="Equipment Deployed" value={totalEquipment} color="var(--accent)" />
        </div>

        {/* Add/Edit form */}
        {showForm && (
          <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--accent)",
            borderRadius: 8,
            overflow: "hidden",
            marginBottom: 24,
          }}>
            <div style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--text-primary)",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}>
                {editingSite ? "Edit Site" : "New Site"}
              </span>
              <button
                onClick={() => setShowForm(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer" }}
              >×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: 20 }}>
              <ErrorAlert message={error} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <Field label="Site name *">
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    placeholder="e.g. Riverside Complex"
                  />
                </Field>
                <Field label="Location">
                  <input
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. 123 Main St, City"
                  />
                </Field>
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Description">
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      rows={2}
                      placeholder="Optional notes about this site"
                      style={{ resize: "vertical" }}
                    />
                  </Field>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : editingSite ? "Save Changes" : "Create Site"}
                </Btn>
                <Btn ghost onClick={() => setShowForm(false)}>Cancel</Btn>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : sites.length === 0 ? (
          <Empty message="No job sites yet. Add your first site above." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sites.map((site) => (
              <div
                key={site.id}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  overflow: "hidden",
                  display: "flex",
                  opacity: site.active ? 1 : 0.6,
                }}
              >
                {/* Status bar */}
                <div style={{
                  width: 4,
                  background: site.active ? "var(--green)" : "var(--text-muted)",
                  flexShrink: 0,
                }} />

                <div style={{ padding: "16px 20px", flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}>
                        {site.name}
                      </span>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 4,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        background: site.active ? "var(--green-dim)" : "var(--bg-elevated)",
                        color: site.active ? "var(--green)" : "var(--text-muted)",
                      }}>
                        {site.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      {site.location && (
                        <span style={{ fontSize: 12, color: "var(--blue)" }}>📍 {site.location}</span>
                      )}
                      {site.description && (
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{site.description}</span>
                      )}
                    </div>
                  </div>

                  {/* Equipment count badge */}
                  <div style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    padding: "8px 14px",
                    textAlign: "center",
                    flexShrink: 0,
                  }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}>
                      {site.equipment_count}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>
                      Equipment
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <Btn sm ghost onClick={() => handleToggleActive(site)}>
                      {site.active ? "Deactivate" : "Activate"}
                    </Btn>
                    <Btn sm ghost onClick={() => openEdit(site)}>Edit</Btn>
                    <Btn sm danger onClick={() => handleDelete(site.id)}>Delete</Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Page>
    </div>
  );
};

export default SitesPage;
