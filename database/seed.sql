-- ================================================================
-- ALTS — SEED DATA (DEMO ONLY)
-- Contains NO real student data.
-- Clearly marked as demonstration data.
-- ================================================================

-- ── Demo Exams ───────────────────────────────────────────────────
INSERT INTO exams (id, type, name, semester, start_date, end_date, branches, description, status)
VALUES
  ('00000000-0001-0001-0001-000000000001', 'MID', 'Mid Examination - 1', 3, '2026-10-01', '2026-10-07',
   ARRAY['CSE','IT','MECH','CIVIL','MBA'],
   'First mid-term examination for Semester 3 students across all branches.', 'UPCOMING'),
  ('00000000-0001-0001-0001-000000000002', 'SEM', 'Semester Examination', 3, '2026-11-15', '2026-11-30',
   ARRAY['CSE','IT','MECH','CIVIL','MBA'],
   'End-of-semester examination covering all subjects.', 'UPCOMING')
ON CONFLICT DO NOTHING;

-- ── Demo Room Layouts ─────────────────────────────────────────────
INSERT INTO room_layouts (room_number, label, rows_count, benches_count, seats_per_bench, building_id)
VALUES
  ('A-301',  'Computer Lab A-301',       6, 4, 2, 'academic_a'),
  ('A-302',  'Lecture Hall A-302',        7, 5, 2, 'academic_a'),
  ('TL-AI1', 'AI/ML Lab TL-AI1',         4, 3, 2, 'tech_labs'),
  ('B-101',  'Drawing Hall B-101',        5, 4, 3, 'academic_b'),
  ('B-201',  'Lecture Hall B-201',        6, 4, 3, 'academic_b'),
  ('C-101',  'Conference Room C-101',     3, 5, 2, 'academic_c')
ON CONFLICT (room_number) DO NOTHING;

-- ── Demo Seating (NO REAL STUDENT DATA) ──────────────────────────
-- These registration numbers are fictitious and for demonstration only.
INSERT INTO exam_seating (
  registration_number, name, exam_id, exam_name, subject_code, subject_name,
  exam_date, session, building_id, building_name, room_number, floor,
  row_number, bench_number, seat_number
)
VALUES
  ('23CS1042', 'Demo Student A', '00000000-0001-0001-0001-000000000001',
   'Mid Examination - 1', 'CS301', 'Data Structures & Algorithms',
   '2026-10-01', 'FN', 'academic_a', 'Academic Block A', 'A-301', 'Second', 4, 3, 2),
  ('23CS1043', 'Demo Student B', '00000000-0001-0001-0001-000000000001',
   'Mid Examination - 1', 'CS301', 'Data Structures & Algorithms',
   '2026-10-01', 'FN', 'academic_a', 'Academic Block A', 'A-301', 'Second', 4, 3, 3),
  ('23IT2011', 'Demo Student C', '00000000-0001-0001-0001-000000000001',
   'Mid Examination - 1', 'IT301', 'Cloud Computing',
   '2026-10-03', 'FN', 'tech_labs', 'Tech Labs', 'TL-AI1', 'Ground', 2, 1, 1)
ON CONFLICT DO NOTHING;

-- ── Demo Announcements ────────────────────────────────────────────
INSERT INTO announcements (text, severity)
VALUES
  ('Mid Examination 1 date sheet released. Check the Exams section.', 'NOTICE'),
  ('Last date for internal marks correction: 30 September 2026.', 'DEADLINE')
ON CONFLICT DO NOTHING;
