# ALTS — Campus Navigation & Student Platform

<div align="center">
  <h3>Navigate · Learn · Explore</h3>
  <p>A professional campus navigation and student information platform built with React, Vite, and Supabase.</p>
</div>

---

## Features

### Campus Navigation
- Interactive SVG campus map with BFS pathfinding
- Building-to-building route finder with distance and time estimates
- Zone filtering (Academic, Labs, Hostels, Services, Sports)
- Building detail popups

### Campus Directory
- Searchable campus places directory
- Category filters with detailed place information
- Google Maps integration (when configured)
- Facilities, opening hours, and distance information

### Examinations
- MID and SEM exam schedule viewer
- Countdown timer to next exam
- Per-branch, per-section schedule breakdown
- **Exam Seating Lookup** — enter registration number → get exact hall, room, row, bench, seat
- **QR Code Scanning** — scan printed QR → instant seating lookup

### Academic Tools
- Class timetable (today and full week view)
- Classes, Rooms, and Faculty directory
- Admin-controlled room changes reflected in real-time

### Campus Life
- Events showcase (bento grid layout)
- Campus Notices board
- Global search across all campus data

### Administration
- PIN-protected admin panel
- Add/manage events, announcements, exam schedules
- Seating data management (manual entry + CSV import)
- QR code generation for seating

### Design
- Premium glass UI with light/dark mode
- Persistent theme preference
- Mobile-responsive with floating bottom navigation
- ALTS cinematic hero (CSS animation + video infrastructure)

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 | UI framework |
| Build | Vite | Fast dev server and bundler |
| Styling | Tailwind CSS | Utility-first CSS |
| Icons | Lucide React | Icon library |
| Database | Supabase (PostgreSQL) | Backend data storage |
| QR Scan | jsQR | Camera-based QR scanning |
| QR Generate | qrcode | Admin QR code generation |
| CI/CD | GitHub Actions | Automated build and deploy |
| Hosting | GitHub Pages | Free static hosting |

---

## Local Development

### Prerequisites
- Node.js 18+ 
- npm 9+

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/mini-project.git
cd mini-project

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Start development server
npm run dev
```

The app runs at `http://localhost:5173` with local demo data — no Supabase required.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Optional | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Optional | Supabase anon (public) key |
| `VITE_ADMIN_PIN` | Optional | Admin panel access PIN (default: `alts2026`) |

Copy `.env.example` to `.env.local` and fill in your values. **Never commit `.env.local`.**

---

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration files in order:
   ```
   database/migrations/001_initial_schema.sql
   database/migrations/002_exam_tables.sql
   database/migrations/003_seating_tables.sql
   ```
3. Optionally run `database/seed.sql` for demo data
4. Copy your project URL and anon key to `.env.local`

> **Important:** Never use the `service_role` key in frontend code. It has full database access and must only be used in secure server-side functions.

---

## Database Migrations

Migration files are in `database/migrations/`. Run them in numerical order on a new Supabase project.

| File | Creates |
|---|---|
| `001_initial_schema.sql` | places, faculty, rooms tables |
| `002_exam_tables.sql` | exams, exam_subjects, exam_sessions |
| `003_seating_tables.sql` | exam_seating, room_layouts, announcements |

---

## CI/CD Pipeline

Every push and pull request triggers the CI pipeline:

```
git push
    ↓
GitHub Actions
    ↓
npm ci → Lint → Security Audit → Build
    ↓ (main branch only, after passing)
Deploy to GitHub Pages
    ↓
Live ALTS Application
```

See [docs/cicd.md](docs/cicd.md) for a detailed explanation.

### Setting Up GitHub Pages Deployment

1. **Repository → Settings → Pages → Source:** Set to **GitHub Actions**
2. **Repository → Settings → Secrets → Actions:** Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PIN`
3. Push to `main` — deployment runs automatically

---

## Project Structure

```
mini-project/
├── .github/workflows/
│   ├── ci.yml          ← CI: lint + audit + build
│   └── deploy.yml      ← Deploy to GitHub Pages
├── database/
│   ├── migrations/     ← SQL schema files
│   └── seed.sql        ← Demo data
├── docs/
│   ├── architecture.md ← System design
│   └── cicd.md         ← CI/CD explanation
├── public/
│   ├── 404.html        ← SPA routing fix for GitHub Pages
│   └── logo.png
├── src/
│   ├── components/     ← React components
│   │   └── ui/         ← Glass component system
│   ├── context/        ← React context (AppContext)
│   ├── data/           ← Local data modules
│   ├── hooks/          ← Custom React hooks
│   ├── lib/            ← Database, Supabase, QR utilities
│   ├── App.jsx
│   └── index.css       ← Design system tokens
├── .env.example        ← Environment variable template
├── .gitignore
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## DevSecOps

This project demonstrates a DevSecOps workflow:

| Practice | Implementation |
|---|---|
| Secret management | `.env.example` + GitHub Secrets |
| Dependency security | `npm audit` in CI pipeline |
| Access control | Supabase Row Level Security (RLS) |
| Minimal permissions | GitHub Actions: `contents: read` only |
| No sensitive data in repo | Demo data only; real data in Supabase |
| Admin protection | PIN via environment variable |

---

## Branching Strategy

```
main         ← production (auto-deployed)
feature/*    ← feature branches (CI runs on PR)
fix/*        ← bug fixes
```

---

## Architecture

See [docs/architecture.md](docs/architecture.md) for the full system architecture diagram.

---

## Future Improvements

- [ ] Student login with Supabase Auth
- [ ] Real-time announcements via Supabase Realtime
- [ ] Push notifications for exam reminders
- [ ] CSV bulk import for seating data
- [ ] Offline support with service workers
- [ ] Native mobile app (React Native)
- [ ] Integration with college ERP system

---

## Acknowledgements

Built as a demonstration of modern web development and DevSecOps practices for college project presentation.

**Tech Stack Credits:** React · Vite · Tailwind CSS · Supabase · GitHub Actions
