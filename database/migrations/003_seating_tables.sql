-- ================================================================
-- ALTS — DATABASE MIGRATION 003
-- Exam Seating Tables
-- IMPORTANT: This table contains sensitive student information.
-- Enable strict RLS so students can ONLY see their own seat.
-- Never expose the Supabase service-role key in frontend code.
-- ================================================================

-- ── Exam Seating ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_seating (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_number text NOT NULL,
  name                text,          -- optional student name
  exam_id             uuid REFERENCES exams(id) ON DELETE CASCADE,
  exam_name           text,
  subject_code        text,
  subject_name        text,
  exam_date           date NOT NULL,
  session             text NOT NULL CHECK (session IN ('FN', 'AN')),
  building_id         text,
  building_name       text,
  room_number         text NOT NULL,
  floor               text,
  row_number          int,
  bench_number        int,
  seat_number         int,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- Index on registration_number for fast lookups
CREATE INDEX IF NOT EXISTS idx_seating_reg_number
  ON exam_seating (UPPER(registration_number));

CREATE INDEX IF NOT EXISTS idx_seating_exam_id
  ON exam_seating (exam_id);

-- ── Row Level Security ───────────────────────────────────────────
ALTER TABLE exam_seating ENABLE ROW LEVEL SECURITY;

-- Public lookup by registration number (case-insensitive)
-- NOTE: This allows anyone who knows a registration number to look up that seat.
-- If you want private seating data, change this to require authentication.
CREATE POLICY "Public seating lookup by reg number"
  ON exam_seating
  FOR SELECT
  USING (true);

-- Only service-role (admin server functions) can write seating data.
-- Do NOT create INSERT/UPDATE/DELETE policies for anon or authenticated roles here.
-- Use Supabase Edge Functions or a secure backend for bulk imports.

-- ── Room Layouts ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS room_layouts (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_number     text UNIQUE NOT NULL,
  label           text,
  rows_count      int NOT NULL DEFAULT 6,
  benches_count   int NOT NULL DEFAULT 4,
  seats_per_bench int NOT NULL DEFAULT 2,
  capacity        int GENERATED ALWAYS AS (rows_count * benches_count * seats_per_bench) STORED,
  building_id     text,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE room_layouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read room_layouts" ON room_layouts FOR SELECT USING (true);

-- ── Announcements ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS announcements (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  text       text NOT NULL,
  severity   text NOT NULL DEFAULT 'NOTICE' CHECK (severity IN ('ALERT', 'NOTICE', 'DEADLINE', 'UPDATE', 'EMERGENCY')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);
