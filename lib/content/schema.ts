// lib/content/schema.ts
//
// Canonical content schema for Pyloft. This is the contract between authors
// (YAML+MD files under content/python/) and the runtime (LessonShell + step
// renderers).
//
// Source: docs/plan/03-architecture.md §1 + docs/plan/02-ux.md §1.2
// (persistent IDE deltas: optional code/runnable/files on read & mc steps).
//
// Every shape has a Zod schema; the build script (scripts/build-content-v2.mjs)
// validates every authored step before emitting the manifest. Type-checked
// runtime + author-time errors with line numbers.

import { z } from "zod";

// ──────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────

const NormalizeStdout = z
  .enum(["trim", "collapse-trailing-newline", "none"])
  .default("collapse-trailing-newline");

const NormalizeString = z
  .enum(["trim", "collapse-ws", "lower", "none"])
  .default("trim");

// ──────────────────────────────────────────────────────────────────────────
// Files (IDE tabs)
// ──────────────────────────────────────────────────────────────────────────

export const FileTab = z.object({
  name: z.string(),                    // e.g. "main.py", "pets.txt"
  body: z.string(),
  readOnly: z.boolean().default(false),
  language: z.enum(["python", "text", "json"]).default("python"),
});
export type FileTab = z.infer<typeof FileTab>;

// ──────────────────────────────────────────────────────────────────────────
// Hint
// ──────────────────────────────────────────────────────────────────────────

export const Hint = z.object({
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  body: z.string(),
  cost: z.number().int().min(0).default(0),
});
export type Hint = z.infer<typeof Hint>;

// ──────────────────────────────────────────────────────────────────────────
// Graders — pluggable, recursive (llm-judge.fallbackTo can be any other grader)
// ──────────────────────────────────────────────────────────────────────────

const StringEqualityGrader = z.object({
  kind: z.literal("string-equality"),
  expected: z.union([z.string(), z.array(z.string())]),
  normalize: NormalizeString,
});

const StdoutEqualityGrader = z.object({
  kind: z.literal("stdout-equality"),
  expected: z.string(),
  normalize: NormalizeStdout,
  stdin: z.string().optional(),
});

const AstRule = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("calls"), name: z.string() }),
  z.object({ kind: z.literal("uses-loop") }),
  z.object({
    kind: z.literal("defines-function"),
    name: z.string().optional(),
    minArgs: z.number().int().nonnegative().optional(),
  }),
  z.object({ kind: z.literal("uses-import"), module: z.string() }),
  z.object({ kind: z.literal("no-globals") }),
]);

const AstMatchGrader = z.object({
  kind: z.literal("ast-match"),
  must: z.array(AstRule),
  mustNot: z.array(AstRule).default([]),
});

// LLM-judge has a fallback grader; Zod handles the recursion via z.lazy.
const LlmJudgeGrader: z.ZodType<{
  kind: "llm-judge";
  rubric: string;
  fallbackTo?: Grader;
  maxScore: number;
}> = z.lazy(() =>
  z.object({
    kind: z.literal("llm-judge"),
    rubric: z.string(),
    fallbackTo: Grader.optional(),
    maxScore: z.number().min(0).max(1),
  }),
);

export const Grader = z.union([
  StringEqualityGrader,
  StdoutEqualityGrader,
  AstMatchGrader,
  LlmJudgeGrader,
]);
export type Grader = z.infer<typeof Grader>;

// ──────────────────────────────────────────────────────────────────────────
// StepBase — fields every step gets
// ──────────────────────────────────────────────────────────────────────────

const StepBaseFields = {
  id: z.string(),                      // "ch01-variables/l01-naming/s03"
  xp: z.number().int().nonnegative().default(2),
  hint: z.array(Hint).default([]),
  personalize: z.boolean().default(false),
  // UX-derived metadata used by the renderer for sequencing + daily-goal math.
  // The build pipeline supplies defaults, so authors don't need to write these.
  phase: z.enum(["warmup", "build", "check"]).default("build"),
  estSeconds: z.number().int().min(10).max(300).default(60),
  concept: z.string().optional(),
  // IDE files attached to this step (per UX §1.2 — persistent IDE).
  // If omitted, the renderer carries the previous step's files forward
  // ("editor never empties between steps").
  files: z.array(FileTab).optional(),
};

// ──────────────────────────────────────────────────────────────────────────
// Step types — 8-member discriminated union
// ──────────────────────────────────────────────────────────────────────────

export const ReadStep = z.object({
  type: z.literal("read"),
  ...StepBaseFields,
  body: z.string(),                    // markdown
  cta: z.string().default("Got it"),
  // UX delta: optional code shown in the IDE pane (read-only) so even read
  // steps have a populated, runnable editor.
  code: z.string().optional(),
  runnable: z.boolean().default(true),
});
export type ReadStep = z.infer<typeof ReadStep>;

export const MultipleChoiceStep = z.object({
  type: z.literal("mc"),
  ...StepBaseFields,
  prompt: z.string(),
  options: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      explain: z.string().optional(),  // shown after wrong pick
    }),
  ),
  answerIds: z.array(z.string()).min(1),
  shuffle: z.boolean().default(false),
  // Same UX delta as ReadStep.
  code: z.string().optional(),
  runnable: z.boolean().default(true),
});
export type MultipleChoiceStep = z.infer<typeof MultipleChoiceStep>;

export const FillBlankStep = z.object({
  type: z.literal("fill"),
  ...StepBaseFields,
  prompt: z.string(),                  // contains one or more `___` placeholders
  code: z.string().optional(),         // shown read-only in the IDE; if absent, IDE inherits previous step
  blanks: z
    .array(
      z.object({
        id: z.string(),
        accept: z.array(z.string()).min(1),
        caseSensitive: z.boolean().default(false),
        normalize: z.enum(["trim", "collapse-ws", "none"]).default("trim"),
      }),
    )
    .min(1),
});
export type FillBlankStep = z.infer<typeof FillBlankStep>;

export const PredictStep = z.object({
  type: z.literal("predict"),
  ...StepBaseFields,
  code: z.string(),                    // shown read-only in the IDE
  prompt: z.string(),                  // "What does this print?"
  grader: StdoutEqualityGrader,
});
export type PredictStep = z.infer<typeof PredictStep>;

export const FixBugStep = z.object({
  type: z.literal("fix"),
  ...StepBaseFields,
  brokenCode: z.string(),              // editable
  prompt: z.string(),
  grader: Grader,
  bugLines: z.array(z.number().int().positive()).default([]),
  revealAfter: z.number().int().min(1).optional(),
});
export type FixBugStep = z.infer<typeof FixBugStep>;

export const WriteStep = z.object({
  type: z.literal("write"),
  ...StepBaseFields,
  prompt: z.string(),
  starter: z.string().default(""),
  grader: Grader,
  solution: z.string().optional(),
  stdin: z.string().optional(),
  // Hidden tests run on Submit (per boot.dev's Run-vs-Submit pattern).
  hiddenTests: z.array(StdoutEqualityGrader).default([]),
});
export type WriteStep = z.infer<typeof WriteStep>;

export const ReorderStep = z.object({
  type: z.literal("reorder"),
  ...StepBaseFields,
  prompt: z.string(),
  fragments: z
    .array(z.object({ id: z.string(), code: z.string() }))
    .min(2),
  distractors: z
    .array(z.object({ id: z.string(), code: z.string() }))
    .default([]),
  correctOrder: z.array(z.string()).min(2),
});
export type ReorderStep = z.infer<typeof ReorderStep>;

export const CheckpointStep = z.object({
  type: z.literal("checkpoint"),
  ...StepBaseFields,
  prompt: z.string(),
  starter: z.string().default(""),
  grader: Grader,
  solution: z.string(),
  passThreshold: z.number().min(0).max(1).default(0.66),
});
export type CheckpointStep = z.infer<typeof CheckpointStep>;

export const Step = z.discriminatedUnion("type", [
  ReadStep,
  MultipleChoiceStep,
  FillBlankStep,
  PredictStep,
  FixBugStep,
  WriteStep,
  ReorderStep,
  CheckpointStep,
]);
export type Step = z.infer<typeof Step>;

// ──────────────────────────────────────────────────────────────────────────
// Lesson · Chapter · Course
// ──────────────────────────────────────────────────────────────────────────

export const Lesson = z.object({
  slug: z.string(),
  title: z.string(),
  estMinutes: z.number().int().min(1).max(30).default(6),
  prerequisites: z.array(z.string()).default([]),
  steps: z.array(Step).min(1),
  xpTotal: z.number().int().nonnegative(),  // computed at build
});
export type Lesson = z.infer<typeof Lesson>;

export const Chapter = z.object({
  number: z.number().int().positive(),
  slug: z.string(),
  title: z.string(),
  blurb: z.string().default(""),
  /**
   * Long-form chapter narrative shown on `/learn/v2/[chapter]` — the
   * "what you'll learn, why it matters, where it fits" framing the
   * V1 chapter README used to provide. Optional; if absent the route
   * renders just the lesson list. Authored as `overview.md` in the
   * chapter folder; build script lifts the body into this field.
   */
  overview: z.string().default(""),
  lessons: z.array(Lesson).min(1),
  xpTotal: z.number().int().nonnegative(),
});
export type Chapter = z.infer<typeof Chapter>;

export const Course = z.object({
  slug: z.literal("python"),
  version: z.string(),
  title: z.string(),
  chapters: z.array(Chapter),
  generatedAt: z.string(),
});
export type Course = z.infer<typeof Course>;

// ──────────────────────────────────────────────────────────────────────────
// Manifest split — TOC eager-loaded, per-chapter on demand
// ──────────────────────────────────────────────────────────────────────────

export const ChapterTocEntry = z.object({
  number: z.number().int().positive(),
  slug: z.string(),
  title: z.string(),
  blurb: z.string(),
  lessonCount: z.number().int().nonnegative(),
  stepCount: z.number().int().nonnegative(),
  xpTotal: z.number().int().nonnegative(),
});

export const ManifestToc = z.object({
  version: z.string(),
  generatedAt: z.string(),
  chapters: z.array(ChapterTocEntry),
});
export type ManifestToc = z.infer<typeof ManifestToc>;

// ──────────────────────────────────────────────────────────────────────────
// Runtime: StepAttempt — uniform shape across all step types
// ──────────────────────────────────────────────────────────────────────────

export const StepAttempt = z.object({
  stepId: z.string(),
  startedAt: z.string(),
  submittedAt: z.string(),
  correct: z.boolean(),
  hintsUsed: z.number().int().nonnegative().default(0),
  // payload is step-type-specific — keep it loose at the schema level;
  // step renderers know their own shape.
  payload: z.unknown(),
});
export type StepAttempt = z.infer<typeof StepAttempt>;

// ──────────────────────────────────────────────────────────────────────────
// User profile (collected at onboarding) — drives personalization tokens
// ──────────────────────────────────────────────────────────────────────────

export const UserProfile = z.object({
  name: z.string().default(""),
  goal: z.enum(["side-project", "team-tools", "startup", "curious"]).default("curious"),
  level: z
    .enum(["absolute-beginner", "some-exposure", "rusty"])
    .default("absolute-beginner"),
  flavor: z
    .object({
      pet: z.string().optional(),
      team: z.string().optional(),
      city: z.string().optional(),
    })
    .default({}),
  dailyGoalMinutes: z.union([z.literal(5), z.literal(10), z.literal(20), z.literal(40)]).default(10),
  reducedMotion: z.boolean().default(false),
  soundEnabled: z.boolean().default(false),
  createdAt: z.string().default(() => new Date().toISOString()),
});
export type UserProfile = z.infer<typeof UserProfile>;

// ──────────────────────────────────────────────────────────────────────────
// Personalization token interpolation
// ──────────────────────────────────────────────────────────────────────────

const TOKEN_DEFAULTS: Record<string, string> = {
  "user.name": "friend",
  "user.pet": "your pet",
  "user.team": "your team",
  "user.city": "your city",
};

export function interpolate(text: string, profile: UserProfile): string {
  return text.replace(/\{\{\s*(user\.[a-zA-Z]+)\s*\}\}/g, (_, key: string) => {
    if (key === "user.name" && profile.name) return profile.name;
    if (key === "user.pet" && profile.flavor.pet) return profile.flavor.pet;
    if (key === "user.team" && profile.flavor.team) return profile.flavor.team;
    if (key === "user.city" && profile.flavor.city) return profile.flavor.city;
    return TOKEN_DEFAULTS[key] ?? "";
  });
}
