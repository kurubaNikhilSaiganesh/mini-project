// ================================================================
// ALTS — EXAM DATA
// Supports MID and SEM (semester) exam types.
// Admin adds real exam data via the Admin Panel → Exams tab,
// which writes to Supabase. This is demo/fallback data.
// ================================================================

export const EXAM_TYPES = {
  MID: 'MID',
  SEM: 'SEM',
};

export const SESSIONS = {
  FN: { label: 'Forenoon', startTime: '09:00', endTime: '12:00' },
  AN: { label: 'Afternoon', startTime: '14:00', endTime: '17:00' },
};

export const EXAMS = [
  {
    id: 'mid1_2026_s3',
    type: 'MID',
    name: 'Mid Examination - 1',
    semester: 3,
    startDate: '2026-10-01',
    endDate: '2026-10-07',
    branches: ['CSE', 'IT', 'MECH', 'CIVIL', 'MBA'],
    description: 'First mid-term examination for Semester 3 students across all branches.',
    status: 'UPCOMING', // UPCOMING | ONGOING | COMPLETED
    schedule: [
      { date: '2026-10-01', day: 'Thursday', branch: 'CSE', semester: 3, section: 'A', subjectCode: 'CS301', subjectName: 'Data Structures & Algorithms', session: 'FN', examHall: 'A-301' },
      { date: '2026-10-01', day: 'Thursday', branch: 'CSE', semester: 3, section: 'B', subjectCode: 'CS301', subjectName: 'Data Structures & Algorithms', session: 'AN', examHall: 'A-302' },
      { date: '2026-10-02', day: 'Friday',   branch: 'CSE', semester: 3, section: 'A', subjectCode: 'CS302', subjectName: 'Operating Systems',            session: 'FN', examHall: 'A-301' },
      { date: '2026-10-03', day: 'Saturday', branch: 'IT',  semester: 3, section: 'A', subjectCode: 'IT301', subjectName: 'Cloud Computing',               session: 'FN', examHall: 'TL-AI1' },
      { date: '2026-10-04', day: 'Sunday',   branch: 'MECH',semester: 3, section: 'A', subjectCode: 'ME301', subjectName: 'Thermodynamics',                session: 'FN', examHall: 'B-101' },
      { date: '2026-10-06', day: 'Tuesday',  branch: 'CIVIL',semester:3, section: 'A', subjectCode: 'CE301', subjectName: 'Structural Analysis',           session: 'FN', examHall: 'B-201' },
      { date: '2026-10-07', day: 'Wednesday',branch: 'MBA', semester: 1, section: 'A', subjectCode: 'MB101', subjectName: 'Strategic Management',          session: 'AN', examHall: 'C-101' },
    ],
  },
  {
    id: 'sem_2026_s3',
    type: 'SEM',
    name: 'Semester Examination',
    semester: 3,
    startDate: '2026-11-15',
    endDate: '2026-11-30',
    branches: ['CSE', 'IT', 'MECH', 'CIVIL', 'MBA'],
    description: 'End-of-semester examination for Semester 3 students. Covers all subjects of the semester.',
    status: 'UPCOMING',
    schedule: [
      { date: '2026-11-15', day: 'Sunday',   branch: 'CSE', semester: 3, section: 'A', subjectCode: 'CS301', subjectName: 'Data Structures & Algorithms', session: 'FN', examHall: 'A-301' },
      { date: '2026-11-16', day: 'Monday',   branch: 'CSE', semester: 3, section: 'A', subjectCode: 'CS302', subjectName: 'Operating Systems',            session: 'FN', examHall: 'A-301' },
      { date: '2026-11-17', day: 'Tuesday',  branch: 'CSE', semester: 3, section: 'A', subjectCode: 'CS303', subjectName: 'Computer Networks',            session: 'AN', examHall: 'A-302' },
      { date: '2026-11-18', day: 'Wednesday',branch: 'IT',  semester: 3, section: 'A', subjectCode: 'IT301', subjectName: 'Cloud Computing',              session: 'FN', examHall: 'TL-AI1' },
      { date: '2026-11-20', day: 'Friday',   branch: 'MECH',semester: 3, section: 'A', subjectCode: 'ME301', subjectName: 'Thermodynamics',               session: 'FN', examHall: 'B-101' },
      { date: '2026-11-22', day: 'Sunday',   branch: 'CIVIL',semester:3, section: 'A', subjectCode: 'CE301', subjectName: 'Structural Analysis',          session: 'FN', examHall: 'B-201' },
    ],
  },
];

export function getExamById(id) {
  return EXAMS.find((e) => e.id === id);
}

export function getExamsByType(type) {
  return EXAMS.filter((e) => e.type === type);
}

export function getUpcomingExams() {
  const today = new Date().toISOString().split('T')[0];
  return EXAMS.filter((e) => e.endDate >= today);
}

export function getNextExam() {
  const upcoming = getUpcomingExams();
  if (!upcoming.length) return null;
  return upcoming.sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
}

export function getDaysUntilExam(exam) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(exam.startDate);
  const diff = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
  return diff;
}
