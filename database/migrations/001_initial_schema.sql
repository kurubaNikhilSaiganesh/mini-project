-- ================================================================
-- ALTS — DATABASE MIGRATION 001
-- Initial Schema: Core tables for places, faculty, rooms, classes
-- Run this in Supabase SQL Editor or psql
-- ================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Places / Campus Buildings ───────────────────────────────────
CREATE TABLE IF NOT EXISTS places (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            text UNIQUE NOT NULL,
  name            text NOT NULL,
  short_name      text,
  code            text,
  category        text NOT NULL, -- academic | lab | hostel | canteen | auditorium | admin | library | sports | gate
  type            text,          -- same as category for compat
  department      text,
  description     text,
  x               float8,        -- SVG map x position
  y               float8,
  w               float8,
  h               float8,
  latitude        float8,
  longitude       float8,
  google_maps_url text,
  distance        text,
  opening_time    text,
  closing_time    text,
  image_url       text,
  contact         text,
  accessible      boolean DEFAULT false,
  tags            text[],
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Place facilities (many-to-one)
CREATE TABLE IF NOT EXISTS place_facilities (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id    uuid REFERENCES places(id) ON DELETE CASCADE,
  facility    text NOT NULL
);

-- ── Faculty ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faculty (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            text NOT NULL,
  designation     text,
  department      text,
  email           text,
  phone           text,
  cabin           text,
  building_id     text,
  image_url       text,
  specializations text[],
  created_at      timestamptz DEFAULT now()
);

-- ── Rooms ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rooms (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  number      text NOT NULL,
  building    text,
  building_id text,
  floor       text,
  type        text, -- classroom | lab | seminar | conference | office
  capacity    int,
  available   boolean DEFAULT true,
  class_id    text,
  created_at  timestamptz DEFAULT now()
);

-- ── Row Level Security ───────────────────────────────────────────
ALTER TABLE places           ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty          ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms            ENABLE ROW LEVEL SECURITY;

-- Public read access (campus data is public)
CREATE POLICY "Public read places"           ON places           FOR SELECT USING (true);
CREATE POLICY "Public read place_facilities" ON place_facilities FOR SELECT USING (true);
CREATE POLICY "Public read faculty"          ON faculty          FOR SELECT USING (true);
CREATE POLICY "Public read rooms"            ON rooms            FOR SELECT USING (true);

-- Admin write access (service role only — never expose service key in frontend)
-- INSERT/UPDATE/DELETE require service role key (used only in secure server functions)
