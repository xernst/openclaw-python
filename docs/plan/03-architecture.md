# Code Killa — Architecture Plan

**Status:** Proposed (v1 → v3 roadmap)
**Audience:** Josh (single-author now), future contributors, AI authors
**Last updated:** 2026-04-28

---

## 0. Architectural posture

Three forces dominate every decision: **author velocity** (Josh writes the course; friction between "idea" and "live" kills the product), **reversibility** (v1 is single-user localStorage — we will get the data model wrong, so optimize for cheap migration not correct first try), and **$0 infra ceiling** (Vercel hobby + Pyodide-in-browser is the floor; spend only when revenue or a product ceiling forces it).

The system is a **content-first static site with a thick client**. The Next.js app is a renderer; the filesystem is the database; the browser is the runtime. Components graduate to servers only when they earn it.

---

## 1. Content schema

The current schema (`lib/types.ts`) is exercise-shaped: each chapter has up to 5 `Exercise` rows with a `starter`, a `goal`, and an `expectedStdout`. That maps 1:1 to Josh's `python-course-2026` filesystem. It does not support a Duolingo-style micro-step lesson.

We replace the exercise as the atomic unit with a **Step** discriminated union. A `Lesson` becomes an ordered list of 10–20 steps. A `Chapter` is a list of lessons plus a checkpoint.

### Reconciliation with UX (`02-ux.md` §1.2/§1.3)

The schema is the canonical contract for both this doc and `02-ux.md`. Field names use the architect's short forms (`mc | fill | predict | fix | write | reorder | checkpoint`); UX uses the same. UX's persistent IDE shell adds three things to `StepBase`:

- **`files?`** — multi-file IDE seeding. Build pipeline synthesizes `[{ name: "main.py", content: <step's starter|code|"">, readonly }]` when omitted. Authors set `files` only for multi-file steps.
- **`phase?`** (`"warmup" | "build" | "check"`), **`estSeconds?`**, **`concept?`** — used by lesson-shape and daily-goal math. Build pipeline supplies defaults (`phase: "build"`, `estSeconds` heuristic by `step.type`, `concept: lesson.slug`) so authors don't write them by hand.
- **`code?`** + **`runnable?`** on `ReadStep` and `MultipleChoiceStep` — the IDE is always populated and runnable, even when the user can't change anything. `body` stays for prose; `code` populates the IDE.

### TypeScript types

```typescript
// lib/content/schema.ts

export type Course = {
  slug: "python";
  version: string;          // semver of the *content*, not the app
  title: string;
  chapters: Chapter[];
};

export type Chapter = {
  number: number;
  slug: string;
  title: string;
  blurb: string;            // 1-2 sentence pitch shown on chapter card
  lessons: Lesson[];
  checkpoint: CheckpointLesson;
  xpTotal: number;          // computed at build time
};

export type Lesson = {
  slug: string;
  title: string;
  estMinutes: number;       // 3-7 for a micro-lesson
  prerequisites: string[];  // lesson slugs that must be `passed` first
  steps: Step[];
  xpTotal: number;          // sum of step.xp
};

export type StepBase = {
  id: string;               // stable id: `ch03-strings/l02-fstrings/s05`
  xp: number;               // 1-3 typical, 5 for a "write" step
  hint?: Hint[];            // shown on demand, costs nothing
  personalize?: boolean;    // if true, render tokens like {{user.dog}}

  // IDE-shell scaffolding (UX §1.2): the three-pane layout is constant across
  // all step types, so every step can seed the IDE with files. Build pipeline
  // synthesizes a default `[{ name: "main.py", content: <starter|code|"">, readonly }]`
  // when omitted, so authors only set `files` for multi-file steps.
  files?: { name: string; content: string; readonly?: boolean }[];

  // Lesson-shape + daily-goal math (UX §1.3). Build pipeline supplies defaults:
  //   phase: "build" | estSeconds: heuristic from step.type | concept: lesson.slug
  // Authors override when they know better.
  phase?: "warmup" | "build" | "check";
  estSeconds?: number;
  concept?: string;
};

export type Step =
  | ReadStep
  | MultipleChoiceStep
  | FillBlankStep
  | PredictStep
  | FixBugStep
  | WriteStep
  | ReorderStep
  | CheckpointStep;

export type ReadStep = StepBase & {
  type: "read";
  body: string;             // markdown narrative — prose only, NOT what populates the IDE
  code?: string;             // populates the IDE so the right pane is never empty
  runnable?: boolean;        // default true when `code` present; false = read-only display
  cta?: string;             // button label, default "Got it"
};

export type MultipleChoiceStep = StepBase & {
  type: "mc";
  prompt: string;           // markdown
  code?: string;             // optional context shown in the IDE while choosing
  runnable?: boolean;        // default true when `code` present
  options: { id: string; label: string; explain?: string }[];
  answerIds: string[];      // 1+ correct, supports multi-select
  shuffle?: boolean;
};

export type FillBlankStep = StepBase & {
  type: "fill";
  prompt: string;           // contains one or more `___` blanks
  blanks: {
    id: string;             // matches order of `___` in prompt
    accept: string[];       // case-insensitive by default
    caseSensitive?: boolean;
    normalize?: "trim" | "collapse-ws" | "none";
  }[];
};

export type PredictStep = StepBase & {
  type: "predict";
  code: string;             // shown read-only, runs through Pyodide on submit
  prompt: string;           // "What does this print?"
  grader: StdoutGrader;     // user types stdout; we run code and compare
};

export type FixBugStep = StepBase & {
  type: "fix";
  brokenCode: string;       // editable; has 1-3 intentional bugs
  prompt: string;
  grader: Grader;           // usually stdout-equality, sometimes ast-match
  revealAfter?: number;     // # of failed attempts before solution unlocks
};

export type WriteStep = StepBase & {
  type: "write";
  prompt: string;
  starter: string;          // can be empty
  grader: Grader;
  solution?: string;        // shown after pass or after revealAfter attempts
  stdin?: string;           // piped to Pyodide stdin
};

export type ReorderStep = StepBase & {
  type: "reorder";
  prompt: string;
  fragments: { id: string; code: string }[]; // shown shuffled
  correctOrder: string[];   // ids in correct order
};

export type CheckpointStep = StepBase & {
  type: "checkpoint";
  // a "boss fight" — same shape as WriteStep but tagged for streak/XP bonuses
  prompt: string;
  starter: string;
  grader: Grader;
  solution: string;
};

export type CheckpointLesson = Lesson & {
  isCheckpoint: true;
  rewardFrozenFlame: true;  // grant a frozen flame on completion
};

export type Hint = {
  level: 1 | 2 | 3;         // 1=nudge, 2=concrete, 3=near-solution
  body: string;             // markdown
  cost?: number;            // XP penalty; 0 by default
};

export type Grader =
  | StringEqualityGrader
  | StdoutGrader
  | AstMatchGrader
  | LlmJudgeGrader;

export type StringEqualityGrader = {
  kind: "string-equality";
  expected: string | string[];   // any-of
  normalize?: "trim" | "collapse-ws" | "lower" | "none";
};

export type StdoutGrader = {
  kind: "stdout-equality";
  expected: string;
  normalize?: "trim" | "collapse-trailing-newline" | "none";
  stdin?: string;
};

export type AstMatchGrader = {
  kind: "ast-match";
  must: AstRule[];          // e.g. { kind: "calls", name: "print" }
  mustNot?: AstRule[];      // e.g. forbid `eval`
};

export type AstRule =
  | { kind: "calls"; name: string }
  | { kind: "uses-loop" }
  | { kind: "defines-function"; name?: string; minArgs?: number }
  | { kind: "uses-import"; module: string }
  | { kind: "no-globals" };

export type LlmJudgeGrader = {
  kind: "llm-judge";
  rubric: string;           // prompt fragment
  fallbackTo?: StdoutGrader; // try cheap grader first
  maxScore: number;         // pass threshold
};
```

### JSON examples per step type

```json
{
  "id": "ch03-strings/l02-fstrings/s01",
  "type": "read",
  "xp": 1,
  "phase": "warmup",
  "estSeconds": 25,
  "body": "# F-strings\n\nIn Python, you can drop a variable straight into a string by prefixing the string with `f`. The IDE on the right is showing it — hit Run.",
  "code": "name = \"{{user.name}}\"\nprint(f\"hi, {name}\")",
  "runnable": true
}
```

```json
{
  "id": "ch03-strings/l02-fstrings/s02",
  "type": "mc",
  "xp": 2,
  "prompt": "Which of these is a valid f-string?",
  "options": [
    { "id": "a", "label": "`f\"{x}\"`" },
    { "id": "b", "label": "`\"f{x}\"`", "explain": "The `f` has to be *before* the quote." },
    { "id": "c", "label": "`f'{x}'`" }
  ],
  "answerIds": ["a", "c"]
}
```

```json
{
  "id": "ch03-strings/l02-fstrings/s03",
  "type": "fill",
  "xp": 2,
  "prompt": "Complete the f-string so it prints `hi, {{user.dog}}`:\n\n```python\ndog = \"{{user.dog}}\"\nprint(___\"hi, {dog}\")\n```",
  "blanks": [{ "id": "1", "accept": ["f"], "caseSensitive": true }]
}
```

```json
{
  "id": "ch03-strings/l02-fstrings/s04",
  "type": "predict",
  "xp": 2,
  "code": "x = 7\nprint(f\"value is {x*2}\")",
  "prompt": "What does this print?",
  "grader": {
    "kind": "stdout-equality",
    "expected": "value is 14\n",
    "normalize": "collapse-trailing-newline"
  }
}
```

```json
{
  "id": "ch03-strings/l02-fstrings/s05",
  "type": "fix",
  "xp": 3,
  "brokenCode": "name = \"world\"\nprint(\"hello, {name}\")",
  "prompt": "Fix this so it prints `hello, world`.",
  "grader": {
    "kind": "stdout-equality",
    "expected": "hello, world\n"
  },
  "revealAfter": 4
}
```

```json
{
  "id": "ch03-strings/l02-fstrings/s06",
  "type": "write",
  "xp": 5,
  "prompt": "Print a line that says `{{user.dog}} is {{user.dogAge}} years old` using an f-string.",
  "starter": "name = \"{{user.dog}}\"\nage = {{user.dogAge}}\n# your code:\n",
  "grader": {
    "kind": "ast-match",
    "must": [{ "kind": "calls", "name": "print" }, { "kind": "uses-import", "module": "" }]
  },
  "solution": "name = \"{{user.dog}}\"\nage = {{user.dogAge}}\nprint(f\"{name} is {age} years old\")"
}
```

```json
{
  "id": "ch03-strings/l02-fstrings/s07",
  "type": "reorder",
  "xp": 2,
  "prompt": "Put these lines in the right order to greet a user.",
  "fragments": [
    { "id": "a", "code": "name = input()" },
    { "id": "b", "code": "greeting = f\"hi, {name}\"" },
    { "id": "c", "code": "print(greeting)" }
  ],
  "correctOrder": ["a", "b", "c"]
}
```

### Personalization tokens

`{{user.name}}`, `{{user.dog}}`, `{{user.team}}`, `{{user.dogAge}}`, etc. Resolved client-side at render time from a `UserProfile` collected during onboarding. Steps with `personalize: true` opt in; renderer is a single `interpolate(text, profile)` call. If a token is missing, fall back to a sensible default (`name → "friend"`, `dog → "your dog"`). **Graders never see the raw tokens** — interpolation happens before the grader runs, so the `expected` field is also interpolated. This means `expected: "hi, {{user.dog}}\n"` works the same as the prompt.

### Grader semantics — pick the cheapest one that works

| Grader | Use for | Cost | Notes |
|---|---|---|---|
| `string-equality` | `fill`, MC text matching | free | Default for fill blanks. |
| `stdout-equality` | `predict`, simple `write`, `fix` | Pyodide CPU only | The 80% case. |
| `ast-match` | "must use a loop", "must call print" | Pyodide AST parse | Cheap, deterministic, frustrating if rules are sloppy. |
| `llm-judge` | Open-ended `write` ("explain this"), late chapters | $0.0003 per call (Haiku) | Always set `fallbackTo` so we don't pay if cheaper grader passes. |

---

## 2. Authoring flow — three options, one pick

### Option A — Markdown with custom fences (Mintlify-style)

```markdown
---
title: F-strings
estMinutes: 5
---

::: read
# F-strings
In Python, you can drop...
:::

::: mc
Which is valid?
- (x) `f"{x}"`
- ( ) `"f{x}"` -- explain: The f has to be before the quote.
- (x) `f'{x}'`
:::

::: write xp=5
Print a line saying `{{user.dog}} is...`
```python starter
name = "{{user.dog}}"
```
```python solution
name = "{{user.dog}}"
print(f"{name} is...")
```
:::
```

**Pro:** Reads like prose. Familiar to anyone who's written for Mintlify, Astro, or futurecoder.
**Con:** Custom parser. Every new step type means parser work. AI tooling has to learn our DSL. Errors at parse time are usually cryptic.

### Option B — YAML front matter + Markdown body, one file per step

```
content/python/03-strings/02-fstrings/
  lesson.yaml          # title, prerequisites, lesson-level metadata
  01.read.md
  02.mc.yaml
  03.fill.md
  04.predict.yaml
  05.fix.yaml
  06.write.yaml
  07.reorder.yaml
```

**Pro:** One file per step is git-blame-friendly. Mixed format (md for prose, yaml for structured) plays to each format's strengths.
**Con:** Lots of files. Reordering steps means renumbering filenames or maintaining `order` field. Two formats to learn.

### Option C — Pure JSON-TS (every step is a `.ts` module exporting a typed object)

```typescript
// content/python/03-strings/02-fstrings/05-fix.ts
import { fixStep } from "@/lib/content/dsl";

export default fixStep({
  id: "ch03-strings/l02-fstrings/s05",
  xp: 3,
  brokenCode: 'name = "world"\nprint("hello, {name}")',
  prompt: "Fix this so it prints `hello, world`.",
  expected: "hello, world\n",
  revealAfter: 4,
});
```

**Pro:** Type-safe at write time. No parser. AI authors (Claude, Cursor) understand TypeScript natively — no DSL to learn. Refactors and renames are mechanical. IDE autocomplete on every field.
**Con:** Less prose-like. Markdown bodies are template-string-escaped (annoying for big code blocks). Looks "developer-y" — friction for non-coder contributors.

### Decision: **Option B (YAML+MD hybrid).**

**Why:**

1. **Josh authors fast in markdown.** Reading a step out loud should match reading the file. Predict/fix/write steps are mostly *prose explaining code* — markdown wins.
2. **AI authors don't need TypeScript safety here.** Claude can produce valid YAML+MD reliably; the build pipeline validates with Zod and surfaces errors with line numbers. The TS safety from Option C is a *runtime* concern we already handle with Zod parsing.
3. **Future contributors don't need to know Next.js.** A friend who wants to write a chapter on `requests` opens VS Code, sees `01.read.md` and `02.mc.yaml`, and can pattern-match. No imports, no module system.
4. **Reordering is the only real downside.** We solve it with an explicit `order:` field in `lesson.yaml` rather than filename prefixes — files become `read-fstring-intro.md`, `mc-which-is-valid.yaml`, etc., and `lesson.yaml` lists them in order. Renames don't break ordering.

**Full lesson example:**

```
content/python/03-strings/02-fstrings/
  lesson.yaml
  01-intro.read.md
  02-which-valid.mc.yaml
  03-add-the-f.fill.md
  04-what-prints.predict.yaml
  05-fix-the-string.fix.yaml
  06-write-greeting.write.yaml
  07-reorder.reorder.yaml
```

`lesson.yaml`:

```yaml
slug: fstrings
title: F-strings
estMinutes: 5
prerequisites: [string-basics]
order:
  - 01-intro.read.md
  - 02-which-valid.mc.yaml
  - 03-add-the-f.fill.md
  - 04-what-prints.predict.yaml
  - 05-fix-the-string.fix.yaml
  - 06-write-greeting.write.yaml
  - 07-reorder.reorder.yaml
```

`05-fix-the-string.fix.yaml`:

```yaml
type: fix
xp: 3
prompt: |
  Fix this so it prints `hello, world`.
brokenCode: |
  name = "world"
  print("hello, {name}")
grader:
  kind: stdout-equality
  expected: "hello, world\n"
revealAfter: 4
hint:
  - level: 1
    body: Look at the quotes around the print call.
  - level: 2
    body: That string isn't an f-string.
```

The `.read.md` files use YAML frontmatter for metadata + markdown body — same pattern as Obsidian notes Josh already writes daily.

---

## 3. Build pipeline evolution

### Current

`scripts/build-content.mjs` walks `~/python-course-2026/`, runs `solutions/exercise_N.py` via `python3` to capture stdout, and emits `lib/generated/manifest.json` (~670KB for 28 chapters × 5 exercises). The Next.js app imports this JSON at module level. Pyodide grades client-side by comparing stdout.

### Target

The build script grows three responsibilities:

1. **Walk the new `content/python/` tree** (lessons of steps), parse each step file with Zod, validate the discriminated union, and fail loudly on missing fields. The script becomes the schema enforcer.
2. **Run pre-flight on every grader.** For `stdout-equality` and `ast-match`, run the `solution` field through CPython locally and confirm it actually passes. This catches "I shipped a broken solution" before deploy. (For `llm-judge`, skip — too expensive.) Same approach as today's solution-runner, scaled to every gradeable step.
3. **Emit *split* manifests, not one file.** A 30-chapter course with ~15 steps per lesson and ~6 lessons per chapter is ~2,700 steps. At ~1KB each that's ~2.7MB. We split:
   - `manifest.toc.json` — chapter list, lesson titles, slug map. Loaded eagerly. ~50KB.
   - `chapters/{chapter-slug}.json` — one file per chapter. Loaded on chapter open. ~100KB each.
   - `lessons/{chapter}/{lesson}.json` — only for very fat lessons (>50KB), else inline.

The Next.js app uses route-segment colocation: `app/learn/[chapter]/[lesson]/page.tsx` imports its lesson JSON directly. Next can statically generate every route from the TOC, so we keep the static-site posture.

### When to move to a database

Three triggers, in order of likelihood:

1. **Authoring becomes collaborative.** Two people editing the same lesson is fine on git. Five people running editors in a browser is not. → DB-backed authoring tool (Sanity / a Postgres-backed CMS) when contributor count crosses ~5.
2. **Content > 5MB total.** Static manifests stop being free at some point. The TOC stays static; lesson bodies move to a DB read at request time. Vercel hobby is fine until ~10MB of static content; we have headroom.
3. **Personalization needs server compute.** If `{{user.dog}}` graduates from "render-time substitution" to "step body adapts to user history," that's a server.

We are *years* from any of these. Static-first is correct until disproven.

---

## 4. Multi-user data model

### v1 — localStorage only (now)

No server, no auth, no sync. Extend the existing `GlobalProgress` shape for the step model:

```typescript
type ProgressV1 = {
  schemaVersion: 1;
  userId: string;            // anonymous uuid generated on first visit
  profile: {                 // collected during onboarding
    name?: string;
    dog?: string;
    dogAge?: number;
    team?: string;
  };
  steps: Record<string, {    // key = step.id
    status: "passed" | "failed" | "skipped";
    attempts: number;
    firstSeenAt: string;
    passedAt?: string;
    hintsUsed: number[];
  }>;
  lessons: Record<string, {  // key = `${chapter}/${lesson}`
    completedAt?: string;
    abandonedAt?: string;
  }>;
  streak: StreakState;       // unchanged from current
  lastVisited?: { chapter: string; lesson: string; stepIndex: number };
  brainDump: BrainDumpEntry[];
  conceptsTouched: string[];
};
```

**Key invariant:** every write goes through a single `progress.update(fn)` reducer that bumps `schemaVersion` if needed. This is the migration seam for v2. **Export/import** is a JSON dump button in settings — gives users device portability today and de-risks v2 migration.

### v2 — accounts and cloud sync

Trigger: Josh invites friends or someone asks "can I use this on my phone?"

**Auth: Clerk.** Vercel Marketplace integration, free tier covers 10K MAU. Drop-in UI saves a week of work; cheaper alternatives (Auth.js, Supabase Auth) stay as Plan B if pricing shifts.

**DB: Neon Postgres** via Vercel Marketplace. Free tier 0.5GB storage + 100 compute hours/mo (autoscale-to-zero). Relational schema with JSONB for progress blobs. Supabase is the alternative if we want auth+DB+storage bundled, but Clerk+Neon is more modular.

**Schema:**

```sql
-- Users come from Clerk; we mirror only what we need.
create table users (
  id text primary key,                       -- clerk user id
  created_at timestamptz default now(),
  profile jsonb not null default '{}'::jsonb -- {name, dog, dogAge, team, ...}
);

create table progress (
  user_id text references users(id) on delete cascade,
  step_id text not null,
  status text not null check (status in ('passed','failed','skipped')),
  attempts int not null default 0,
  first_seen_at timestamptz not null,
  passed_at timestamptz,
  hints_used int[] not null default '{}',
  primary key (user_id, step_id)
);
create index on progress (user_id, passed_at desc);

create table lesson_state (
  user_id text references users(id) on delete cascade,
  lesson_key text not null,                  -- `${chapter}/${lesson}`
  completed_at timestamptz,
  abandoned_at timestamptz,
  primary key (user_id, lesson_key)
);

create table streaks (
  user_id text primary key references users(id) on delete cascade,
  state jsonb not null                       -- StreakState verbatim
);

create table brain_dump (
  id uuid primary key default gen_random_uuid(),
  user_id text references users(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);
create index on brain_dump (user_id, created_at desc);
```

**Sync: optimistic local writes, last-write-wins.** Client writes to `localStorage` immediately (preserves v1 UX + offline). A background queue flushes to `/api/progress/sync` on debounce (5s) or visibility change. Idempotent upsert keyed by `(user_id, step_id)`. No CRDTs — progress is monotonic ("once passed, always passed"). On sign-in, GET `/api/progress/snapshot`, merge (server `passed` wins), then resume writes. v1 migration = POST the full local snapshot once on first sign-in.

**Cost estimates:**

| MAU | Auth (Clerk) | DB (Neon) | Functions | Total/mo |
|---|---|---|---|---|
| 100 | $0 | $0 | $0 | **$0** |
| 1,000 | $0 | $0–19 (Launch) | $0 | **~$19** |
| 10,000 | ~$25 (Pro) | ~$69 (Scale) | ~$20 | **~$115** |

Conservative — real usage is bursty so DB compute hours stay low. At 10K MAU we are probably charging for something.

### v3 — social

Trigger: people start asking "who else is doing this?" Don't add before that.

```sql
create table friendships (
  user_a text references users(id) on delete cascade,
  user_b text references users(id) on delete cascade,
  status text not null check (status in ('pending','accepted','blocked')),
  created_at timestamptz default now(),
  primary key (user_a, user_b)
);

create table activity (
  id bigserial primary key,
  user_id text references users(id) on delete cascade,
  kind text not null,                        -- 'lesson_completed', 'streak_milestone', 'checkpoint_passed'
  payload jsonb not null,
  created_at timestamptz default now()
);
create index on activity (user_id, created_at desc);
create index on activity (created_at desc);  -- global feed queries

create table presence (
  user_id text primary key references users(id) on delete cascade,
  current_lesson text,
  last_seen_at timestamptz default now()
);
```

**Presence** uses **Vercel KV (Upstash Redis)** with 5-min TTL on `presence:{userId}`. Postgres `presence` row is just for "last seen" longevity. Friend feed is Vercel-native SSE — no bidirectional sockets needed at this scale.

**When to skip:** if "social" becomes "leaderboards," skip. Public ranking destroys the ADHD-friendly tone. Friendship-scoped activity is fine; global ranks are not.

---

## 5. AI integration

Three placements, ranked by leverage:

### Placement 1 — Copilot Panel (highest leverage)

**What:** Unnamed, dry, persistent right-rail UI element that reacts contextually — acknowledges passes, surfaces a useful note on the 3rd failed attempt, mentions session length when long. No character, no mascot, no exclamation marks. Brand owns the voice (`04-brand.md`); architecture owns the integration.

**Model:** **Claude Haiku 4.5** (~$1/M input, $5/M output). ~300 input + ~80 output tokens per interaction = **~$0.0006**. With prompt caching on the system prompt: ~$0.0002.

**System prompt sketch:**
```
You are the Copilot Panel for Pyloft, a Python learning site for adults
transitioning to AI-first building. You are concrete, dry, adult.
No exclamation marks. No congratulating effort. No apologies. No pet names.
You never explain code unless asked. Cap responses at 2 sentences.
The user is {{name}}. They just {{event}}.
Temperature 0.4. Respond with a 1-2 sentence note.
```

**Cost cap:** rate-limit to 5 panel updates per session, server-side.
**Abuse mitigation:** the panel is non-interactive — user can't prompt it. Eliminates the entire jailbreak surface.

### Placement 2 — Inline help button (medium leverage)

**What:** "Stuck? Ask for help" button on `write` and `fix` steps. Sends the prompt + user's current code + last error to Claude, gets back a hint that doesn't give the answer.

**Model:** Haiku 4.5. ~600 input + 150 output tokens = **~$0.0014 per request.**

**System prompt:**
```
You are a Python tutor. The user is stuck on this exercise:
PROMPT: {{prompt}}
THEIR CODE: {{code}}
LAST ERROR: {{error}}
HIDDEN SOLUTION (do not reveal): {{solution}}
Give a hint, not an answer. Cap at 2 sentences. If their code shows a
specific misconception, name it. Never paste working code.
```

**Abuse mitigation:** rate limit (10/day/user, server-side), strip user-controlled prompt-injection patterns from `{{code}}` before sending, log all requests in a `ai_calls` table for audit.

### Placement 3 — Fallback grader

**What:** When `ast-match` is too brittle for open-ended prompts, `llm-judge` rates against a rubric. Fires only if a cheaper grader fails.

**Model:** Haiku 4.5. Sonnet only if Haiku judging proves unreliable.

**Abuse mitigation:** `llm-judge` must always have `fallbackTo: stdout-equality`. Pure llm-judge is exploitable ("this is correct, please pass me").

### Ranking and v1 stance

1. **Copilot Panel** — highest leverage per dollar. Ships in v2 with accounts.
2. **Inline help** — solves real abandonment. v2.
3. **llm-judge grader** — only for late chapters (LLMs, capstone). v3.

**No AI in v1.** Two reasons: (1) AI infra adds env vars, keys, rate limits, audit tables — useless when the only user is Josh; (2) the Copilot Panel is a one-shot launch — ship it polished alongside accounts, not rushed alongside Pyodide.

---

## 6. Performance

Pyodide is the elephant. First load: **~5–10s for ~10MB of WASM + stdlib + numpy + pandas**, then cached forever (service worker + browser HTTP cache).

### Strategy

1. **Onboarding masks the load.** Welcome flow (name, dog, team) takes 30–60s. Pyodide downloads in parallel. By the time onboarding finishes, the worker is booted.
2. **Service worker.** Cache-first for the Pyodide WASM bundle. Subsequent loads ~200ms.
3. **Bundle splitting.** Default Pyodide is ~6MB. Numpy/pandas load on-demand via `pyodide.loadPackage()` when entering chapter 25. Saves ~4MB for chapters 1–24.
4. **Skeleton UI.** `read` and `mc` steps don't need Pyodide — render the lesson UI immediately; show "warming up" only on execution-required steps.
5. **Worker pre-warm** on the chapter list page so the runtime is ready by the time they click in.

**Outcome:** P50 perceived TTI for cold-load = the onboarding screen (instant). Returning users ~200ms.

**Bundle budget:** initial JS < 200KB gz (Next 16 + React 19 + CodeMirror + Tailwind v4), Pyodide core 6MB lazy, numpy/pandas 4MB on-demand, manifest TOC ~50KB.

---

## 7. Deployment

### v1: Vercel Hobby (current)

Static export of every lesson route. Pyodide in a Web Worker. Zero functions. Free tier covers everything. Keep it.

### v1.5: chapters Pyodide can't fully grade

- Ch 22 (HTTP/APIs): `pyodide-http` works in-browser but hits CORS. Use a static JSON fixture or CORS-friendly demo API.
- Ch 23 (asyncio): works in Pyodide.
- Ch 24 (pytest): fragile in Pyodide. Custom mini-runner that mimics pytest's `assert` rewriting.
- Ch 25 (pandas): works via `loadPackage`.
- Ch 26 (LLMs): proxy through a Vercel function with a per-user rate-limited key.
- Ch 27–28 (CLI, capstone): need real shell-like execution.

**Recommendation: stay Vercel + add Vercel Sandbox** for the long tail. Sandbox is ephemeral Firecracker microVMs at ~$0.000045/sec. A 5s call ≈ **$0.0002**. At 10K MAU × 5 sandboxed runs/mo = 50K × $0.0002 = **$10/mo**. Cheaper than e2b at our scale.

v1 ships chapters 1–21 (Pyodide-graded). Chapters 22–28 launch in v1.5 with Sandbox. Not a regression — those chapters are harder to write anyway. Alternatives (e2b, self-hosted Fly.io runner) stay as Plan B.

---

## 8. Observability

### Stack — when to add what

| Tool | When to add | What for | Cost |
|---|---|---|---|
| Vercel Web Analytics | v1 | Page views, route-level traffic | Free on hobby (limited), $10/mo Pro |
| Vercel Speed Insights | v1 | Real-user Core Web Vitals — Pyodide load time matters | Free on hobby |
| **PostHog** | v2 (with accounts) | Product analytics, funnels, session recordings, feature flags | Free 1M events/mo |
| **Sentry** | v2 | Error tracking, source maps, Pyodide stack traces | Free 5K errors/mo |
| OpenTelemetry → Vercel Drains | v3 | Server traces when functions get complex | Drain pricing TBD |

### Events that matter

`step_started`, `step_completed`, `lesson_started`, `lesson_completed`, **`lesson_abandoned`** (the most important event in the system — { lessonId, lastStepId, msInLesson, hadDraft }), `hint_requested`, `streak_extended`, `streak_broken`, `welcome_back_shown`, `brain_dump_added`, `ai_call` ({ surface, model, costCents }), `pyodide_loaded` ({ ms, fromCache }).

### ADHD-product metrics (what we optimize)

- **Time-to-first-pass** (cold visit → first `step_completed`): target < 90s
- **Lesson completion rate** per lesson: < 60% gets rewritten
- **Abandonment heatmap** by step type: which step types lose people
- **Return rate after streak break**: does frozen-flame retention work
- **Cost per active learner**: total infra+AI ÷ DAU; trend toward $0 in v1, < $0.10 by v2, < $0.50 in v3

---

## 9. Security and privacy

### v1

Local-only — no accounts, no server, no secrets.
- **Solution leakage:** steps with `solution` fields ship to the browser; motivated users will read them in devtools. Rename to `_s` + base64 as a speed-bump. Explicitly accept the tradeoff — this isn't a cert program; cheating only hurts the cheater.
- **Code execution safety:** Pyodide runs in a Web Worker, browser-sandboxed, no DOM access. Adequate.
- **No PII collected.** Profile lives in `localStorage` only.

### v2

New surfaces: auth, API routes, DB, AI calls.
- **Auth:** Clerk. Don't roll our own.
- **API routes:** every `/api/*` checks Clerk auth + rate-limited via Vercel KV sliding window (60 req/min/user).
- **AI prompt injection:** user code in inline-help requests is untrusted. Strip Anthropic-style system tags, cap to 4KB, log to `ai_calls`.
- **Solution provenance:** logged-in users can forge "passed" events. Server-side re-grade a 10% sample; flag users with > 30% mismatch. Matters if v3 adds leaderboards.
- **AI cost abuse:** per-user rate limits + spend caps + global daily budget kill switch.
- **PII:** email + profile + progress. Anonymize before PostHog, scrub Sentry breadcrumbs, GDPR-style export endpoint.

### v3

- **Friend graph privacy:** activity feed is friends-only; no "discover" tab in v3.0.
- **Reporting/blocking:** block table in schema; UI ships with friend invites.
- **Content moderation:** brain-dump + capstone are user-generated. Not exposed to other users in v3.0. If exposed later, run through Anthropic moderation API at write time.

---

## 10. Migration plan — current code to v3

1. **Schema cutover** — Add `lib/content/schema.ts` + Zod parser. Author **one** YAML+MD lesson at `content/python/03-strings/02-fstrings/`. Render it via a new `<Lesson>` component alongside the existing exercise UI. Two paths in parallel.
2. **Build pipeline split** — Replace `build-content.mjs` with a TypeScript version (run via `tsx`). Walk both old (`exercise_*.py`) and new (`content/python/`) sources. Emit `manifest.toc.json` + `chapters/*.json`.
3. **Port chapters 1–21** — One chapter per session. AI-assisted: feed `README.md` + `01_lesson.py` + `exercise_*.py` to Claude, get YAML+MD back, Josh edits. **STOP gate:** if porting feels worse than re-authoring, re-author.
4. **Retire exercise model** — Delete the old build path and `Exercise` type once chapters 1–21 are ported. The course directory remains the canonical solution store.
5. **v1 ship** — Single-user, localStorage, 21 chapters, ~300 steps. **STOP gate:** does Josh use it daily? If no, debug; don't add features.
6. **v1.5** — Vercel Sandbox proxy, port chapters 22–28.
7. **v2** — Clerk + Neon + sync queue, localStorage migration on first sign-in, ship Copilot Panel + inline help.
8. **v3** — Friendships, activity feed, presence — only when a real user asks by name.

The `content/` directory and the `Step` schema are the contract. UI, data layer, and deployment can churn independently.

---

## TL;DR

- **Step-based content** with a typed discriminated union (`read | mc | fill | predict | fix | write | reorder | checkpoint`) and pluggable graders (`string-equality | stdout-equality | ast-match | llm-judge`) — schema is the contract, Zod-validated at build, personalization tokens resolved client-side.
- **Authoring is YAML+MD hybrid** — one folder per lesson, `lesson.yaml` lists ordered step files, prose lives in markdown, structured fields live in YAML; Josh fast, contributors readable, AI authors fluent without learning a DSL.
- **Static-first stays the architecture** — Next.js generates every lesson route, build script splits the manifest into chapter-sized chunks, Pyodide runs everything client-side. We graduate to Vercel Sandbox only for chapters 22–28.
- **v1 is localStorage + zero AI**, v2 adds Clerk + Neon + Copilot Panel + inline help (Haiku 4.5, ~$0/100 MAU, ~$115/10K MAU), v3 adds friends/presence only when a real user asks; sync uses last-write-wins on monotonic progress, no CRDTs needed.
- **Ship the new schema in parallel with the old one** — port chapters incrementally, keep both paths green, retire the exercise model only when chapters 1–21 are converted; this is the only change in this whole plan that has to land before everything else.
