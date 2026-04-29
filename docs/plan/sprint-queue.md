# Pyloft — Overnight Sprint Queue

> **Audience:** the autonomous build team running while Josh sleeps.
> **Source of truth:** `docs/plan/MASTER-PLAN.md` (read it before claiming a task).
> **Voice & visual rules:** `docs/plan/04-brand.md` §3, §4, §5, §10.
> **Schema contract:** `lib/content/schema.ts` (canonical Zod). Do not deviate.

---

## Hard rules (apply to every task)

1. **Never push to remote.** Local commits only. Josh reviews tomorrow.
2. **Never force-push, never amend, never `git reset --hard`.** Always create a new commit.
3. **`pnpm build` must stay green after every commit.** If it breaks: revert your commit, leave a `BLOCKED:` task in TaskList, move on.
4. **Voice is dry, adult, no exclamation marks, no congratulating effort, no pet names.** Brand §3, §4.
5. **Never edit files outside your owned area** (see Ownership below) without coordinating via SendMessage.
6. **Run `pnpm build` after every meaningful change.** Cheap. Catches regressions early.
7. **Commit after every task** with a tight subject line + `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer.
8. **If you finish your assigned slice, claim the next available unblocked task in ID order.**
9. **If you hit something the master plan doesn't answer, do NOT improvise on a load-bearing call. Leave a `DECISION_NEEDED:` task and move on.**
10. **Do not create accounts, payment integrations, AI calls, push notifications, or anything in the V2/V3 lanes.** V1 only.

---

## Ownership

- **`builder`** owns: `components/v2/**`, `app/learn/v2/**`, `app/onboarding/**`, `lib/content-v2.ts`, `lib/use-pyodide-v2.ts`, `lib/storage.ts` (extending only), `public/pyodide-worker-v2.js` (if needed).
- **`author`** owns: `content/python/**` (every chapter folder NOT yet authored).
- **`team-lead`** (me, between wake-ups): `docs/plan/**`, git commits/coordination, build verification, TaskList management.

The legacy `components/{CodeEditor,LessonView,OutputPane,LessonClient,...}.tsx` and the legacy `/learn/[chapter]/[lesson]` route are **frozen** until v2 is fully wired. Don't touch.

---

## The Queue (priority order, with dependencies)

### Phase A — Renderer foundation (builder)

- **A1.** `components/v2/PersistentIDE.tsx` — CodeMirror 6 editor + tabbed file system (per-step `files[]`) + Run button + output panel + per-step config (`readOnly`, `runnable`, `language`). Reuses existing `lib/use-pyodide.ts`. Editor never empties — keeps last code if next step has no `files`.
- **A2.** `components/v2/LessonShell.tsx` — three-pane shell: chapter sidebar (left, 240px) | prompt panel (center, ~480px) | PersistentIDE (right, flex). Wraps step renderers. Mobile: prompt panel stacks above IDE bottom-drawer.
- **A3.** `components/v2/StepRouter.tsx` — discriminated-union dispatcher: receives `Step`, returns the right `<XStepView>`. Falls through to a friendly "unknown step type" placeholder (defensive, not an error).
- **A4.** `lib/content-v2.ts` — server-only accessor for `lib/generated/v2/` manifest. Functions: `getV2Toc()`, `getV2Chapter(slug)`, `getV2Lesson(chapterSlug, lessonSlug)`, `getV2Step(...)`, `getNextV2Step(...)`.
- **A5.** Build the 3 simplest step views (`Read`, `MultipleChoice`, `FillBlank`) under `components/v2/steps/` — depends on A1, A2, A3, schema only. Every step view receives `{ step, profile, onAttempt }` and renders the prompt panel; IDE state comes from step.code/files via the shell.
- **A6.** `app/learn/v2/[chapter]/[lesson]/page.tsx` — lesson landing route. Redirects to `[stepIndex]/page.tsx` for index 0.
- **A7.** `app/learn/v2/[chapter]/[lesson]/[stepIndex]/page.tsx` — single-step page. Wraps in LessonShell. Uses `generateStaticParams()` for prerender.
- **A8.** Wire the legacy ChapterNav into v2 sidebar OR build a v2-specific sidebar that lists v2 chapters + lessons + steps with completion checkmarks. Read-and-render only — progress tracking is A14.

### Phase B — Remaining step views (builder, depends on A)

- **B1.** `components/v2/steps/PredictStepView.tsx` — user types prediction, Submit grades stdout-equality.
- **B2.** `components/v2/steps/FixBugStepView.tsx` — broken code editable in IDE, optional bug-line markers, Run & Submit.
- **B3.** `components/v2/steps/WriteStepView.tsx` — starter in IDE, visible tests on Run, hidden tests on Submit, optional `solution` reveal after `revealAfter` failures.
- **B4.** `components/v2/steps/ReorderStepView.tsx` — drag fragments into order; keyboard fallback per UX §8 (Space to grab, arrows to move, Enter to drop).
- **B5.** `components/v2/steps/CheckpointStepView.tsx` — same surface as Write but with `passThreshold` and "boss fight" framing.

### Phase C — Progress + onboarding (builder, depends on A4-A8)

- **C1.** Extend `lib/storage.ts` with v2 progress shape (per master plan + arch §4): `ProgressV2.steps[stepId]`, `lessons[chapter/lesson]`, `streak`, `lastVisitedV2`, `profile`. Migration-safe: add `schemaVersion: 2`. Don't break existing v1 data.
- **C2.** `components/v2/StepFooter.tsx` — XP bar + "Hint", "Skip", "Continue" (or "Next" / "Submit") + persistent ⌘↵ shortcut.
- **C3.** `app/onboarding/page.tsx` — five-screen flow per UX §3: welcome → goal-with-AI → level-check → personalization (skippable) → daily-goal. Saves UserProfile to localStorage. Lands at `/learn/v2/variables/naming-things/0`.
- **C4.** Daily-goal floor mechanic — small dial in v2 layout header. UX §5: floor not target, missed never punishes, exceeded banks ember.

### Phase D — Lesson authoring (author, parallel from start of night)

Each lesson: 8–12 steps, 5–8 minutes, AI-builder voice (Brand §3 with all redlines), warmup→build→check phases, at least 2 `fix-bug` steps, max 1–2 `write-code`, all gradeable via Pyodide stdout-equality or ast-match. Author validates each lesson via `pnpm build:content` (which runs `build-content-v2.mjs` and Zod-validates).

- **D1.** `02-functions/01-return-values/` — "the most-hallucinated thing AI does." Cover: `def`, parameters, `return`, calling, where AI silently forgets `return` and the function returns `None`. 8–10 steps.
- **D2.** `03-lists-and-dicts/01-the-bones-of-apis/` — JSON shapes, indexing, `.append`, `dict[key]`, `KeyError` reading. 8–10 steps. Frame as "every API response you've copied from ChatGPT looks like this."
- **D3.** `04-loops/01-predict-the-output/` — `for` over a list, `for ... in range()`, `for ... in dict.items()`. Heavy on `predict-output` and `fix-bug`. 10 steps.
- **D4.** `05-conditionals/01-truthiness-bugs/` — `if`, truthiness, `==` vs `is`, why `if x` is sometimes wrong. 8 steps. Frame: "where AI silently bugs."
- **D5.** `06-tracebacks/01-reading-the-stack/` — anatomy of a Python traceback, common error types (NameError, TypeError, KeyError, IndexError, AttributeError). 8 steps with curated broken snippets. Frame: "Cursor wrote this and crashed. Where did it go wrong?"
- **D6.** `07-mutation-and-state/01-why-it-breaks/` — list mutation, function args mutating callers, the dict-as-default-arg gotcha. 8 steps. Frame: "this is why your code mysteriously breaks."
- **D7.** `08-modules-and-imports/01-why-venv-hates-you/` — `import`, `from x import y`, `pip`, virtual envs (conceptual — not interactive in Pyodide), why your venv doesn't see the package. 8 steps. Heavily prose-led; ≤2 `write-code` steps.

### Phase E — Polish + verification (builder, depends on B + C)

- **E1.** `aria-live` announcements for grader results + reduced-motion fallbacks per UX §8.
- **E2.** Sound system (defaulted off; settings toggle in profile). Lazy-loaded webm/mp3 pairs ≤ 2KB each.
- **E3.** Visual QA pass — screenshots of every step type via `gstack browse`, save to `/tmp/pyloft-v2-*.png`, compare against `MASTER-PLAN.md` voice/visual locks.
- **E4.** End-to-end smoke: complete lesson 1 in v2 mode in browser, all 8 steps pass, XP totals correct, streak +1.

---

## When the queue is empty

Stop. Do not add new tasks. Do not start V2/V3 work. Leave a `STOP_GATE_HIT:` task with a one-line summary of what shipped and any open questions.

The morning is Josh's. Don't pre-empt him.
