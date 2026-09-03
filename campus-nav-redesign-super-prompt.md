# SUPER PROMPT — Campus Navigation Redesign & Feature Upgrade

**Role:** You are an expert frontend engineer, UI/UX designer, and product architect extending an **existing** Campus Navigation project. You are NOT starting a new project. Every output must read as a natural evolution of what's already there.

**Non-negotiable ground rule:** No change ships until it has been checked against the real codebase. If you cannot locate the project files or the reference image mentioned below, stop and ask for them — do not invent a codebase, a data model, or a screenshot to work from.

---

## PHASE 0 — Discovery (mandatory gate, do not skip)

Before writing or editing anything:

1. Inspect the full project structure (framework, router, state management, styling system, component library, data layer/API).
2. Catalog existing routes, components, and data models related to classes, faculty, rooms, timetables, and events.
3. Identify what already works and must be preserved.
4. Identify existing reusable components (cards, nav, buttons, layout primitives) before creating new ones.
5. Locate the reference image (if provided) and treat it as the *information-architecture* reference only — the current codebase remains the source of truth for stack and working functionality.
6. Produce a short internal map: "existing → keep," "existing → improve," "missing → build new." Use this map to drive every later phase.

**Hard constraints carried through every phase:**
- Preserve currently working functionality unless a requirement below explicitly replaces it.
- Reuse existing APIs, components, utilities, and data before creating new ones.
- Never invent faculty, room, timetable, or event data that isn't in the existing data/API — build the UI to *display* real data, using clearly-labeled empty/loading states where data doesn't exist yet.
- Never hardcode content into components if the project has (or can reasonably support) a data layer.
- Match the project's existing coding conventions and build/dev commands; the app must still run with the existing scripts when you're done.

---

## PHASE 1 — Information Architecture

Reorganize the app around this structure (adapt route names to the existing router):

```
/                    Landing/intro page
/campus              Campus navigation / map
/classes             Class list
/classes/:classId    Class overview (single page combining class + faculty + room + timetable + events)
/faculty             Faculty directory
/rooms               Room list
/rooms/:roomId       Room detail
/timetable           Timetable (Today / Week / Class views)
/events              Events list
/admin               Admin dashboard
/admin/events
/admin/timetable
/admin/rooms
/admin/classes
```

Guiding rule: one focused page per category, connected by consistent navigation and breadcrumbs — never one giant page holding everything.

---

## PHASE 2 — Landing Page & Hero

The landing page introduces the system; it is **not** a dump of all campus data.

Include, in order:
1. Hero
2. What is Campus Navigation? (problem it solves, why it exists)
3. How it helps students/faculty
4. Main categories (visual entry points)
5. Quick navigation
6. Call-to-action → "Explore Campus"

**Hero requirements:**
- Large headline communicating navigation/classes/rooms/faculty/timetables/events at a glance (e.g. "FIND YOUR CAMPUS." / "NAVIGATE YOUR CAMPUS." — adapt to existing brand voice).
- Short supporting description, primary CTA, optional secondary CTA.
- A map/grid/building-inspired visual with small info-label cards, styled per the design system in Phase 8.
- Must not read as a generic SaaS landing page — it should read as a designed campus information system.

---

## PHASE 3 — Class / Group Overview

For every class/group already in the system, build a single **Class Overview** view combining:
class/group name, year, department, section, faculty details, current room, today's timetable, upcoming events, and a "find this room" link into campus navigation. No jumping across unrelated screens to understand one class.

---

## PHASE 4 — Faculty, Rooms, Timetable, Events

**Faculty:** name, designation, department, subject, assigned class, contact/office info — only fields the existing data already supports. Distinct faculty cards.

**Rooms:** room number, building, floor, room type, assigned class, and a link into the existing map/navigation system if one exists (don't build a parallel, disconnected room-location system).

**Timetable:** day, time, subject, faculty, room, class; support Today / This week / Class-specific views; highlight current/next class; structure the data so an admin can edit it later (see Phase 5).

**Events:** title, date, time, location, description, organizer, category, status — visually scannable, backed by dynamic data.

Each category page needs: heading, short explanation, icon, search/filter where volume warrants it, information cards, breadcrumb/back navigation.

---

## PHASE 5 — Admin Dashboard

This is the highest-leverage addition. Build a real operational dashboard, not a bare CRUD table.

**Manage:** events, timetable entries, room assignments (including room shuffles/moves), and class/group info (assigned faculty, room, timetable) — including sudden/emergency changes (room swaps, rescheduling, faculty changes, cancellations, temporary shuffles, emergency announcements).

**Dashboard UX must include:**
- Overview + quick actions
- Recent changes feed
- Upcoming events / room changes / timetable changes surfaced prominently
- Search & filters
- Edit forms with validation
- Confirmation states before destructive actions, showing what will change (e.g. "ROOM CHANGE — B-204 → C-301 — 2nd Year CSE — Effective immediately")
- Success/error feedback

**Admin changes must propagate** to the corresponding user-facing pages (class overview, room detail, timetable, events) — wire this explicitly; don't leave admin edits orphaned from the public views.

**Recent Changes feed:** for each change, show what changed, affected class, previous value, new value, and timestamp.

---

## PHASE 6 — Neo-Brutalist Design System

Apply consistently, as reusable tokens/components (not per-component one-offs):

**Do:** heavy black/dark borders, hard offset shadows, bold/large typography, flat high-contrast colors, chunky buttons, large cards, grid-based and occasionally asymmetric layouts, strong visual hierarchy, monospace styling for room numbers/times/IDs.

**Don't:** gradients, glassmorphism, soft floating shadows, overly rounded SaaS-style cards, generic Bootstrap look, excessive blur or animation, generic AI-template feel.

**Color system:** off-white background, near-black text/borders, accent set of electric blue / bright yellow / vivid red-coral / lime-green — assigned by meaning, not decoration:
- Blue → navigation/campus
- Yellow → timetable
- Red → urgent changes
- Green → success/current status

Keep the palette accessible (contrast-checked) and don't use every accent everywhere.

**Icons:** one consistent, bold, high-contrast icon set (map, building, door, graduation cap, users, calendar, clock, bell, pencil, settings, search, location pin, alert-triangle, check, menu, plus, trash). Thick strokes, dark outlines, solid accent-color containers, hard shadows on key icons. No emoji as UI icons; no mixed icon styles.

**Interaction:** buttons/shadows compress on click, cards lift/shift on hover, clear nav active states, brief change animations — used sparingly so the UI feels physical/cut-out, not decorated.

Build shared design tokens/components once (colors, borders, shadows, typography, spacing, buttons, cards, inputs, badges, alerts, tables, nav, modals) and reuse everywhere — do not restyle components individually.

---

## PHASE 7 — Responsive, Accessible, Resilient

- **Desktop:** multi-column layouts, large hero, dashboard grids, side nav where appropriate.
- **Tablet:** adapted grid/spacing.
- **Mobile:** touch-friendly, stacked cards, scrollable timetable, accessible admin controls — genuine responsive layouts, not a shrunk desktop view.
- **Accessibility:** sufficient contrast, keyboard navigation, visible focus states, semantic HTML, labeled forms, icons paired with text (not replacing it), adequate touch targets.
- **States:** every dynamic section gets loading / empty / error / success states, styled consistently with the design system — no blank screens.

---

## EXECUTION ORDER

1. Discovery (Phase 0) — gate, cannot be skipped
2. Information architecture (Phase 1)
3. Landing page + hero (Phase 2)
4. Category pages (Phase 4, structural pass)
5. Class/faculty/room integration (Phases 3–4, content pass)
6. Timetable + events (Phase 4)
7. Admin dashboard (Phase 5)
8. Wire admin → user-facing propagation (Phase 5)
9. Full Neo-Brutalist design pass (Phase 6)
10. Icons + interaction polish (Phase 6)
11. Responsive + accessibility pass (Phase 7)
12. Cleanup: remove dead/duplicate code, fix console errors, confirm existing build/dev commands still work

---

## CODE QUALITY & GUARDRAILS

- No unnecessary component duplication; extract shared logic into reusable components.
- Keep business logic separate from presentation.
- No unused imports or leftover scaffolding from the redesign.
- No fake backend/data pretending to work — if something isn't wired to real data yet, show a clearly labeled empty/placeholder state, not fabricated content.
- Do not delete existing functionality to simplify implementation.
- Do not replace the project's stack or rewrite wholesale — this is a targeted upgrade.

**Definition of done:** every major page reachable via navigation, admin edits visibly update the corresponding user-facing views, the Neo-Brutalist system is applied consistently (not just on new pages), desktop and mobile both work, and the project runs via its existing dev/build commands with no console errors.
