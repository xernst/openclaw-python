# Pyloft (working name: code killa) — Master Development Plan

**Status:** Synthesis of `01-product.md` (pm) · `02-ux.md` (ux) · `03-architecture.md` (arch) · `04-brand.md` (brand)
**Synthesized by:** team-lead
**Date:** 2026-04-29
**Owner:** Josh Ernst

---

## 0. What this document is

A merge of four parallel planning slices into one execution-ready document. Where the four slices agreed, the merge is mechanical. Where they disagreed, the resolution is called out in **§1**. Where Josh has to decide, those questions are listed in **§9** — sprint 1 cannot start without answers.

The goal of this plan is to take the working code at `localhost:3000` (3-pane lesson UI · Pyodide-in-Web-Worker · ember-protected streaks · brain-dump · localStorage progress) and evolve it into a focused B2C product that ships to 10 friends as V1.

---

## 1. Decision log — what's locked, what's resolved, what's open

### Locked (all four slices agree)

| # | Decision | Source |
|---|---|---|
| 1 | The atomic content unit is the **Step**, not the Exercise. 8 types: `read · mc · fill · predict · fix · write · reorder · checkpoint`. | UX §1 + Arch §1 |
| 2 | A **lesson is 12–20 steps · 5–8 minutes**, sequenced in three phases (warmup ~25% · build ~60% · check ~15%). | UX §2 |
| 3 | **`fix` is the highest-leverage step type** for AI-first builders — appears 2–3× per lesson, more than `write`. | UX §1.5 |
| 4 | **Authoring format is YAML + Markdown hybrid.** One folder per lesson; `lesson.yaml` declares ordered step files; prose lives in `.read.md`, structured fields live in `.yaml`. | Arch §2 |
| 5 | **Static-first stays the architecture.** Pyodide-in-Web-Worker for execution. Vercel hobby tier covers V1 at $0. | Arch §0, §7 |
| 6 | **Free + OSS through V2.** Optional paid tier appears only at V3, gated on 500 V2 signups. | PM §7 |
| 7 | **No streaks-as-punishment, ever.** Embers and frozen-flames already implemented; copy follows ("welcome back," never "you broke your streak"). | UX §5 + Brand §4 |
| 8 | **No mascot.** A "Copilot Panel" — unnamed, dry, persistent right-rail UI element — fills the consistent-presence slot. | Brand §6 |
| 9 | **Progression UI is the Codecademy sidebar**, not the Duolingo path or a DAG. Visible-everywhere, jumpable, keyboard-navigable. | UX §4 |
| 10 | **Visual flip: emerald-on-zinc → ember-on-ink.** Ember `#F2683C` is the lead accent because it literally is the streak mechanic. Fonts: Fraunces (display) · Inter (UI) · JetBrains Mono (code). | Brand §5 |
| 11 | **AI is V2, not V1.** Boots-style mascot, inline help, llm-judge graders all wait for accounts + Haiku 4.5. v1 ships zero AI. | Arch §5 |
| 12 | **Tutor system prompt at temperature 0.4** when AI ships. No exclamation marks, no congratulating effort, no apologies, no pet names. | Brand §10 |
| 13 | **No paywall in chapters 1–5, no "free limit" gate, no leaderboards by default.** | UX §10 + PM §9 |
| 14 | **Persistent IDE — three-pane shell renders every step.** Sidebar + prompt panel + always-on Codecademy-style IDE (CodeMirror + Run + output). The IDE is *always populated and runnable*, even on `read` and `mc` steps (locked editor + run-anyway). The editor never empties between steps; it animates code into place to sell the "one continuous program" feeling. Mobile collapses to single-column with the IDE as a sticky bottom drawer. | UX §1.2 (added 2026-04-29 per Josh's note) |

### Resolved by synthesis (slices disagreed; one wins for a reason)

| # | Disagreement | Resolution | Why |
|---|---|---|---|
| R1 | **Step schema field names** — UX uses `kind`, Arch uses `type`; UX has `phase`, Arch does not; UX uses `estSeconds`, Arch uses lesson-level `estMinutes`. | **Adopt Arch's TS-typed schema as the canonical contract** (`type` discriminator, no per-step `phase` field). Add UX's `phase` and `estSeconds` as **optional metadata** the renderer can use for sequencing and the daily-goal math, but they don't gate validation. | Arch's schema is more rigorous and Zod-validatable; UX's `phase` is a *content authoring guideline* (lessons should have a warmup/build/check structure) not a runtime concern. Per-step `estSeconds` is genuinely useful for daily-goal math, so we keep it. |
| R2 | **MVP content scope** — PM specifies 8 brand-new generic lessons. Arch's migration plan ports the existing 28 chapters incrementally. | **PM wins for V1: 8 fresh lessons authored from scratch in the new YAML+MD format.** Arch's port plan applies to V2+ when we widen to chapters 2–7. The existing `~/python-course-2026/` content is reference material until then; the existing `lib/generated/manifest.json` continues to power the legacy 3-pane UI on `/learn/[chapter]/[lesson]` until V2 retires it. | De-Josh-ing 28 chapters is sneakily expensive (Kevin/Ondine/Yankees/IU references run deep) for zero new pedagogical value. Authoring 8 fresh lessons designed around the AI-builder wedge is faster and produces better content. |
| R3 | **ICP age center** — PM has Maya at 29; Brand anchored voice at 38. | **Maya stays at 29 as the sharpest acquisition target. Brand's voice register applies as the floor — concrete, dry, adult, no exclamation marks.** Persona band: late-20s to late-30s knowledge-worker pivoter. | A 29-year-old PM tolerates a 38-year-old's voice register; the reverse is not true. The voice is the bigger constraint; the age is the marketing-channel call. |
| R4 | **AI tutor naming** — Arch refers to "Boots-style mascot." Brand says no mascot, use Copilot Panel. | **Brand wins: rename anywhere "Boots" appears to "Copilot Panel." Arch's underlying integration (Haiku 4.5, ~$0.0002/interaction with caching, 5/session rate limit) is unchanged.** | Mascot is a brand decision; cost/model/rate-limit is an architecture decision. They're independent. |

### Open — Josh decides (see §9 for full list with recommendations)

- Final name (Pyloft pending sweep / keep code killa / other)
- Visual rebrand greenlight (Fraunces+Inter+JetBrains, ember-on-ink)
- Real evening-hour budget per week
- 10-friend list for V1 testing
- OSS-from-day-one yes/no
- Pyloft domain + trademark sweep result

---

## 2. Product spine (the wedge)

### Who

**ICP #1 — Maya, the AI-curious PM (PRIMARY for MVP).** 29, mid-level PM at a 200-person SaaS company, liberal arts undergrad, 5 years PM experience. Uses Cursor and ChatGPT daily. Has bounced off Codecademy, Coursera, and boot.dev because every existing course assumes she wants to be a software engineer — she doesn't. She wants to *read what Cursor wrote, know if it's wrong, and fix it.*

**ICP #2 — Marcus, the ops-to-builder pivoter (V2 wedge).** 34, ops manager. Wife pregnant. Sees AI eating his industry. Wants to be the person who builds the automations, not the one being automated. V1 voice/visuals must not alienate him, but his acquisition channel is V2.

**ICP #3 — Priya, the indie founder mid-game (V3 track).** 26, vibe-coder accumulating technical debt she can't read. Targeted "fundamentals for vibe coders" track lives at V3.

### Wedge

> Every existing platform — boot.dev, Codecademy, freeCodeCamp, Coursera — assumes the student wants to **become a software engineer**. Maya doesn't. She wants 2026 fundamentals, not 1995 fundamentals with 2025 gamification.

The curriculum inverts around the AI-builder workflow:
1. **Read first, write second.** Most lessons start with code Maya didn't write — generated, copied, found — and ask her to predict, explain, and modify.
2. **Skip what AI handles fluently.** No 90-minute lessons on string-formatting minutiae.
3. **Double down on what AI gets wrong.** Hallucinated APIs, silent type bugs, off-by-one errors, traceback reading, environment setup.
4. **Mental models over syntax.** State, mutation, scope, async, exceptions — the stuff you need to *direct* AI.

### Positioning sentence (locked)

> **Pyloft teaches you the Python you need to direct AI agents, read what they wrote, and catch what they got wrong. Unlike Codecademy, we're built around the AI you already use.**

---

## 3. The Step primitive — canonical schema

This is the load-bearing contract for the rest of the product. Implementations of `Lesson`, `Chapter`, `Step` ship in `lib/content/schema.ts` and are Zod-validated at build time.

### TypeScript types (Arch's, with UX's metadata extensions)

```typescript
// lib/content/schema.ts

export type Course = {
  slug: "python";
  version: string;
  title: string;
  chapters: Chapter[];
};

export type Chapter = {
  number: number;
  slug: string;
  title: string;
  blurb: string;
  lessons: Lesson[];
  checkpoint: CheckpointLesson;
  xpTotal: number;          // computed at build
};

export type Lesson = {
  slug: string;
  title: string;
  estMinutes: number;       // 5–8 typical
  prerequisites: string[];  // lesson slugs
  steps: Step[];
  xpTotal: number;
};

export interface StepBase {
  id: string;               // `ch03-strings/l02-fstrings/s05`
  xp: number;               // 1–3 typical, 5 for `write`, 25 for `checkpoint`
  hint?: Hint[];            // progressive reveal
  personalize?: boolean;    // opts the step into {{user.x}} substitution
  phase?: "warmup" | "build" | "check";  // UX sequencing metadata
  estSeconds?: number;      // 30–90; used for daily-goal math
  concept?: string;         // e.g. "for-loop-iteration" — used for conceptsTouched
}

export type Step =
  | ReadStep | MultipleChoiceStep | FillBlankStep | PredictStep
  | FixBugStep | WriteStep | ReorderStep | CheckpointStep;

export type ReadStep = StepBase & { type: "read"; body: string; cta?: string };
export type MultipleChoiceStep = StepBase & {
  type: "mc";
  prompt: string;
  options: { id: string; label: string; explain?: string }[];
  answerIds: string[];      // 1+ correct, supports multi-select
  shuffle?: boolean;
};
export type FillBlankStep = StepBase & {
  type: "fill";
  prompt: string;
  blanks: { id: string; accept: string[]; caseSensitive?: boolean; normalize?: "trim" | "collapse-ws" | "none" }[];
};
export type PredictStep = StepBase & {
  type: "predict";
  code: string;
  prompt: string;
  grader: StdoutGrader;
};
export type FixBugStep = StepBase & {
  type: "fix";
  brokenCode: string;
  prompt: string;
  grader: Grader;
  revealAfter?: number;
};
export type WriteStep = StepBase & {
  type: "write";
  prompt: string;
  starter: string;
  grader: Grader;
  solution?: string;
  stdin?: string;
};
export type ReorderStep = StepBase & {
  type: "reorder";
  prompt: string;
  fragments: { id: string; code: string }[];
  correctOrder: string[];
};
export type CheckpointStep = StepBase & {
  type: "checkpoint";
  prompt: string;
  starter: string;
  grader: Grader;
  solution: string;
};

export type Grader =
  | { kind: "string-equality"; expected: string | string[]; normalize?: "trim" | "collapse-ws" | "lower" | "none" }
  | { kind: "stdout-equality"; expected: string; normalize?: "trim" | "collapse-trailing-newline" | "none"; stdin?: string }
  | { kind: "ast-match"; must: AstRule[]; mustNot?: AstRule[] }
  | { kind: "llm-judge"; rubric: string; fallbackTo?: Grader; maxScore: number };

export type StepAttempt = {
  stepId: string;
  startedAt: string;
  submittedAt: string;
  correct: boolean;
  payload: unknown;
  hintsUsed: number;
};
```

### Step authoring template (YAML+MD)

```
content/python/01-variables/01-naming-things/
  lesson.yaml
  01-intro.read.md
  02-which-is-valid.mc.yaml
  03-fill-the-name.fill.md
  04-predict-this.predict.yaml
  05-fix-the-typo.fix.yaml
  06-write-greeting.write.yaml
  07-reorder.reorder.yaml
  08-checkpoint.checkpoint.yaml
```

`lesson.yaml`:

```yaml
slug: naming-things
title: "Naming things you'll point AI at"
estMinutes: 6
prerequisites: []
order:
  - 01-intro.read.md
  - 02-which-is-valid.mc.yaml
  - 03-fill-the-name.fill.md
  - 04-predict-this.predict.yaml
  - 05-fix-the-typo.fix.yaml
  - 06-write-greeting.write.yaml
  - 07-reorder.reorder.yaml
  - 08-checkpoint.checkpoint.yaml
```

A `.fix.yaml` step:

```yaml
type: fix
xp: 3
phase: build
estSeconds: 75
concept: variable-assignment
prompt: |
  Fix this so it prints `hello, {{user.name}}`.
brokenCode: |
  name = "{{user.name}}"
  print("hello, {name}")
grader:
  kind: stdout-equality
  expected: "hello, {{user.name}}\n"
revealAfter: 4
hint:
  - level: 1
    body: Look at the quotes around the print call.
  - level: 2
    body: That string isn't an f-string.
```

### Canonical lesson sequence (UX's "rule of three")

```
read → mc → read → predict → fill → fix → reorder → fix → write → mc → checkpoint
```

Two reads + one MC before any production step. `write-code` only appears after the same construct has been seen in `fill` and `fix`. Lesson target 5–8 min, median 6.

---

## 4. Visual + voice spec (Brand applied)

### Palette (replaces emerald-on-zinc)

| Role | Hex | Notes |
|---|---|---|
| Ink (dark bg) | `#0E0F12` | Near-black, slightly cool |
| Paper (light bg) | `#F7F4ED` | Warm off-white |
| Ember (lead accent) | `#F2683C` | Warm orange — IS the streak mechanic |
| Signal (correct) | `#5BC8AF` | Muted teal-green, used sparingly |
| Slate (text/muted) | `#9AA0A8` | Body on dark, secondary chrome |

### Typography (free Google Fonts only)

- **Fraunces** — display / chapter titles / lesson titles. Variable serif. Never below 18px.
- **Inter** — UI / body copy.
- **JetBrains Mono** — editor, inline code, output panes.

### Tone redlines

1. No exclamation marks anywhere in product copy.
2. No congratulating effort — only acknowledge specific actions.
3. No pet names ("friend," "buddy") and no apologies.
4. No "you broke your streak" — copy frames everything as additive.
5. No fake urgency or scarcity.

### Five canonical brand moments — actual copy

| Moment | Copy |
|---|---|
| First 30s onboarding | *"Welcome to Pyloft. You're here because AI writes most of your code now, and you want to actually understand what it's doing. We'll teach you the Python you need to direct it, read it, and catch when it's wrong. Not a CS degree. Just enough."* |
| First wrong answer | *"That ran, but it didn't return what we expected. Look at line 3 — `total` is a string, not a number."* |
| First lesson done | *"Done. That's variables. Next time Cursor reaches for one, you'll know which is which."* |
| First chapter done | *"Chapter 1, complete. You can now read the variable, function, and loop work in any AI-generated Python file. Your ember is at 5. It survives one missed day."* |
| First ember spent | *"Your ember held the line. You missed yesterday. The ember burned one charge so the streak survived. You've got 4 left. No drama — pick up where you left off."* |

---

## 5. Architecture migration path

### Current state (today, 2026-04-29)

- 3-pane lesson UI rendering 5 monolithic exercises per chapter
- `lib/generated/manifest.json` produced by `scripts/build-content.mjs` walking `~/python-course-2026/`
- Pyodide-in-Web-Worker grading via stdout-equality
- localStorage progress · ember/flame streaks · brain-dump · welcome-back resume

### Target state (V1 ship-to-friends)

- 8 fresh lessons in `content/python/{chapter}/{lesson}/` (YAML+MD authored from scratch)
- New `<StepRenderer>` component routes 8 step types to their UIs
- Codecademy-style sidebar progression UI replaces the chapter grid
- Build pipeline emits `manifest.toc.json` + `chapters/{slug}.json` (split manifest)
- Existing 3-pane lesson UI on `/learn/[old-chapter]/[old-lesson]` co-exists, marked "legacy" until V2 ports
- Full visual rebrand applied (Fraunces + Inter + JetBrains Mono · ember-on-ink)
- Onboarding flow captures `UserProfile` (name, goal, level, optional pet/team/city, daily goal)
- Daily goal floor mechanic + welcome-back state + Copilot Panel (visual stub, no AI yet)
- localStorage only, no server, no auth, no AI

### V2 (account · sync · AI tutor)

- Clerk auth + Neon Postgres (~$0/100 MAU, ~$19/1K MAU, ~$115/10K MAU)
- localStorage → server sync via debounced last-write-wins on monotonic progress
- Copilot Panel powered by Claude Haiku 4.5 (~$0.0002/interaction with caching, 5/session rate limit, server-side guard)
- Inline help button on `write` and `fix` steps (~$0.0014/req, 10/day/user limit)
- Port chapters 2–7 from `~/python-course-2026/` to YAML+MD

### V3 (revenue + social, only if V2 hits)

- Optional paid tier $7/mo or $49/yr (intentionally below boot.dev's $29/mo)
- Friends, activity feed (friends-only, no global leaderboards), presence via Vercel KV
- llm-judge grader for late chapters (LLMs, capstone)
- Vercel Sandbox for chapters 22–28 server-side execution (~$10/mo at 10K MAU)
- Port remaining chapters 8–28

---

## 6. Sprint plan

Sprints sized for an evening-time founder with ADHD. Each sprint has one **STOP gate** — a question that, if answered "no," means the sprint did not succeed and the next sprint should not start.

### Sprint 0 — Decisions + visual rebrand (this week, 4–8 hours)

**Goal:** Lock the open decisions in §9 and apply the visual rebrand to the existing UI.

- Josh answers the 8 decision questions in §9
- Domain + trademark sweep on `pyloft.com` / `pyloft.dev`
- Apply ember-on-ink palette to existing globals.css
- Add Fraunces + Inter + JetBrains Mono via `next/font/google`
- Rename product strings "code killa" → "Pyloft" (or whatever Josh picks)
- Rebuild + screenshot diff against current state

**STOP gate:** *Does the rebranded UI feel like Pyloft and not boot.dev?* If no, iterate before sprint 1.

### Sprint 1 — Persistent IDE shell + schema + first 3 step types (week 1–2, ~10 hours)

**Goal:** Implement the canonical Step schema, build the always-on IDE shell, and prove the YAML+MD path with one runnable lesson.

- `lib/content/schema.ts` — TS types + Zod validators for all 8 step types (with `code?`, `runnable?`, `files?` optional fields per UX's IDE spec)
- `scripts/build-content.mjs` v2 — walks `content/python/`, parses YAML+MD, validates, emits `manifest.toc.json` + `chapters/*.json`
- `<LessonShell>` — three-pane layout (sidebar | prompt panel | IDE). Extends the existing 3-pane UI; the IDE is shared across step types and consumes a per-step config (read-only flag, run-enabled, files, hidden tests). Mobile bottom-drawer adaptation in v1.
- 3 step-type prompt-panel components: `<ReadStep>`, `<MCStep>`, `<FillStep>` (only the prompt panel changes per type — IDE is shared)
- One full lesson authored in YAML+MD: `content/python/01-variables/01-naming-things/` (8 steps)
- Renders at `/learn/v2/[chapter]/[lesson]/[stepIndex]` (parallel to legacy)
- Personalization tokens (`{{user.name}}`, `{{user.dog}}`) resolved at render time
- IDE behavioral rules: editor never empties between steps (animates), Run always available even mid-fill, locked-editor `🔒` icon on read-only steps

**STOP gate:** *Does it feel like a Codecademy IDE that happens to teach lessons, not a lesson that has an editor?* If no, the persistent-IDE move isn't selling — fix it before adding more step types.

### Sprint 2 — Remaining step types + onboarding + sidebar (week 2–3, ~12 hours)

**Goal:** Ship every step type and the navigation surface that ties them together.

- Implement `<PredictStep>`, `<FixStep>`, `<WriteStep>`, `<ReorderStep>`, `<CheckpointStep>`
- Onboarding flow: 5 screens (welcome · goal-with-AI · level · personalization · daily goal)
- `UserProfile` schema in `lib/types.ts`, persisted to localStorage
- Codecademy-style sidebar: chapters → lessons → steps with completion checkmarks
- Daily goal floor mechanic: dial in top-right, fills green at goal, never punishes when missed

**STOP gate:** *Can a fresh user (incognito tab) onboard and complete one lesson without confusion?* If no, fix UX before authoring more lessons.

### Sprint 3 — Author the remaining 7 MVP lessons (week 3–4, ~14 hours)

**Goal:** Ship 8 lessons of MVP content, all in the new format, written for Maya.

- Author 7 more lessons in YAML+MD covering the foundational arc:
  1. Variables and types (read, don't write)
  2. Functions and return values (the most-hallucinated thing)
  3. Lists and dicts (the bones of every API response)
  4. Loops and comprehensions (predict the output)
  5. Conditionals and truthiness (where AI silently bugs)
  6. Reading a traceback
  7. Mutation and state (why your code mysteriously breaks)
  8. Modules and imports (why your venv hates you)
- Each lesson: 12–20 steps, 5–8 min, 2–3 `fix` steps, 1–2 `write` steps, ~8 reads/MCs/fills/predicts/reorders
- AI-assisted authoring: Josh writes lesson outline + first 2 steps; Claude drafts remaining steps in YAML+MD; Josh edits

**STOP gate:** *Does Josh use Pyloft daily for one week to learn the lessons himself?* If no, the curriculum has a problem; fix before sending to friends.

### Sprint 4 — Polish + ship to 3 (week 4, ~6 hours)

**Goal:** Production-ready V1 in a friend's hands.

- Sound + animation (defaulted off; prompt at end of lesson 1)
- Welcome-back state on home (non-punitive copy)
- Brain-dump Obsidian-export button (markdown download)
- Deploy to `pyloft.dev` (or fallback domain)
- Send to **3 friends** Josh trusts most for honest feedback
- Set up minimal analytics (Vercel Web Analytics + Speed Insights)

**STOP gate:** *Do 2 of 3 friends complete lesson 1?* If no, V1 has a wedge problem and Sprint 5 doesn't start.

### Sprint 5 — Validation + 7 more friends (week 5–6, ~8 hours)

**Goal:** Confirm wedge resonates outside Josh's head.

- 3 user interviews (30 min each) with the first 3 friends
- Iterate on 1–2 highest-leverage feedback points
- Send to remaining 7 friends
- Track lesson 1 → lesson 8 completion

**STOP gate (V1→V2):** *Do 5 of 10 friends complete all 8 lessons within 2 weeks?* If no, do not start V2 — iterate V1 or kill the project.

### V2 starts only after the V1 STOP gate passes

V2 sprints (account · sync · Copilot Panel · port chapters 2–7) are scoped in `03-architecture.md` §10 and `01-product.md` §5. Plan them when V1 validation lands.

---

## 7. Risk register (PM §8 + synthesis additions)

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | **Josh runs out of evening time and stalls** (single founder, ADHD, grad school, consulting) | High | High | Phase gates are small (8 lessons). Josh uses what he builds. Brain-dump captures context across sessions. STOP gates kill projects early instead of dragging them. |
| 2 | **Wedge doesn't resonate** — Maya tries V1 and says "this is just Codecademy with different vibes" | Medium | Critical | Sprint 5 includes 3 user interviews; if wedge fails interviews, kill or pivot before V2. Don't sunk-cost-fallacy 28 chapters. |
| 3 | **Pyodide hits a wall** — Python feature we need doesn't work in browser, mobile breaks, load times degrade | Medium | High | MVP scope is deliberately Pyodide-friendly (no networking, no FS, no native deps). Mobile is OUT of V1. Vercel Sandbox is the documented escape hatch. |
| 4 | **Visual rebrand reads cold or loses the "fun" of code killa** | Medium | Medium | Brand's Fraunces+ember+ink is a hypothesis, not a religion. If Sprint 0 STOP gate fails, iterate within ember-on-ink territory rather than reverting to emerald-on-zinc. |
| 5 | **8 fresh lessons take longer to author than estimated** | Medium | Medium | AI-assisted authoring (Claude drafts → Josh edits) cuts authoring time ~3×. STOP gate at Sprint 3 catches this — if Josh isn't through 8 lessons by week 4, the time budget is wrong, not the plan. |
| 6 | **Free + OSS gets cloned + outcompeted** | Low | Medium | Brand and curriculum POV (not code) are the moat. Distribution (Josh's network, X presence) is non-trivial. |

---

## 8. Anti-goals — what Pyloft refuses to be

- Not a CS degree. No data structures, algorithms, Big-O, leetcode.
- Not a job-prep platform. No interview prep, no portfolio coaching, no certificates.
- Not a community. No forums, no Discord, no leaderboards, no leagues.
- Not for kids. No mascots, no infantilizing copy, no streaks-as-punishment.
- Not multi-language. Python only.
- Not a video course. Text + code first.
- Not freemium-with-pain. No "you've used 3 of 5 free lessons."
- Not a bootcamp. No "5 hours/day" programs.
- Not for engineers leveling up. We're not where senior devs go to learn Rust. We're where Maya stops being scared of `KeyError`.

---

## 9. Decision points for Josh — sprint 0 cannot start without these

Each question has a recommendation. If you accept the recommendation, say so; if you push back, say what's wrong.

| # | Question | Recommendation | Source |
|---|---|---|---|
| 1 | **Final name** — Pyloft (pending domain/trademark sweep) / keep "code killa" / pick a different alternative (Reckon, Sidecar, Pyfluent, Pilot.py) | **Accept Pyloft pending sweep.** Brand's argument is strong: friend-test, SEO, cultural-appropriation risk, doesn't say what it does. | Brand §1 + PM v1.1 |
| 2 | **Domain + trademark sweep** — who runs it and by when | **You run it this week** (5 min on a registrar + USPTO TESS search). Locks naming for everything downstream. | Synthesis |
| 3 | **Visual rebrand** — accept ember-on-ink + Fraunces+Inter+JetBrains, or keep emerald-on-zinc | **Accept the rebrand.** Ember IS the streak mechanic — the brand color = the gameplay metaphor is a free coherence win. Differentiates hard from boot.dev. | Brand §5 |
| 4 | **V1 content scope** — 8 fresh lessons authored from scratch vs. de-Joshing existing chapters 1–7 | **Accept fresh lessons.** Authoring is faster than de-Joshing once you account for how deep Kevin/Ondine/Yankees/IU references go in the existing content. | PM §4 |
| 5 | **ICP age center** — Maya at 29, marketing-manager at 38, or band late-20s to late-30s | **Maya stays at 29 as MVP target. Voice register applies as a floor (concrete, dry, adult).** Band the persona, sharpen the channel. | PM v1.1 + Brand §1 |
| 6 | **OSS posture** — public GitHub from day one, or stealth until V2 | **Public from day one.** OSS signal is the marketing for an indie founder pre-distribution. | PM §7 |
| 7 | **Real time budget** — sustainable hours/week | **Tell us the actual number.** If <8/week, V1 takes 12 weeks not 4 — plan against the real, not aspirational. | PM §10 #5 |
| 8 | **10 friends for V1** — name them, with a hypothesis on which ICP each fits (Maya/Marcus/Priya) | **Name them.** Shipping into a void of "supportive friends who won't finish lesson 2" is the cheapest avoidable failure. | PM §10 #3 |

---

## 10. The next concrete step

If you accept the recommendations in §9, **Sprint 0 starts now and ships this week**. The first thing I'll touch is the visual rebrand on the existing UI (palette swap + Fraunces/Inter/JetBrains via `next/font/google` + product-string rename), so by next session the working app at `localhost:3000` looks and feels like Pyloft, not code killa.

If you push back on any §9 question, say which one and what you'd prefer; the rest of the plan is robust to most single-question changes.

---

## Appendix — pointers to source slices

- **PM** (Alex) — `docs/plan/01-product.md` — ICP, positioning, MVP, V1/V2/V3 phases, success metrics, pricing, risks, anti-goals, decision points.
- **UX** (`ux`) — `docs/plan/02-ux.md` — Step primitive (8 types with JSON schemas + ASCII sketches), lesson shape, onboarding, progression UI, daily goal, sound/animation, IA, A11y, first 90 seconds, redlines.
- **Architect** (`arch`) — `docs/plan/03-architecture.md` — Content schema (TS types), authoring format (YAML+MD), build pipeline, multi-user data model with v1/v2/v3 migration + Postgres schema, AI integration with cost analysis, performance, deployment, observability, security, migration plan.
- **Brand** — `docs/plan/04-brand.md` — Name audit + Pyloft verdict, positioning, voice/tone with say-this-not-that examples, redlines, visual direction (palette, typography, logo sketches), mascot question, key brand moments with actual copy, marketing surfaces, AI guardrails + tutor system prompt.
