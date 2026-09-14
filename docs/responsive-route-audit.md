# PsycheAI Responsive Route Audit (FAZ 2.5)

> Status: Canonical Responsive Inventory  
> Discovery Source: Dynamic filesystem discovery (`src/app/**/page.tsx`, excluding API routes)  
> Total Routes Discovered: 10 (9 interactive pages, 1 root redirect)  
> Date: 2026-09-14  

---

## 1. Route Discovery Inventory

| # | Route | File Path | Route Type | Rendering Strategy | Epistemic Scope |
|---|---|---|---|---|---|
| 1 | `/` | `src/app/page.tsx` | REDIRECT | Server Redirect (`redirect('/overview')`) | Public Root |
| 2 | `/overview` | `src/app/overview/page.tsx` | PAGE | Server Component (SSR/Dynamic) | Core Profile Summary |
| 3 | `/assessment` | `src/app/assessment/page.tsx` | PAGE | Client Component (Interactive) | Live Assessment Form (v1.0.0, 17 items) |
| 4 | `/profile/personality` | `src/app/profile/personality/page.tsx` | PAGE | Server Component | HEXACO Factor & Facet Distribution |
| 5 | `/profile/heatmap` | `src/app/profile/heatmap/page.tsx` | PAGE | Client Component (Interactive) | 84-Facet Density Matrix |
| 6 | `/insights/context` | `src/app/insights/context/page.tsx` | PAGE | Server Component | Multi-Context Adaptation Analysis |
| 7 | `/insights/patterns` | `src/app/insights/patterns/page.tsx` | PAGE | Server Component | Higher-Order Tensions & Synergies |
| 8 | `/theory-council` | `src/app/theory-council/page.tsx` | PAGE | Server Component | 8 Classical Theoretical Reading Lenses |
| 9 | `/research/item-bank` | `src/app/research/item-bank/page.tsx` | RESEARCH_PAGE | Server Component + Client Interactive View | Master Item Bank & Evidence Matrix (Protected) |
| 10 | `/research/login` | `src/app/research/login/page.tsx` | RESEARCH_AUTH_PAGE | Client Component | Access Key Authentication Portal (Protected) |

---

## 2. Detailed Responsive Analysis by Route

### 1. `/` (Root Gateway)
- **Current Layout**: Server-side 307 redirect to `/overview`.
- **Mobile Issues**: None (instant 307 redirect).
- **Tablet Issues**: None.
- **Desktop Issues**: None.
- **Overflow Risk**: None.
- **Chart Problem**: None.
- **Table Problem**: None.
- **Navigation Problem**: None.
- **Touch Usability**: Immediate transition.
- **Typography**: Inherited.
- **Responsive Priority**: P3 (Redirect invariant).

---

### 2. `/overview` (Executive Dashboard)
- **Current Layout**: 12-column analytical grid with top welcome banner, 2 KPI summary cards, 7-column HEXACO radar card, 5-column synthesized insight cards, and bottom epistemic callout.
- **Mobile Issues**: 12-column grid collapses tightly; radar chart PolarAngleAxis labels get truncated; 3-column trait score cards at the bottom of radar get cramped on 320px; obsolete link pointing to `/council` instead of `/theory-council`.
- **Tablet Issues**: 7/5 column split creates awkward aspect ratio between radar and insight cards.
- **Desktop Issues**: Well-balanced high-density layout.
- **Overflow Risk**: High on mobile due to PolarAngleAxis SVG labels and multi-column trait strips.
- **Chart Problem**: Recharts `HexacoRadarChart` with fixed outer radius `75%` leaves inadequate margins for 26-character Turkish labels (e.g. "Dürüstlük-Alçakgönüllülük").
- **Table Problem**: None.
- **Navigation Problem**: Desktop sidebar pushes content off-screen on mobile when sidebar is not hidden.
- **Touch Usability**: Action button ("Değerlendirmeye Başla") needs solid $\ge 44\text{px}$ touch target.
- **Typography**: Header text scales comfortably; trait labels require font-size/word-wrap control.
- **Responsive Priority**: P0 (Primary landing surface).

---

### 3. `/assessment` (Single-Handed Assessment Runner)
- **Current Layout**: Multi-step cognitive task surface with top item type switcher, question progress bar with timer and save buttons, 5-point Likert response grid (`grid-cols-2 sm:grid-cols-5`), situational judgement scenario preview, and bottom navigation controls.
- **Mobile Issues**: 
  - 5-point Likert in `grid-cols-2` leaves option 5 orphaned on a 3rd row, confusing rapid single-handed answering.
  - Squeezed buttons make thumb tapping error-prone (touch targets $< 44\text{px}$ on small heights).
  - Header with title, item counter, timer, and "Kaydet ve Çık" button wraps poorly and collides on 320px screens.
  - Safe-area bottom inset and mobile browser toolbar (`100vh` vs `dvh`) cause bottom controls to be obscured.
- **Tablet Issues**: Adequate space, but option grid can feel horizontally stretched without clear boundary.
- **Desktop Issues**: Clean horizontal Likert presentation.
- **Overflow Risk**: High on 320px/360px if header controls and option text wrap unpredictably.
- **Chart Problem**: None.
- **Table Problem**: None.
- **Navigation Problem**: Need persistent accessible back/save controls that don't crowd out the question text.
- **Touch Usability**: Critical: must support thumb-reachable, vertical full-width stacked radio rows with full Turkish text and min 44px height.
- **Typography**: Question prompt text must remain $\ge 18\text{px}$ bold and legible without forcing horizontal panning.
- **Responsive Priority**: P0 (Most critical mobile UX).

---

### 4. `/profile/personality` (Core Trait & Facet Distribution)
- **Current Layout**: Two-column layout (5-col compact radar + 7-col facet distribution whiskers), followed by a 3-column card grid of individual facet details.
- **Mobile Issues**:
  - `FacetWhiskersChart` uses fixed widths (`w-48` for facet name + `w-24` for estimate), leaving only 32px for the whisker track on a 320px screen!
  - Pre-calibration state displayed pseudo-statistical whiskers (violating empirical epistemic boundaries).
  - 3-column facet cards squeeze into unreadable columns on small screens.
- **Tablet Issues**: Facet cards need 2-column layout; whisker chart needs flexible proportional track.
- **Desktop Issues**: High-density side-by-side analytical presentation.
- **Overflow Risk**: Critical on mobile due to fixed pixel widths in `FacetWhiskersChart`.
- **Chart Problem**: Whisker bar squished; fake 95% CI displayed for pre-calibrated data.
- **Table Problem**: None.
- **Navigation Problem**: Breadcrumb link needs comfortable tap target.
- **Touch Usability**: Facet cards need clear spacing to prevent accidental zoom/taps.
- **Typography**: Secondary metadata (observed items, precision) requires readable minimums ($\ge 11\text{px}$).
- **Responsive Priority**: P0.

---

### 5. `/profile/heatmap` (Psychological Profile Heatmap)
- **Current Layout**: 8-column matrix displaying 84 facets categorized by 7 domains with score-shaded buttons, plus a 4-column sticky inspector sidebar.
- **Mobile Issues**:
  - Tapping a facet button at the top requires scrolling all the way down past 84 facets to see the inspector details.
  - Facet buttons wrap freely, but on 320px long facet names can clip.
- **Tablet Issues**: Inspector sidebar stretches and creates large empty vertical space.
- **Desktop Issues**: Sticky sidebar works smoothly beside the multi-row grid.
- **Overflow Risk**: Moderate; button wraps prevent hard overflow, but dense text can clip without word breaks.
- **Chart Problem**: Heatmap grid needs controlled horizontal scroll or clean responsive stacking.
- **Table Problem**: None.
- **Navigation Problem**: Mobile user loses context when selecting a facet because inspector is off-screen.
- **Touch Usability**: Facet buttons must maintain minimum 38–44px height for finger tap accuracy.
- **Typography**: Numerical scores inside pills must use tabular numbers.
- **Responsive Priority**: P1.

---

### 6. `/insights/context` (Multi-Context Adaptation Shifts)
- **Current Layout**: List of construct cards, each featuring a 4-column bar comparison (General, Work, Relationship, Stress) and contextual narrative.
- **Mobile Issues**: `sm:grid-cols-4` compresses 4 comparison bars into tight slivers on small tablet/mobile; vertical stacking is much clearer on mobile.
- **Tablet Issues**: 4-column layout is acceptable on $\ge 768\text{px}$, but cramped around 600–750px.
- **Desktop Issues**: Excellent side-by-side contrast of contexts.
- **Overflow Risk**: Low-to-moderate.
- **Chart Problem**: Percentage progress bars must have flex-shrink protection.
- **Table Problem**: None.
- **Navigation Problem**: Standard breadcrumb.
- **Touch Usability**: Cards are read-mostly; interactive elements require clear visual feedback.
- **Typography**: Maintain non-judgmental terminology ("çelişki" strictly forbidden).
- **Responsive Priority**: P1.

---

### 7. `/insights/patterns` (Tensions & Synergies)
- **Current Layout**: 2-column grid of tension cards (amber accent) and synergy cards (teal accent), featuring a horizontal node-link connector graphic (`Düğüm A <---> Düğüm B`).
- **Mobile Issues**:
  - Horizontal node connector with fixed line (`w-16`) and padding crunches and wraps Node A/B labels awkwardly on 320px.
  - 2-column layout forces cards into narrow columns on mobile.
- **Tablet Issues**: 2-column layout functions well $\ge 768\text{px}$.
- **Desktop Issues**: Balanced layout.
- **Overflow Risk**: Moderate in the node-link connector.
- **Chart Problem**: Custom SVG/CSS node line must be flexible and responsive.
- **Table Problem**: None.
- **Navigation Problem**: Standard breadcrumb.
- **Touch Usability**: Good.
- **Typography**: Epistemic badges and strength percentages must remain visible without truncation.
- **Responsive Priority**: P1.

---

### 8. `/theory-council` (Analytical Reading Lenses)
- **Current Layout**: Top epistemic boundary banner, followed by a 2-column grid of 8 classical psychologist reading lens cards.
- **Mobile Issues**: 2-column grid must collapse to 1 column on mobile; historical limitation boxes can become vertically tall.
- **Tablet Issues**: 2 columns work well.
- **Desktop Issues**: High-density analytical reading room feel.
- **Overflow Risk**: Low.
- **Chart Problem**: None.
- **Table Problem**: None.
- **Navigation Problem**: Standard breadcrumb.
- **Touch Usability**: Good.
- **Typography**: Theorist titles, perspectives, and epistemic badges must not collide.
- **Responsive Priority**: P1.

---

### 9. `/research/item-bank` (Forensic Master Item Bank)
- **Current Layout**: Multi-tab interface (Item Browser, Coverage Matrix, Turkish Validation Matrix, Quality Linter) featuring heavy analytical data tables and an item inspection modal.
- **Mobile Issues**:
  - Desktop data tables with 7–10 columns cause extreme horizontal scrolling and broken card envelopes on mobile.
  - Tab buttons wrap awkwardly across multiple uneven rows.
  - Filter bar (6 inputs/selects) creates a massive block of controls on small screens.
  - Inspection modal (`w-full max-w-xl`) lacks mobile-friendly close ergonomics and focus trap.
- **Tablet Issues**: Tables require horizontal internal scroll with sticky header columns.
- **Desktop Issues**: Comprehensive expert data workstation.
- **Overflow Risk**: Very High if tables are rendered without container-level containment (`ResponsiveDataTable`).
- **Chart Problem**: None.
- **Table Problem**: Primary candidate for `ResponsiveDataTable` (mobile card view + tablet scroll + desktop table).
- **Navigation Problem**: Protected route; mobile navigation must not break default-deny research security.
- **Touch Usability**: Table action buttons (Eye / inspect) need touch target expansion.
- **Typography**: Monospace item codes and correlation figures must remain legible without clipping.
- **Responsive Priority**: P1 (Critical research workstation).

---

### 10. `/research/login` (Research Access Portal)
- **Current Layout**: Centered card with key icon, access key password input, and submit button.
- **Mobile Issues**: Input font $< 16\text{px}$ triggers automatic iOS Safari viewport zoom, breaking responsive alignment; card needs responsive padding on 320px.
- **Tablet Issues**: Clean centered card.
- **Desktop Issues**: Clean centered card.
- **Overflow Risk**: Very low.
- **Chart Problem**: None.
- **Table Problem**: None.
- **Navigation Problem**: "Genel Bakışa Dön" link.
- **Touch Usability**: Touch target on input and submit button must be $\ge 44\text{px}$.
- **Typography**: Input text must be $\ge 16\text{px}$ for iOS zoom prevention.
- **Responsive Priority**: P2 (Auth gateway).

---

## 3. Summary of Core Remediation Directives

1. **Global AppShell**: Replace hard-coded desktop sidebar on mobile (`< lg`) with an accessible off-canvas drawer triggered by a header hamburger menu (ESC, backdrop tap, route-change close, focus trap, aria-expanded).
2. **Body Invariant**: Eliminate horizontal scroll on body (`document.documentElement.scrollWidth <= document.documentElement.clientWidth`).
3. **Assessment Ergonomics**: Full-width stacked Likert radio rows on mobile with complete Turkish labels, $\ge 44\text{px}$ touch targets, and `dvh`/safe-area insets.
4. **Pre-Calibration Truth**: Remove fake 95% CI whiskers from `FacetWhiskersChart` when data is in pre-calibration state.
5. **Responsive Tables**: Implement `ResponsiveDataTable` in `/research/item-bank` with mobile card representation and controlled internal scroll on tablet.
6. **Container Standardization**: Introduce `PageContainer` with standard, wide, and full variants.
