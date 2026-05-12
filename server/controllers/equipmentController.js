const pool = require("../config/db");

// GET /api/equipment
const getAllEquipment = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, js.name AS job_site_name
      FROM equipment e
      LEFT JOIN job_sites js ON e.job_site_id = js.id
      ORDER BY e.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/equipment/:id
const getEquipmentById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, js.name AS job_site_name
       FROM equipment e
       LEFT JOIN job_sites js ON e.job_site_id = js.id
       WHERE e.id = $1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "Equipment not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/equipment
const createEquipment = async (req, res) => {
  const { name, type, serial_number, status, job_site_id, notes } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  try {
    const result = await pool.query(
      `INSERT INTO equipment (name, type, serial_number, status, job_site_id, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, type, serial_number, status || "available", job_site_id || null, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ message: "Serial number already exists" });
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/equipment/:id
const updateEquipment = async (req, res) => {
  const { name, type, serial_number, status, job_site_id, notes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE equipment
       SET name=$1, type=$2, serial_number=$3, status=$4, job_site_id=$5, notes=$6, updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [name, type, serial_number, status, job_site_id || null, notes, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "Equipment not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/equipment/:id/assign
const assignEquipment = async (req, res) => {
  const { job_site_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE equipment
       SET job_site_id=$1, status=CASE WHEN $1::int IS NULL THEN 'available' ELSE 'assigned' END, updated_at=NOW()
       WHERE id=$2 RETURNING *`,
      [job_site_id || null, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "Equipment not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/equipment/:id
const deleteEquipment = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM equipment WHERE id=$1 RETURNING id", [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: "Equipment not found" });
    res.json({ message: "Equipment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/equipment/sites
const getJobSites = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM job_sites WHERE active=true ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  assignEquipment,
  deleteEquipment,
  getJobSites,
};
