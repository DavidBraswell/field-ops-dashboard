const pool = require("../config/db");

// GET /api/status
const getStatusLogs = async (req, res) => {
  const { job_site_id } = req.query;
  let query = `
    SELECT sl.*, u.name AS author_name, js.name AS job_site_name
    FROM status_logs sl
    LEFT JOIN users u ON sl.user_id = u.id
    LEFT JOIN job_sites js ON sl.job_site_id = js.id
    WHERE 1=1
  `;
  const params = [];
  if (job_site_id) {
    params.push(job_site_id);
    query += ` AND sl.job_site_id = $${params.length}`;
  }
  query += " ORDER BY sl.created_at DESC";

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/status
const createStatusLog = async (req, res) => {
  const { content, job_site_id } = req.body;
  if (!content?.trim()) return res.status(400).json({ message: "Content is required" });

  try {
    const result = await pool.query(
      `INSERT INTO status_logs (user_id, job_site_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, job_site_id || null, content.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/status/:id
const updateStatusLog = async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ message: "Content is required" });

  try {
    const check = await pool.query("SELECT user_id FROM status_logs WHERE id=$1", [req.params.id]);
    if (!check.rows.length) return res.status(404).json({ message: "Log not found" });
    if (check.rows[0].user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const result = await pool.query(
      "UPDATE status_logs SET content=$1, updated_at=NOW() WHERE id=$2 RETURNING *",
      [content.trim(), req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/status/:id
const deleteStatusLog = async (req, res) => {
  try {
    const check = await pool.query("SELECT user_id FROM status_logs WHERE id=$1", [req.params.id]);
    if (!check.rows.length) return res.status(404).json({ message: "Log not found" });
    if (check.rows[0].user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await pool.query("DELETE FROM status_logs WHERE id=$1", [req.params.id]);
    res.json({ message: "Log deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getStatusLogs, createStatusLog, updateStatusLog, deleteStatusLog };
