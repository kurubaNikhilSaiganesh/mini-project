-- ================================================================
-- ALTS — DATABASE MIGRATION 002
-- Exam Tables: MID and SEM exam schedules
-- ================================================================

-- ── Exams ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exams (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type        text NOT NULL CHECK (type IN ('MID', 'SEM')),
  name        text NOT NULL,
  semester    int,
  start_date  date NOT NULL,
  end_date    date NOT NULL,
  branches    text[],
  description text,
  status      text DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'ONGOING', 'COMPLETED')),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- ── Exam Subjects ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_subjects (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id      uuid REFERENCES exams(id) ON DELETE CASCADE,
  subject_code text NOT NULL,
  subject_name text NOT NULL,
  branch       text,
  section      text,
  semester     int,
  exam_date    date,
  session      text CHECK (session IN ('FN', 'AN')),
  exam_hall    text,
  created_at   timestamptz DEFAULT now()
);

-- ── Exam Sessions ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_sessions (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session    text NOT NULL CHECK (session IN ('FN', 'AN')),
  label      text,
  start_time time NOT NULL,
  end_time   time NOT NULL
);

INSERT INTO exam_sessions (session, label, start_time, end_time)
VALUES
  ('FN', 'Forenoon',  '09:00', '12:00'),
  ('AN', 'Afternoon', '14:00', '17:00')
ON CONFLICT DO NOTHING;

-- ── Row Level Security ───────────────────────────────────────────
ALTER TABLE exams          ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_subjects  ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sessions  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read exams"         ON exams         FOR SELECT USING (true);
CREATE POLICY "Public read exam_subjects" ON exam_subjects FOR SELECT USING (true);
CREATE POLICY "Public read exam_sessions" ON exam_sessions FOR SELECT USING (true);
