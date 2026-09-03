# PROMPT: Build "CAMPUS_NAV" — Monochromatic Neo-Brutalist Campus Navigation & Event Showcase App

You are an expert frontend engineer. Build a **fully interactive, production-ready, single-page web application** called **CAMPUS_NAV** using **React (functional components + hooks)**, **Tailwind CSS**, **Lucide React icons**, and **hand-coded interactive SVG** for the map engine. No placeholder screenshots — everything must be real, working, and interactive. Output a complete, self-contained component architecture.

Do not explain your reasoning, do not summarize — output the working application code.

---

## 1. DESIGN SYSTEM — STRICT MONOCHROMATIC NEO-BRUTALISM

This is non-negotiable and applies to every pixel of the UI.

**Color palette (light mode):**
- Background: `#FFFFFF`
- Ink / borders / text: `#000000`
- Structural grays: `#F4F4F4` (panel fill), `#E5E5E5` (dividers/disabled)
- Accent-free — NO color of any kind, ever. Status/emphasis is conveyed only through inversion (black-on-white ↔ white-on-black), size, borders, and iconography.

**Color palette (dark mode):**
- Background: `#1A1A1A` / `#000000`
- Ink / borders / text: `#FFFFFF`
- Structural grays: `#2A2A2A` (panel fill), `#3A3A3A` (dividers)

**Theme toggle:**
- A high-contrast switch in the navbar (sun/moon or `[LIGHT]`/`[DARK]` toggle using Lucide `Sun`/`Moon`) that inverts the entire palette app-wide via a `theme` state + Tailwind `dark:` classes or a `data-theme` attribute. Toggle itself must have a mechanical "click" animation (see interactions below).

**Geometry & borders:**
- `border-radius: 0` everywhere. No exceptions, no rounded corners on buttons, cards, inputs, modals, tags.
- All containers, cards, buttons, inputs, and tags use **3px–4px solid borders** (`border-black` in light mode / `border-white` in dark mode).
- Visible structural grid lines between major sections (use border-t/border-b utilities liberally, e.g. `border-t-4`).

**Shadows & interaction physics:**
- Every actionable/raised element gets a hard offset shadow with **zero blur**: `box-shadow: 5px 5px 0px #000000` (or `#FFFFFF` in dark mode).
- On hover: shadow grows slightly and element lifts (`shadow: 7px 7px 0px`, `translate(-1px,-1px)`).
- On active/click (mechanical press): element translates into its shadow and shadow shrinks — `transform: translate(4px, 4px); box-shadow: 1px 1px 0px #000`. Apply this exact press physics to ALL buttons, toggle, nav items, and card CTAs.
- Implement this as a reusable Tailwind utility class or a `<BrutalButton>` / `<BrutalCard>` wrapper component so it's consistent everywhere.

**Typography:**
- Display/heading font: heavy industrial grotesk (use `font-family: 'Archivo Black', 'Space Grotesk', sans-serif` via Google Fonts import). Headers are **massive, uppercase, tight tracking, bold**.
- Body/UI font: a clean grotesk (Space Grotesk or system sans) at normal weight for readable copy.
- Monospace font (`'JetBrains Mono', 'Space Mono', monospace`) is used exclusively for: system status text, coordinates, route waypoints, dates/timestamps, tags/badges, and metadata labels — anything that reads as "machine output."
- Import fonts via `<link>` to Google Fonts in the document head.

**Layout artifacts (must be present):**
- A marquee/ticker banner (Section 3) with continuous horizontal auto-scroll, inverted colors (white-on-black or black-on-white), built with CSS `@keyframes` translateX loop — no external libraries.
- ASCII-style section dividers, e.g. a full-width row of `// ---------------------------------------- //` or `[ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ]` between major sections.
- "Pill" tags are actually **hard rectangles**, not pills — e.g. `[HACKATHON]`, `[SYS.NAV-01]`, `[CAMPUS_DIR]` — bordered, monospace, uppercase, small padding.
- Corner "bolt" or "crosshair" decorative marks (`+` glyphs) at the corners of major panels for an industrial-blueprint feel — optional but encouraged.

---

## 2. SECTION 1 — HEADER & CONTROL BAR

Sticky top navbar, 4px bottom border, containing:
- Left: Wordmark/logo block — `CAMPUS_NAV` in heavy display font next to a small bordered icon square (Lucide `MapPinned` or `Compass`).
- Center: System status strip in monospace: `[STATUS: ONLINE // 2D_SVG_ENGINE]` with a small pulsing square/dot indicator (CSS animation, no color — just opacity pulse).
- Command search input styled as a bordered brutalist box with a `[CMD+K]` badge on its right edge (Lucide `Search` icon on the left). Wire up an actual `⌘K` / `Ctrl+K` keyboard listener that focuses the input and opens a simple command palette overlay listing all buildings — typing filters the list, clicking/Enter navigates to that building on the map and opens its detail popup.
- Right: theme invert toggle (see above).
- On mobile: collapse into a hamburger-style bordered icon button that expands a full-width stacked menu.

---

## 3. SECTION 2 — INTERACTIVE 2D SVG CAMPUS NAVIGATION ENGINE

Two-column grid on desktop (`lg:grid-cols-[380px_1fr]`), stacked on mobile. Section header: `[01] NAV_ENGINE // FIND YOUR PATH`.

### 3A. Left Column — Route Controller (bordered panel, `bg-[#F4F4F4]` / dark equivalent)
- **Zone data model**: define ~10 named nodes with `id`, `label`, `type` (admin/academic/library/lab/hostel/canteen/auditorium/sports), `x`/`y` SVG coordinates, and a short `department`/`description` string. Include: Admin Block, Academic Block A, Academic Block B, Academic Block C, Central Library, Tech Labs, Hostel Block (Boys/Girls or North/South), Canteen, Auditorium, Sports Complex, plus 2–3 Entry Gates as pathway nodes (not selectable destinations, but used in routing).
- **"FROM" selector** and **"TO" selector**: custom-styled bordered `<select>` (or a bordered custom dropdown component) listing all destination zones with a small Lucide icon per category (`Building2`, `BookOpen`, `FlaskConical`, `Bed`, `Utensils`, `Theater`, `Dumbbell`, `ShieldCheck` for admin). Selecting a building here also highlights it on the map.
- **`[CALCULATE ROUTE ->]`** brutalist CTA button (full width, thick border, hard shadow, press animation). On click:
  - Compute a path between the two nodes by walking a predefined graph of pathway edges (implement a small adjacency list + BFS/Dijkstra over node coordinates — this does not need to be geographically perfect, just a believable connected graph of paths/gates between zones).
  - Store the resulting ordered list of waypoint nodes in state (`activeRoute`).
  - Compute total distance by summing Euclidean distances between waypoints (treat SVG units as meters via a scale factor) and derive an estimated walk time (assume ~80 m/min).
- **Route Info Card** (appears after calculation, bordered, monospace-heavy):
  - `DISTANCE: 340M // EST. TIME: 4 MIN` style header line.
  - Step-by-step waypoint list, each row like `[01] -> EXIT ADMIN BLOCK` / `[02] -> PATH VIA GATE_02` / `[03] -> ARRIVE: CENTRAL LIBRARY`, each with a small directional Lucide icon (`ArrowUpRight`, `CornerDownRight`, `Flag`).
  - An "Accessible Pathway" indicator row using Lucide `Accessibility` icon + monospace `[WHEELCHAIR ACCESSIBLE: YES/NO]` flag (attach a boolean per edge/route in the data model).
  - A `[CLEAR ROUTE]` ghost button to reset.
- If "From" and "To" are the same, show an inline bordered warning strip instead of a route.

### 3B. Right Column — Interactive 2D SVG Map Viewport
- A single responsive `<svg viewBox="0 0 800 600">` (or similar) rendered inside a thick-bordered panel with a subtle grid-line background pattern (SVG `<pattern>` of thin lines, mimicking blueprint paper — monochrome only).
- Render:
  - Building footprints as `<rect>`/`<polygon>` elements with 3px black/white stroke, fill = panel gray, and a centered `<text>` label in the display font (small size) plus a monospace coordinate tag near each (e.g. `[B-04]`).
  - Green spaces as simple rectangles/polygons with a dashed or crosshatch pattern fill instead of color (use SVG `<pattern>` with diagonal lines) to keep it strictly monochrome while still reading as "landscaping."
  - Pathways as gray/dashed `<line>`/`<path>` strokes connecting nodes.
  - Entry gates as small bordered diamond or triangle markers with a `Gate` monospace label.
- **Interactivity:**
  - Hovering a building: stroke-width increases, a subtle `filter` drop-shadow appears, cursor becomes pointer.
  - Clicking a building: sets `selectedBuilding` state → the building's footprint gets an inverted fill (black↔white) to show "highlighted" → an overlay/floating card appears (positioned near the click or docked to a corner) showing building name, category tag, a short department/facilities list, and two buttons: `[SET AS FROM]` and `[SET AS TO]` which populate the route selectors directly. Include a close (`X`) button.
  - When `activeRoute` is set, draw the path as a bold animated dashed line connecting the waypoints in sequence (`stroke-dasharray` + CSS `@keyframes` animating `stroke-dashoffset` to create a "marching ants" flow effect), plus small pulsing circle markers at the start (Lucide-style flag icon or SVG shape) and end nodes.
- **Map controls** (floating, bottom-right of the map panel, brutalist bordered square icon buttons stacked or in a row): zoom in (`ZoomIn`), zoom out (`ZoomOut`), reset/pan-to-center (`Maximize` or `RefreshCcw`). Implement actual zoom/pan via a `viewBox` state (adjust width/height/x/y on zoom, and support click-drag panning on the SVG when zoomed).
- **Zone filter toggle bar** above or beside the map: bordered toggle chips — `[ALL]` `[ACADEMICS]` `[LABS]` `[HOSTELS]` `[SERVICES]` — clicking one dims/fades (via opacity, not color) all buildings not matching that category, and un-dims the rest; `[ALL]` resets.
- Every SVG interactive element must have `role="button"`, `tabIndex={0}`, `aria-label` describing the building/action, and keyboard activation (Enter/Space triggers the same click handler) for accessibility.

---

## 4. SECTION 3 — CAMPUS EVENTS & ANNOUNCEMENT SHOWCASE

Placed directly beneath the map section, full width. Section header: massive brutalist billboard-style text reading `[02] BULLETIN // CAMPUS SHOWCASE & EVENTS`, with a thick top border acting as the section's structural divider.

### 4A. Marquee Ticker
- Full-width inverted strip (black bg/white text in light mode, and vice versa in dark mode) with a continuously auto-scrolling monospace line of pipe-separated urgent updates, e.g.:
  `[ALERT] TECHFEST REGISTRATIONS CLOSE 2026.10.10  //  [NOTICE] LIBRARY EXTENDED HOURS THIS WEEK  //  [DEADLINE] HACKATHON TEAM SUBMISSIONS DUE FRIDAY  //  [UPDATE] SPORTS COMPLEX RESURFACING COMPLETE`
- Implemented with a duplicated content track and a CSS `@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }` looped infinitely, `animation-play-state: paused` on hover.

### 4B. Bento-Style Event Cards
- A responsive bento grid (mix of large/small card spans, e.g. `grid-cols-4` with some cards `col-span-2 row-span-2`) of at least 6 sample events (Tech Fest, Hackathon, Guest Lecture, Cultural Fest, Club Workshop, Sports Meet).
- Each card (thick border, hard shadow, press-animation on the whole card or its CTA):
  - Bold uppercase event title in display font.
  - Category tag as a hard-edged bordered badge: `[HACKATHON]`, `[CULTURAL_FEST]`, `[WORKSHOP]`, `[LECTURE]`, `[SPORTS]`.
  - Monospace date/time stamp: `DATE: 2026.10.15 // 10:00 AM`.
  - Venue tag with a Lucide `MapPin` icon, e.g. `[VENUE: AUDITORIUM]` — clicking it scrolls back up to the map section and auto-triggers the building popup/highlight for that venue (wire this to the same `selectedBuilding` state from Section 2).
  - Two CTA buttons: `[REGISTER NOW ->]` (primary, filled/inverted) and `[LOCATE ON MAP]` (secondary, outline) — both with full press-mechanical hover/active states. Register can just open a bordered modal/confirmation stub (no real backend needed).
  - A short one-line description in body font.

---

## 5. STATE MANAGEMENT & ARCHITECTURE REQUIREMENTS

- Organize into clear components: `App`, `Navbar`, `CommandPalette`, `ThemeToggle`, `RouteController`, `CampusMap` (SVG engine), `BuildingPopup`, `RouteInfoCard`, `ZoneFilterBar`, `MapControls`, `EventsSection`, `MarqueeTicker`, `EventCard`.
- Centralize shared state (theme, selectedBuilding, fromNode, toNode, activeRoute, activeZoneFilter, svg viewBox/zoom) in `App` or a small context provider, passed down via props or `useContext` — no prop-drilling hacks, keep it clean.
- Building/event/pathway data should live in clearly separated constant arrays/objects at the top of the file (or a `data.js` module) so it's easy to extend.
- Fully responsive: mobile stacks the two-column nav section vertically (controller above map), bento grid collapses to single column, marquee and navbar remain usable at small widths.
- No external UI libraries besides Tailwind + lucide-react. No colored accents anywhere — audit the final output to confirm strict monochrome compliance.
- Code must run as-is with no missing imports, no TODOs, no lorem-ipsum placeholders — real sample data for all 10+ buildings and 6+ events.

Now generate the complete application code.
