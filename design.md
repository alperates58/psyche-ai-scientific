# PsycheAI — Premium Light SaaS Design System

> Status: Product design source-of-truth
> Scope: Public product UI, assessment flow, profile dashboard, Theory Council, longitudinal insights, research/admin surfaces
> Theme: Light-first, premium SaaS, scientific, calm, trustworthy, human

---

## 1. Design North Star

PsycheAI must look like a serious modern research product, not a quiz website, medical portal, therapy clone, horoscope product, or generic AI chat application.

The visual language should communicate four things within the first few seconds:

1. **Scientific credibility** — structured data, uncertainty, evidence labels, traceability.
2. **Human clarity** — psychology is personal; the interface must remain calm, understandable, and non-judgmental.
3. **Premium SaaS quality** — disciplined spacing, typography, hierarchy, motion, and data visualization.
4. **Progressive depth** — simple at first glance, deep when the user drills down.

### Product personality

- Calm, not clinical.
- Intelligent, not academic-looking for its own sake.
- Premium, not decorative.
- Human, not playful.
- Precise, not cold.
- Confident, not absolute.

### One-sentence visual brief

**“A premium research-grade personal analytics platform for the mind.”**

---

## 2. Non-Goals / Visual Anti-Patterns

Do **not** build PsycheAI like:

- a BuzzFeed-style personality quiz,
- a 16Personalities clone,
- a hospital/HIS interface,
- a therapy chatbot,
- a crypto dashboard,
- a neon AI product,
- a dark cyberpunk product,
- an admin template filled with equal-weight cards,
- a dashboard that displays every possible graph above the fold,
- an interface that labels users as “good/bad”, “normal/abnormal”, or “healthy/unhealthy”.

Avoid:

- excessive purple gradients,
- glassmorphism everywhere,
- 3D charts,
- rainbow chart palettes,
- giant metric numbers without uncertainty context,
- emoji as primary UI iconography,
- gamified “you are 97% genius” style feedback,
- red/green moral coding of personality traits,
- diagnostic-looking warning banners for ordinary trait variation.

---

## 3. Theme Direction

PsycheAI is **light-first**.

The application should feel bright, spacious, soft, and carefully engineered. White should not dominate every surface; use subtle cool-neutral layers to create depth.

### Base palette

```css
:root {
  --bg-app: #F6F8FB;
  --bg-subtle: #F1F4F8;
  --surface-1: #FFFFFF;
  --surface-2: #FAFBFC;
  --surface-elevated: #FFFFFF;

  --border-subtle: #E7EBF0;
  --border-default: #DCE2EA;
  --border-strong: #C8D0DB;

  --text-primary: #182230;
  --text-secondary: #475467;
  --text-tertiary: #667085;
  --text-disabled: #98A2B3;

  --brand-50: #F3F2FF;
  --brand-100: #E9E7FF;
  --brand-200: #D7D3FF;
  --brand-500: #6865D8;
  --brand-600: #5753C8;
  --brand-700: #4743AE;

  --teal-50: #EFFAF8;
  --teal-500: #39978E;
  --teal-600: #2E7F78;

  --success-50: #EEF9F4;
  --success-600: #218769;

  --warning-50: #FFF8EB;
  --warning-600: #B7791F;

  --danger-50: #FFF3F2;
  --danger-600: #C9524F;

  --info-50: #EFF6FF;
  --info-600: #3478C8;

  --shadow-xs: 0 1px 2px rgba(16, 24, 40, 0.04);
  --shadow-sm: 0 2px 8px rgba(16, 24, 40, 0.06);
  --shadow-md: 0 8px 24px rgba(16, 24, 40, 0.08);
  --shadow-lg: 0 20px 50px rgba(16, 24, 40, 0.10);
}
```

### Palette behavior

- Brand violet is the primary interactive color, not the entire product background.
- Teal may be used as a secondary scientific/data accent.
- Trait scores must not inherit “success/danger” semantics.
- Red is reserved for actual errors, destructive actions, or clearly defined response-integrity warnings.
- High/low trait values use neutral or domain-specific data colors, never moral colors.

### Gradients

Allowed only in restrained decorative areas:

- onboarding hero background,
- profile completion ring glow,
- premium report cover.

Never use gradients to encode scientific data values.

---

## 4. Typography

### Primary typeface

Use **Inter** as the default UI font, with a system fallback.

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Type scale

- Display: 40/48, 700
- H1: 32/40, 700
- H2: 26/34, 650–700
- H3: 20/28, 650
- H4: 17/24, 650
- Body L: 16/26, 400–500
- Body: 14/22, 400–500
- Small: 13/18, 500
- Caption: 12/16, 500
- Data label: 11/16, 600, slight tracking

### Typography rules

- Never use all caps for long labels.
- Use tabular numerals for scores and confidence intervals.
- Keep scientific notation legible but secondary.
- Turkish characters must render perfectly.
- Do not use italic text as the only signal for uncertainty or theory status.

---

## 5. Spacing, Radius, Elevation

Use an 8 px spacing system with 4 px exceptions.

Common spacing tokens:

- 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80

### Radius

- Input / button: 10 px
- Small card: 12 px
- Primary card: 16 px
- Large analytical panel: 18 px
- Modal / drawer: 20 px
- Pills / badges: 999 px

### Card principle

Cards should group meaningful concepts. Do not turn every line of information into a card.

Default card:

```css
background: var(--surface-1);
border: 1px solid var(--border-subtle);
border-radius: 16px;
box-shadow: var(--shadow-xs);
```

Hoverable analytical cards may rise to `--shadow-sm`, but permanent heavy shadows are forbidden.

---

## 6. Application Shell

### Desktop

- Left navigation: 248–264 px
- Top utility bar: 64 px
- Main content max width: 1440 px
- Content padding: 28–36 px desktop
- Analytical pages may use full available width inside the content shell.

### Navigation

Primary navigation:

1. Overview
2. Assessment
3. My Profile
4. Deep Insights
5. Theory Council
6. Timeline
7. Reports

Secondary:

- Methodology
- Privacy & Data
- Settings

Research/admin roles may receive a separate clearly isolated workspace. Do not expose research controls to ordinary users.

### Sidebar style

- Quiet white or near-white surface.
- Selected item uses `brand-50` background + `brand-700` icon/text.
- No thick left bars unless needed for accessibility.
- Icons: consistent 18–20 px outline set.

---

## 7. Information Architecture

### Public / onboarding

- Landing
- Scientific approach
- How assessment works
- Privacy
- Sign in / Create account

### Authenticated user

- `/overview`
- `/assessment`
- `/assessment/:moduleId`
- `/profile`
- `/profile/personality`
- `/profile/self-system`
- `/profile/emotion`
- `/profile/cognition`
- `/profile/self-regulation`
- `/profile/motivation-values`
- `/profile/interpersonal`
- `/profile/response-integrity`
- `/insights`
- `/theory-council`
- `/timeline`
- `/reports`
- `/methodology`
- `/settings`

---

## 8. Onboarding Experience

The onboarding must establish scientific expectations before asking the first item.

### Step 1 — What PsycheAI is

Short statement:

> A longitudinal psychological profile built from validated measurement principles, not a one-shot personality label.

### Step 2 — What it is not

Explicitly state:

- not a clinical diagnosis,
- not therapy,
- not a deterministic description of identity,
- not an AI-generated score.

### Step 3 — Assessment commitment

Show:

- modules,
- estimated time per module,
- save-and-return behavior,
- profile confidence growth over time.

Avoid showing one intimidating global number such as “312 questions remaining.” Prefer module-level effort and overall profile coverage.

---

## 9. Assessment UI

This is one of the most important product surfaces.

### Core principle

**One cognitive task at a time.**

The default screen should contain:

- module name,
- short purpose statement,
- local progress indicator,
- one question/scenario,
- response controls,
- optional “not applicable” only when scientifically permitted,
- save state indicator.

### Likert items

Desktop:

- horizontal 6-point response scale,
- every endpoint has visible labels,
- middle choices show short labels or numeric support only if required,
- large click targets,
- keyboard navigation.

Mobile:

- stacked or two-row segmented options,
- do not squeeze six tiny buttons into one line.

### Scenario items

Use a clear scenario card with:

- context label: General / Work / Relationship / Social,
- scenario body,
- response alternatives with full sentence text,
- no color that suggests the “correct” answer.

### Forced-choice

Present statements with equal visual weight.

Never show:

- “better answer” visual hierarchy,
- personality icons that reveal the construct,
- live score movement while the assessment is running.

### Assessment fatigue protection

After scientifically configurable thresholds:

- recommend a break,
- permit save-and-return,
- do not shame the user for stopping,
- surface response-quality concerns only neutrally.

Example:

> Your response pattern suggests attention may be dropping. Saving here will protect the quality of your profile.

---

## 10. Overview Dashboard

The overview should answer only five questions:

1. How complete is my profile?
2. Which areas are measured strongly?
3. What are my most notable patterns?
4. Where are meaningful tensions or context shifts?
5. What should I complete next to improve confidence?

### Above the fold

Use a 12-column grid.

Recommended composition:

- 8 columns: “Your psychological profile” summary
- 4 columns: Profile confidence / coverage ring
- 4 columns: Core personality mini visualization
- 4 columns: Most informative pattern
- 4 columns: Next assessment module

Do not place 14 charts on this screen.

### Progressive disclosure

The overview is a map. Detailed scientific charts live inside domain pages.

---

## 11. Profile Visualization System

The scientific report architecture includes multiple visualization types. They must share a consistent visual grammar.

### Global chart rules

Every scientific visualization should be able to show, where applicable:

- point estimate,
- uncertainty / confidence interval,
- percentile only when a valid norm exists,
- number of observations/items,
- measurement confidence,
- norm version,
- last measured date,
- epistemic status.

### 11.1 Executive Radar

Purpose: quick view of broad core personality dimensions.

Rules:

- Maximum 6–7 axes.
- Never use radar for 20+ facets.
- Tooltip shows score, CI, percentile source, confidence.
- Radar is navigation/summary, not the primary statistical display.

### 11.2 Facet Distribution

Preferred detailed personality view:

- horizontal dot plot or bar + confidence whiskers,
- grouped by construct,
- sorted by model order, not automatically “best to worst”.

### 11.3 Psychological Heatmap

Rows: constructs/facets.
Columns may include:

- standardized position,
- confidence,
- context variability,
- temporal stability,
- data recency.

Use accessible sequential scales. Never encode everything using hue alone.

### 11.4 Contradiction / Tension Matrix

Use the term **Tension Map** in user-facing UI unless “contradiction” is scientifically necessary.

Node-link visualization:

- nodes = measured constructs,
- edges = predefined/tested tension relationships,
- edge intensity = strength/evidence,
- user can click an edge for explanation.

Do not imply pathology.

### 11.5 Synergy Map

Shows constructs that appear mutually reinforcing.

Visually related to Tension Map but uses a separate neutral-positive accent, not simplistic green = good.

### 11.6 Self-Discrepancy

Actual / Ideal / Ought should be presented as:

- paired dot plots,
- gap markers,
- domain-by-domain comparison,
- uncertainty if applicable.

Avoid judgmental text like “you are far from your ideal self.”

### 11.7 Value Circumplex

Schwartz-style circular visualization:

- preserve theoretical circumplex adjacency,
- labels outside ring,
- detail on hover/click,
- emphasize relative pattern, not moral ranking.

### 11.8 Cognitive Style

Use bipolar rails only when the construct is truly bipolar.

Where two dimensions are independent, display them separately or in a 2D space rather than forcing a false continuum.

### 11.9 Emotion Regulation Map

2D scatter/quadrant can be used when theoretically justified.

Quadrant labels must be descriptive, not diagnostic.

### 11.10 Attachment Grid

Treat anxiety and avoidance as continuous dimensions.

If categorical labels are displayed, they are secondary explanatory regions, not definitive “attachment type” diagnoses.

### 11.11 Impulsivity Facets

A small radar may be used for overview; detailed view should use horizontal distributions with confidence intervals.

### 11.12 Profile Confidence Map

This is a first-class product feature.

For every domain show:

- coverage,
- precision,
- response quality,
- method diversity,
- temporal stability.

Do not collapse all five into one unexplained “AI confidence” number.

### 11.13 Longitudinal Timeline

Time-series chart:

- line = estimated construct position,
- band = uncertainty,
- markers = assessment events,
- optional context tags,
- clear separation of trait estimates from state check-ins.

### 11.14 Theory Council Matrix

Rows: observed themes / constructs.
Columns: theoretical lenses.

Each cell opens a lens card containing:

- interpretation,
- evidence inputs,
- epistemic status,
- limitations,
- related measured constructs.

No “Freud score”, “Jung score”, or percentage compatibility.

---

## 12. Epistemic Status System

Scientific status must be visually explicit throughout the product.

### Status badges

#### Validated measurement

- Label: `Measured`
- Tone: brand/teal neutral
- Meaning: directly computed from the validated measurement model.

#### Evidence-supported interpretation

- Label: `Evidence-supported`
- Tone: blue-neutral
- Meaning: interpretation supported by empirical relationships, not a direct measurement.

#### Theoretical interpretation

- Label: `Theoretical lens`
- Tone: amber-neutral
- Meaning: conceptual explanation based on a historical/theoretical framework.

#### Historical framework

- Label: `Historical perspective`
- Tone: gray-neutral
- Meaning: educational or historical interpretation; not presented as modern measurement evidence.

Badges must always have text. Color alone is insufficient.

---

## 13. Theory Council Experience

Theory Council should feel like an analytical reading room, not a row of “psychologist avatars.”

### Layout

Top section:

- selected profile theme,
- measured evidence summary,
- “How different schools interpret this pattern” explanation.

Then lens tabs/cards:

- Freud
- Jung
- Adler
- Rogers
- Maslow
- Skinner
- William James
- Gestalt

Each lens card contains:

1. Lens name
2. Historical context
3. Epistemic status
4. Input measurements used
5. Interpretation
6. Alternative explanation
7. Limitation statement

Do not stylize historical figures as cartoon mascots.

Portraits, if ever used, should be editorial and optional; the default UI should rely on typography and structure.

---

## 14. Deep Insights Page

This page surfaces higher-order relationships, not raw scores.

Sections:

- Strongest cross-domain patterns
- Tensions
- Context shifts
- Stable traits vs changing states
- Low-confidence hypotheses requiring more data
- Suggested micro-assessments

Each insight card must include:

- “Based on” construct chips,
- confidence/precision indicator,
- epistemic status,
- “Why am I seeing this?” expansion,
- “Improve measurement” action when evidence is weak.

AI-generated prose must never visually outrank measured data.

---

## 15. Confidence and Uncertainty UX

Uncertainty is not an error state. It is part of scientific honesty.

### Do

- show intervals,
- show “more data needed” neutrally,
- distinguish measurement confidence from model/theory confidence,
- explain why confidence changed.

### Do not

- imply that 100% confidence is attainable,
- use false precision,
- use arbitrary decimal places,
- make low confidence look dangerous.

Recommended display:

**Autonomy**
- Estimate: 68
- 95% interval: 61–74
- Measurement confidence: High
- Evidence: 11 calibrated responses across 2 sessions

Before norms exist, do not display percentile language.

---

## 16. Response Integrity UX

Response integrity belongs primarily in the backend/research layer.

The user should not be accused of lying or manipulating the test.

Use neutral labels:

- Response quality: Strong
- Response quality: Review suggested
- Attention may have decreased
- Pattern requires additional measurement

Never show:

- “You lied”
- “Fake response detected”
- “Manipulation score: 78%”

---

## 17. Empty, Loading, Partial, and Invalid States

### Empty profile

Show an inviting roadmap rather than blank charts.

### Partial profile

Render only supported results. Locked/unfinished domains show:

- current coverage,
- next recommended module,
- why more data is required.

### No norm available

Replace percentile with:

> Normative comparison is not available for this measurement version yet.

Do not simulate population comparisons.

### Low measurement quality

Hide or soften the estimate if required by psychometric rules and explain why.

### AI unavailable

Measured profile must remain fully usable. AI narrative is enhancement, never the core product dependency.

---

## 18. Buttons and Controls

### Primary button

- Brand 600 background
- White text
- 40–44 px height
- 10 px radius
- No glossy effect

### Secondary button

- White background
- Default border
- Primary text

### Tertiary

- Text/icon only

### Destructive

- Danger color only for actual destructive operations such as deleting data/account.

### Toggle controls

Do not use toggles for actions that apply immediately unless state is clearly reversible.

---

## 19. Form System

Inputs:

- 42–44 px height desktop
- 46–48 px touch target mobile
- persistent labels above field
- helper/error text below
- focus ring using translucent brand color

Avoid placeholder-only labels.

Sensitive demographic fields should explain why they are being collected and whether they affect norming/research.

---

## 20. Tables

Tables are appropriate for:

- methodology,
- construct inventories,
- research/admin views,
- detailed report exports.

User-facing profile pages should prefer visual summaries with expandable table detail.

Table standards:

- sticky header when long,
- sortable only where meaningful,
- numeric columns right-aligned,
- confidence values use consistent formats,
- row hover subtle,
- no zebra striping unless density requires it.

---

## 21. Motion and Interaction

Motion should communicate causality and hierarchy.

### Timing

- Hover/focus: 120–160 ms
- Card/open state: 180–220 ms
- Drawer/modal: 220–280 ms
- Chart transition: 250–400 ms

Use standard ease-out curves.

### Motion rules

- Respect `prefers-reduced-motion`.
- No bouncing score counters.
- No confetti after psychological assessments.
- Do not animate scores in a way that implies casino/reward mechanics.

---

## 22. Accessibility

Target WCAG 2.2 AA.

Requirements:

- 4.5:1 text contrast where applicable,
- visible keyboard focus,
- complete keyboard assessment navigation,
- chart summaries for screen readers,
- patterns/labels in addition to color,
- minimum 44 × 44 touch targets where practical,
- semantic heading order,
- ARIA labels for chart interaction,
- no important information available only on hover.

---

## 23. Responsive Rules

### Desktop ≥ 1280

Full analytical layout and side navigation.

### Tablet 768–1279

- collapsible sidebar,
- 2-column cards,
- charts keep readable aspect ratio,
- Theory Council becomes scrollable tabs.

### Mobile < 768

- bottom or drawer navigation,
- one-column analytical flow,
- simplify visualizations instead of shrinking desktop charts,
- tap-to-open details,
- assessment optimized for thumb interaction.

Complex matrices may open in a dedicated full-screen explorer on mobile.

---

## 24. Report / Export Visual Language

Exports should look like a premium scientific report, not a screenshot of the web dashboard.

Report structure:

1. Cover
2. Methodology/version
3. Executive profile
4. Domain findings
5. Confidence and uncertainty
6. Tensions/synergies
7. Contextual variation
8. Theory Council
9. Longitudinal section if available
10. Measurement limitations
11. Technical appendix

Include:

- assessment date,
- model version,
- norm version,
- scoring version,
- report generation version.

---

## 25. Privacy and Trust Design

Psychological data is highly sensitive. Trust must be visible in the product experience.

Users need clear controls for:

- what is stored,
- why it is stored,
- export,
- delete,
- research consent,
- AI processing consent where applicable,
- longitudinal tracking opt-in.

Privacy explanations should use plain language first, legal detail second.

Never use manipulative consent patterns.

---

## 26. Premium SaaS Polish Rules

The product feels premium when details are consistent, not when effects are abundant.

Required polish:

- consistent 1 px borders,
- exact spacing rhythm,
- controlled card density,
- meaningful whitespace,
- typography hierarchy,
- high-quality empty states,
- skeleton loaders matching final layout,
- clear hover/focus/pressed states,
- chart tooltips with fixed formatting,
- no layout shift during data loading,
- no inconsistent icon families,
- no duplicated page titles/breadcrumb noise.

---

## 27. Recommended Core Components

Create reusable primitives before page-by-page styling:

- `AppShell`
- `SidebarNav`
- `TopBar`
- `PageHeader`
- `SurfaceCard`
- `MetricCard`
- `ScientificBadge`
- `ConfidenceIndicator`
- `UncertaintyInterval`
- `ConstructChip`
- `DomainProgress`
- `AssessmentQuestion`
- `LikertScale`
- `ForcedChoice`
- `ScenarioChoice`
- `ChartCard`
- `ChartLegend`
- `MethodologyPopover`
- `InsightCard`
- `TheoryLensCard`
- `TensionNode`
- `TimelineEvent`
- `EmptyState`
- `DataQualityNotice`
- `ReportPreview`

Components must use design tokens. Do not hard-code random hex values inside individual pages.

---

## 28. Dashboard Page Blueprint

### `/overview`

- Page header + last updated
- Profile completion/coverage
- Core personality preview
- 1–2 high-information insights
- Profile confidence by domain
- Recommended next assessment

### `/profile`

- Domain navigation
- domain coverage strip
- compact executive summary
- domain cards
- evidence/measurement status

### `/profile/:domain`

- construct overview
- detailed facet distribution
- uncertainty and confidence
- context differences
- longitudinal data if available
- methodology drawer

### `/insights`

- tensions
- synergies
- context shifts
- cross-domain patterns
- follow-up measurement suggestions

### `/theory-council`

- measured evidence summary
- lens selector
- interpretations with epistemic badges
- limitations
- compare lenses matrix

### `/timeline`

- construct selector
- trait trend
- state check-ins
- context events
- confidence history

---

## 29. Scientific Copy Style

Use precise, non-diagnostic language.

### Prefer

- “Your responses currently suggest…”
- “This estimate is supported by…”
- “This pattern appears stronger in work contexts than relationship contexts.”
- “More data would improve precision in this domain.”
- “From a Rogerian theoretical lens…”

### Avoid

- “You definitely are…”
- “Your subconscious is…”
- “You suffer from…”
- “This proves…”
- “Your personality type is…”
- “AI discovered that…”

---

## 30. Implementation Rules for Antigravity / Coding Agents

1. Treat this file as the design source-of-truth.
2. Build design tokens first.
3. Build reusable components before route-specific markup.
4. Do not invent new colors, radii, shadows, or font sizes without updating this document.
5. Do not use a generic admin dashboard template as the final UI.
6. Do not expose unvalidated statistics merely because a chart component exists.
7. Do not show percentile data until a valid norm table/version is available.
8. Every AI narrative must visually display its epistemic status.
9. Every detailed measured score must provide access to confidence/uncertainty information.
10. Historical theory interpretations must never visually resemble direct measurements.
11. User-facing visualization labels must be Turkish-first; technical English terminology may appear secondarily in methodology/details.
12. Data visualizations must support responsive/mobile alternatives rather than simple shrinking.
13. Use subtle motion only; respect reduced-motion settings.
14. All states—loading, empty, partial, invalid, low-confidence, AI-unavailable—must be designed explicitly.
15. Do not implement “dark mode first”. The canonical first-release design is this light theme.

---

## 31. Definition of Done — Visual QA

A screen is not finished until:

- hierarchy is obvious within 3 seconds,
- spacing matches the token system,
- no chart implies unsupported precision,
- epistemic status is visible where relevant,
- confidence/uncertainty is reachable where relevant,
- mobile layout is intentionally designed,
- keyboard focus works,
- loading/empty/error states exist,
- copy is non-diagnostic,
- the page does not resemble a generic quiz site,
- the page does not resemble a hospital portal,
- the page feels like one coherent premium SaaS product.

---

## 32. Final Visual Principle

**Measured data first. Interpretation second. Decoration last.**

PsycheAI should make complex psychology feel understandable without making it look simplistic. The interface must reward curiosity and depth while continuously showing the user what is measured, what is inferred, how certain the system is, and which conclusions are only theoretical perspectives.
