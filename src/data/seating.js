// ================================================================
// ALTS — EXAM SEATING DATA
// IMPORTANT: This file contains DEMO DATA ONLY.
// Do NOT commit real student registration numbers or seating data.
// Real data must be stored in Supabase PostgreSQL.
// Admin adds/imports real data via Admin Panel → Seating tab.
// ================================================================

export const SEATING = [
  {
    id: 'seat_demo_001',
    registrationNumber: '23CS1042',
    name: 'Demo Student A',           // optional — can be null
    examId: 'mid1_2026_s3',
    examName: 'Mid Examination - 1',
    subjectCode: 'CS301',
    subjectName: 'Data Structures & Algorithms',
    examDate: '2026-10-01',
    session: 'FN',                    // FN | AN
    buildingId: 'academic_a',
    buildingName: 'Academic Block A',
    roomNumber: 'A-301',
    floor: 'Second',
    row: 4,
    bench: 3,
    seat: 2,
  },
  {
    id: 'seat_demo_002',
    registrationNumber: '23CS1043',
    name: 'Demo Student B',
    examId: 'mid1_2026_s3',
    examName: 'Mid Examination - 1',
    subjectCode: 'CS301',
    subjectName: 'Data Structures & Algorithms',
    examDate: '2026-10-01',
    session: 'FN',
    buildingId: 'academic_a',
    buildingName: 'Academic Block A',
    roomNumber: 'A-301',
    floor: 'Second',
    row: 4,
    bench: 3,
    seat: 3,
  },
  {
    id: 'seat_demo_003',
    registrationNumber: '23IT2011',
    name: 'Demo Student C',
    examId: 'mid1_2026_s3',
    examName: 'Mid Examination - 1',
    subjectCode: 'IT301',
    subjectName: 'Cloud Computing',
    examDate: '2026-10-03',
    session: 'FN',
    buildingId: 'tech_labs',
    buildingName: 'Tech Labs',
    roomNumber: 'TL-AI1',
    floor: 'Ground',
    row: 2,
    bench: 1,
    seat: 1,
  },
];

// Room layout metadata (rows × benches × seats per bench)
// Used by the seating visualisation component
export const ROOM_LAYOUTS = {
  'A-301': { rows: 6, benches: 4, seatsPerBench: 2, capacity: 48, label: 'Computer Lab A-301' },
  'A-302': { rows: 7, benches: 5, seatsPerBench: 2, capacity: 70, label: 'Lecture Hall A-302' },
  'TL-AI1':{ rows: 4, benches: 3, seatsPerBench: 2, capacity: 24, label: 'AI/ML Lab TL-AI1' },
  'B-101': { rows: 5, benches: 4, seatsPerBench: 3, capacity: 60, label: 'Drawing Hall B-101' },
  'B-201': { rows: 6, benches: 4, seatsPerBench: 3, capacity: 72, label: 'Lecture Hall B-201' },
  'C-101': { rows: 3, benches: 5, seatsPerBench: 2, capacity: 30, label: 'Conference Room C-101' },
};

export function findSeatingByRegNumber(regNo, examId = null) {
  const q = regNo.trim().toUpperCase();
  return SEATING.filter(
    (s) =>
      s.registrationNumber.toUpperCase() === q &&
      (examId === null || s.examId === examId)
  );
}

export function findSeatingByExamAndRoom(examId, roomNumber) {
  return SEATING.filter((s) => s.examId === examId && s.roomNumber === roomNumber);
}
