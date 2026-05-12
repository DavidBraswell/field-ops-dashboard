import { useState, useEffect } from "react";
import { getStatusLogs, createStatusLog, updateStatusLog, deleteStatusLog, getJobSites } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import { Page, PageHeader, Btn, Field, Spinner, Empty } from "../components/common/UI";

const StatusPage = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [jobSites, setJobSites] = useState([]);
  const [content, setContent] = useState("");
  const [jobSiteId, setJobSiteId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getStatusLogs(), getJobSites()]).then(([logRes, siteRes]) => {
      setLogs(logRes.data);
      setJobSites(siteRes.data);
      setLoading(false);
      
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await createStatusLog({ content, job_site_id: jobSiteId || undefined });
      setLogs((prev) => [{ ...res.data, author_name: user.name }, ...prev]);
      setContent("");
      setJobSiteId("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
    
    window.location.reload(); 
  };

  const handleEdit = async (id) => {
    try {
      const res = await updateStatusLog(id, { content: editContent });
      setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, content: res.data.content } : l)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this log?")) return;
    try {
      await deleteStatusLog(id);
      setLogs((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <Page>
        <PageHeader title="Status Logs" subtitle="Field updates & site reports" />

        {/* Compose */}
        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 28,
        }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text-primary)",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}>
              Post Update
            </span>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: 20 }}>
            <div style={{ marginBottom: 14 }}>
              <Field label="Status update">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  required
                  placeholder="What's happening on site today?"
                  style={{ resize: "vertical" }}
                />
              </Field>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <Field label="Job site">
                  <select value={jobSiteId} onChange={(e) => setJobSiteId(e.target.value)}>
                    <option value="">No specific site</option>
                    {jobSites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </Field>
              </div>
              <Btn type="submit" disabled={submitting}>
                {submitting ? "Posting..." : "Post Update"}
              </Btn>
            </div>
          </form>
        </div>

        {/* Log feed */}
        {loading ? (
          <Spinner />
        ) : logs.length === 0 ? (
          <Empty message="No status logs yet." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {logs.map((log) => (
              <div
                key={log.id}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                {/* Accent bar */}
                <div style={{ width: 3, background: "var(--accent)", flexShrink: 0 }} />

                <div style={{ padding: "16px 18px", flex: 1 }}>
                  {/* Meta */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "var(--blue-dim)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--blue)",
                        flexShrink: 0,
                      }}>
                        {log.author_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??"}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{log.author_name}</span>
                      {log.job_site_name && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          background: "var(--blue-dim)",
                          color: "var(--blue)",
                          padding: "2px 8px",
                          borderRadius: 4,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}>
                          📍 {log.job_site_name}
                        </span>
                      )}
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>

                    {(log.user_id === user?.id || user?.role === "admin") && (
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <button
                          onClick={() => { setEditingId(log.id); setEditContent(log.content); }}
                          style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.5px" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
                          style={{ background: "none", border: "none", color: "var(--red)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "uppercase", letterSpacing: "0.5px" }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  {editingId === log.id ? (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        style={{ marginBottom: 10, resize: "vertical" }}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <Btn sm onClick={() => handleEdit(log.id)}>Save</Btn>
                        <Btn sm ghost onClick={() => setEditingId(null)}>Cancel</Btn>
                      </div>
                    </div>
                  ) : (
                    <p style={{
                      fontSize: 14,
                      color: "var(--text-secondary)",
                      margin: 0,
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                    }}>
                      {log.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Page>
    </div>
  );
};

export default StatusPage;
