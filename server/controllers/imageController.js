const pool = require("../config/db");
const { cloudinary } = require("../config/cloudinary");


// GET /api/images
const getImages = async (req, res) => {
  const { category, job_site_id } = req.query;
  let query = `
    SELECT i.*, ic.name AS category_name, ic.slug AS category_slug,
           js.name AS job_site_name, u.name AS uploaded_by
    FROM images i
    LEFT JOIN image_categories ic ON i.category_id = ic.id
    LEFT JOIN job_sites js ON i.job_site_id = js.id
    LEFT JOIN users u ON i.user_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (category) {
    params.push(category);
    query += ` AND ic.slug = $${params.length}`;
  }
  if (job_site_id) {
    params.push(job_site_id);
    query += ` AND i.job_site_id = $${params.length}`;
  }

  query += " ORDER BY i.created_at DESC";

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/images/categories
const getCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM image_categories ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/images/upload
const uploadImage = async (req, res) => {
 
  console.log("req.file:", req.file);
 
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const { category_id, job_site_id, title, description } = req.body;

  try {
      const result = await pool.query(
        `INSERT INTO images (user_id, category_id, job_site_id, title, description, cloudinary_id, url)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          req.user.id,
          category_id || null,
          job_site_id || null,
          title || null,
          description || null,
          req.file.public_id,    // changed from req.file.filename
          req.file.secure_url,   // changed from req.file.path
        ]
      );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/images/:id
const deleteImage = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM images WHERE id=$1", [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: "Image not found" });

    const image = result.rows[0];
    await cloudinary.uploader.destroy(image.cloudinary_id);
    await pool.query("DELETE FROM images WHERE id=$1", [req.params.id]);

    res.json({ message: "Image deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getImages, getCategories, uploadImage, deleteImage };
