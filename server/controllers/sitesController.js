const pool = require("../config/db");

// GET /api/sites
const getAllSites = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT js.*,
        COUNT(e.id) AS equipment_count
      FROM job_sites js
      LEFT JOIN equipment e ON e.job_site_id = js.id
      GROUP BY js.id
      ORDER BY js.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/sites
const createSite = async (req, res) => {
  const { name, location, description } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
  try {
    const result = await pool.query(
      `INSERT INTO job_sites (name, location, description) VALUES ($1, $2, $3) RETURNING *`,
      [name.trim(), location || null, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/sites/:id
const updateSite = async (req, res) => {
  const { name, location, description, active } = req.body;
  try {
    const result = await pool.query(
      `UPDATE job_sites SET name=$1, location=$2, description=$3, active=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [name, location || null, description || null, active ?? true, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "Site not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/sites/:id
const deleteSite = async (req, res) => {
  try {
    await pool.query("UPDATE equipment SET job_site_id=NULL, status='available' WHERE job_site_id=$1", [req.params.id]);
    const result = await pool.query("DELETE FROM job_sites WHERE id=$1 RETURNING id", [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: "Site not found" });
    res.json({ message: "Site deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllSites, createSite, updateSite, deleteSite };
