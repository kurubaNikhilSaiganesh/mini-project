# NaviGO — Engineering Brief (condensed)

You are improving an **existing** React + Vite campus navigation app called NaviGO.
This is a surgical improvement task, not a rewrite. Inspect the real repo before writing any code.

## 0. Non-negotiable constraints
- Repo is React 18 + React DOM 18 + Vite + React Router + Tailwind + Lucide React, JS/JSX — **unless the actual files prove otherwise**.
- Do NOT migrate to Next.js. Do NOT introduce TypeScript, shadcn, or Radix unless the repo already uses them.
- Do NOT replace Vite or React Router. Do NOT rewrite from scratch.
- If an old doc/spec conflicts with the real codebase, **the real codebase wins**.

## 1. Priority order when instructions conflict
1. Actual working codebase
2. Actual NaviGO logo/brand assets
3. This brief
4. Existing project docs
5. Older prompts/specs

## 2. Phase 0 — Audit (do this before any edits)
Classify everything in the repo as:
- **KEEP** — working functionality, components, nav, map logic, state, data, styling
- **IMPROVE** — weak UI, inconsistent components, poor responsiveness, a11y gaps, duplicated logic
- **REBUILD** — fundamentally broken/unsuitable code only
- **MISSING** — functionality the vision needs but doesn't exist yet

Never delete working code just because it's inconvenient. Extend existing data models/routing/components rather than creating parallel/competing ones.

## 3. Brand & visual identity
- Use the real NaviGO logo file found in the repo (don't recreate it as text/CSS). Preserve aspect ratio, no color-destroying filters. Prominent on navbar, landing hero, mobile header, loading state.
- Palette: black, off-white, white, deep green, NaviGO yellow as the foundation. Red/green/yellow/blue only for semantic meaning (urgent/success/timetable-emphasis/system-info) — never purely decorative.
- Aesthetic: campus wayfinding system + engineering blueprint + neo-brutalist editorial. Hard offset shadows (5px 5px 0 → 7px on hover → 1px + shift on active), sharp/lightly-rounded geometry, asymmetric editorial layouts, coordinate/ID labels.
- Explicitly avoid: generic SaaS dashboard look, glassmorphism, purple/cyan "AI" gradients, giant empty heroes, excessive rounded cards, decorative floating elements.
- Typography: use whatever display/UI/mono fonts are already configured (fallback: Archivo Black/Outfit for display, Space Grotesk/Outfit for UI, JetBrains Mono for room numbers, coordinates, timestamps, IDs, statuses). Tabular numerals for numeric data.

## 4. Information architecture
Adapt to whatever routing already exists; extend rather than replace. Target route set (only add what's missing):
`/`, `/campus`, `/classes`, `/classes/:id`, `/faculty`, `/rooms`, `/rooms/:id`, `/timetable`, `/events`, `/admin`, `/admin/events`, `/admin/timetable`, `/admin/rooms`, `/admin/classes`.

## 5. Landing page
Sections: Hero (logo + strong headline like "KNOW WHERE TO GO" + CTA "EXPLORE CAMPUS" + secondary CTAs "FIND A ROOM"/"VIEW TIMETABLE", real map/blueprint visual — no fake campus photos) → What NaviGO solves → Core systems grid (Navigation/Classes/Rooms/Faculty/Timetable/Events, each linking to its real page) → Quick navigation shortcuts → Live map preview if the map engine supports it → Final CTA.

## 6. Navigation/map engine — the core feature
- Must be a **real** interface, not decorative SVG: FROM/TO selection, building/floor/room, route, distance, ETA, accessibility, waypoints.
- First check for existing SVG map / building-coordinate / navigation-graph data in the repo and use it. If it doesn't exist, build a map-engine architecture (separate from map data) that can accept real campus data later — do not invent a fake real-looking campus layout.
- Data shape: buildings (id, name, type, description, coordinates, floors, rooms, metadata), paths (from, to, distance, accessible, type), gates (separate entities).
- Routing: real graph algorithm (BFS or Dijkstra) — never a straight line between two points. Route result includes start, destination, waypoints, distance, estimated time (label as "estimated" if not precise), accessibility status.
- Building click → highlight, info panel, name/type/metadata/floors, "SET AS FROM"/"SET AS TO", "VIEW ROOMS" / "NAVIGATE HERE" where data supports it. Full keyboard support (Enter/Space/Escape).
- Filters (All/Academics/Labs/Hostels/Services/Sports/Admin) via opacity/emphasis, not color chaos.

## 7. Rooms, classes, faculty, timetable, events
- Rooms: number, building, floor, type, current class, faculty, availability, coordinates — only show fields the data actually supports.
- Classes: department, year, section, current room, faculty, today's timetable, upcoming events, "FIND ROOM" link — same rule, no invented fields.
- Faculty: name, designation, department, subjects, assigned class, office, contact — only real fields, never invented.
- Timetable: Today/This Week/Class views, highlight current & next class, clickable room numbers that jump to the map, tabular numerals.
- Events: title, date, time, venue, description, organizer, category, status; "LOCATE ON MAP" must actually navigate/highlight the venue — no fake buttons.

## 8. Admin + change propagation (critical)
Admin dashboard must be operationally real for events/timetable/rooms/classes/faculty/announcements (room change, reschedule, faculty change, room swap, event update, cancellation, emergency announcement), with clear confirm UI (e.g. "B-204 → C-301, effective immediately, [CANCEL]/[CONFIRM]").
**Changes must flow through one shared source of truth** (data → state/API/storage → admin → public pages) so they actually propagate to class pages, room pages, timetable, events, navigation, announcements — not just update the admin view in isolation.

## 9. Data & state
- Separate data from UI (`data/buildings`, `rooms`, `classes`, `faculty`, `timetable`, `events`, `navigation` or equivalent) — use the existing data layer/backend if one exists; don't replace a real backend with fake local data.
- If no backend exists, build clean local/mock data clearly labeled as demo data.
- Centralize only genuinely shared state (selected building/room, from/to, active route, map zoom/position, filters, theme, timetable day, admin changes, modals, command palette) via context or similar — no unnecessary global state, no deep prop drilling.

## 10. Command search
`Ctrl+K`/`Cmd+K` search across buildings, rooms, classes, faculty, events; selecting a result navigates to the relevant screen/map location.

## 11. Header
Logo + links (Campus/Classes/Rooms/Faculty/Timetable/Events) + search + theme toggle (if present) + admin access (if appropriate). Mobile: a strong brutalist menu interaction, not a generic hamburger drawer.

## 12. Interaction & animation
Buttons feel physical (lift on hover, compress into shadow on active). Animations are fast, subtle, functional (route drawing, selection, page transition, palette open, modal entrance, marquee, status pulse) — never decorative parallax/spinning/bouncing. Respect `prefers-reduced-motion`.

## 13. Responsive & accessibility
Desktop: dense multi-column. Tablet: adapted grids. Mobile: genuinely redesigned (usable map, stacked route controller, horizontally-scrollable timetable, touch targets, usable admin).
Semantic HTML, keyboard nav, visible focus states, ARIA labels, accessible forms/dialogs, keyboard-operable SVG buildings (`role="button"`, `tabIndex={0}`, `aria-label`, Enter/Space handling), sufficient contrast — no clickable `<div>`s where a button/link belongs.

## 14. Component/design system
Reuse existing architecture; don't force an unrelated folder structure onto a working project. Build shared primitives (Button, Card, Badge, Input, Select, Modal, Alert, SectionHeader, DataTable, StatusIndicator, MapPanel, EmptyState, LoadingState) so the whole app feels like one system, not independently-styled pages.

## 15. Hard rules
- **Never fabricate real campus data** (faculty, room numbers, buildings, schedules, events, departments). If something's unavailable, show an explicit empty/error state or clearly-labeled DEMO DATA — never fake-successful data.
- Every data-driven view needs loading/empty/error/success states.
- No new dependencies unless the need genuinely can't be met with React/React Router/Tailwind/Lucide/native browser APIs. Reuse existing Tailwind tokens (colors/fonts/shadows/animations) instead of duplicating them.
- Keep/update page title, meta description, favicon, OG tags to reflect "NaviGO — Campus Navigation | Exploration | System" — don't leave default Vite/React branding.

## 16. Verification before calling it done
Run `npm install` (if needed), `npm run lint`, `npm run build`, and the dev server. Fix build errors, lint errors, missing imports, broken routes/images, console errors, a11y issues, and responsive bugs. Then do a manual visual QA pass on desktop/tablet/mobile across navbar, landing, map, room/class/faculty pages, timetable, events, admin, modals, forms, and empty/error states — specifically hunting for AI-slop layout tells (excessive rounded cards, inconsistent borders, too many colors, dead/fake buttons).

## 17. Definition of done
Existing functionality still works · branding consistent with the real logo · Vite+React architecture intact · map/routing/building-selection work · rooms↔classes↔timetable↔faculty↔events↔map are all actually connected · admin changes propagate to public pages · loading/empty/error/success states everywhere · mobile + keyboard nav work · no fabricated data, no lorem ipsum, no TODOs, no unused imports, no console errors · lint & build pass · the UI reads as NaviGO, not a generic AI-generated dashboard.

## 18. The product principle to build toward
A student opening NaviGO should immediately be able to answer: Where am I? Where do I need to go? How do I get there? What class do I have? Where is my room? Who is my faculty? What's happening on campus? Optimize for clarity, wayfinding, connection, speed, trust, and visual identity — not feature count.
