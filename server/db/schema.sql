-- ============================================
-- PERN App Database Schema
-- Run this file to initialize your database:
--   psql -U your_user -d pern_app -f schema.sql
-- ============================================

-- Users
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Job sites
CREATE TABLE IF NOT EXISTS job_sites (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  location    VARCHAR(255),
  description TEXT,
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment
CREATE TABLE IF NOT EXISTS equipment (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  type          VARCHAR(100),
  serial_number VARCHAR(100) UNIQUE,
  status        VARCHAR(30) DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'maintenance', 'retired')),
  job_site_id   INTEGER REFERENCES job_sites(id) ON DELETE SET NULL,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Image categories
CREATE TABLE IF NOT EXISTS image_categories (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) UNIQUE NOT NULL,
  slug  VARCHAR(100) UNIQUE NOT NULL
);

-- Seed default categories
INSERT INTO image_categories (name, slug) VALUES
  ('Site Progress', 'site-progress'),
  ('Equipment', 'equipment'),
  ('Safety', 'safety'),
  ('Inspections', 'inspections'),
  ('General', 'general')
ON CONFLICT DO NOTHING;

-- Images
CREATE TABLE IF NOT EXISTS images (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  category_id   INTEGER REFERENCES image_categories(id) ON DELETE SET NULL,
  job_site_id   INTEGER REFERENCES job_sites(id) ON DELETE SET NULL,
  title         VARCHAR(200),
  description   TEXT,
  cloudinary_id VARCHAR(255) NOT NULL,
  url           VARCHAR(500) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Status updates
CREATE TABLE IF NOT EXISTS status_logs (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  job_site_id INTEGER REFERENCES job_sites(id) ON DELETE SET NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_images_category ON images(category_id);
CREATE INDEX IF NOT EXISTS idx_images_user ON images(user_id);
CREATE INDEX IF NOT EXISTS idx_images_site ON images(job_site_id);
CREATE INDEX IF NOT EXISTS idx_equipment_site ON equipment(job_site_id);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_status_logs_user ON status_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_status_logs_site ON status_logs(job_site_id);
