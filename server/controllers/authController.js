const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, invite_code } = req.body;

  if (invite_code !== process.env.INVITE_CODE) {
    return res.status(403).json({ message: "Invalid invite code" });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role",
      [name, email, hashed]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.cookie("token", token, cookieOptions);
    res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.cookie("token", token, cookieOptions);

    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });
  res.json({ message: "Logged out" });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, logout, getMe };
