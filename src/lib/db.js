// ================================================================
// ALTS — DATA ABSTRACTION LAYER
// All components should read data through this layer.
// Currently returns local/demo data.
// When Supabase is configured, switch to live queries here.
// ================================================================

import { isSupabaseConfigured, getSupabaseClient } from './supabase.js';
import { BUILDINGS, getBuildingById } from '../data/buildings.js';
import { EXAMS, getExamById } from '../data/exams.js';
import { findSeatingByRegNumber, ROOM_LAYOUTS } from '../data/seating.js';
import { EVENTS, FACULTY, ROOMS, CLASSES, TIMETABLE } from '../data.js';

// ── Places / Buildings ────────────────────────────────────────

export async function getPlaces() {
  if (isSupabaseConfigured) {
    const sb = getSupabaseClient();
    if (sb) {
      const { data, error } = await sb.from('places').select('*').order('name');
      if (!error && data) return data;
    }
  }
  return BUILDINGS.filter((b) => b.type !== 'gate');
}

export async function getPlaceById(id) {
  if (isSupabaseConfigured) {
    const sb = getSupabaseClient();
    if (sb) {
      const { data, error } = await sb.from('places').select('*').eq('id', id).single();
      if (!error && data) return data;
    }
  }
  return getBuildingById(id);
}

// ── Exams ─────────────────────────────────────────────────────

export async function getExams() {
  if (isSupabaseConfigured) {
    const sb = getSupabaseClient();
    if (sb) {
      const { data, error } = await sb.from('exams').select('*, exam_subjects(*), exam_sessions(*)').order('start_date');
      if (!error && data) return data;
    }
  }
  return EXAMS;
}

export async function getExamByIdAsync(id) {
  if (isSupabaseConfigured) {
    const sb = getSupabaseClient();
    if (sb) {
      const { data, error } = await sb.from('exams').select('*').eq('id', id).single();
      if (!error && data) return data;
    }
  }
  return getExamById(id);
}

// ── Seating ───────────────────────────────────────────────────

export async function getSeatingByRegNumber(regNo, examId = null) {
  if (isSupabaseConfigured) {
    const sb = getSupabaseClient();
    if (sb) {
      let query = sb
        .from('exam_seating')
        .select('*')
        .ilike('registration_number', regNo.trim());
      if (examId) query = query.eq('exam_id', examId);
      const { data, error } = await query;
      if (!error && data) return data;
    }
  }
  return findSeatingByRegNumber(regNo, examId);
}

export async function getRoomLayout(roomNumber) {
  return ROOM_LAYOUTS[roomNumber] || null;
}

// ── Events ────────────────────────────────────────────────────

export async function getEvents() {
  if (isSupabaseConfigured) {
    const sb = getSupabaseClient();
    if (sb) {
      const { data, error } = await sb.from('events').select('*').order('date', { ascending: true });
      if (!error && data) return data;
    }
  }
  return EVENTS;
}

// ── Faculty ───────────────────────────────────────────────────

export async function getFaculty() {
  return FACULTY;
}

// ── Rooms ─────────────────────────────────────────────────────

export async function getRooms() {
  return ROOMS;
}

// ── Classes ───────────────────────────────────────────────────

export async function getClasses() {
  return CLASSES;
}

// ── Timetable ─────────────────────────────────────────────────

export async function getTimetable() {
  return TIMETABLE;
}
