// scripts/build-content-v2.mjs
//
// Walks content/python/{chapter}/{lesson}/ — a YAML+MD authoring tree per
// docs/plan/03-architecture.md §2 — validates every step against the Zod
// schema in lib/content/schema.ts, and emits split manifests under
// lib/generated/v2/:
//
//   lib/generated/v2/manifest.toc.json    — chapter list, eager-loaded
//   lib/generated/v2/chapters/{slug}.json — one per chapter, on-demand
//
// Lesson folder layout (example):
//
//   content/python/01-variables/01-naming-things/
//     lesson.yaml
//     01-intro.read.md
//     02-which-is-valid.mc.yaml
//     03-fill-the-name.fill.yaml
//     04-predict-this.predict.yaml
//     05-fix-the-typo.fix.yaml
//     06-write-greeting.write.yaml
//     07-reorder.reorder.yaml
//     08-checkpoint.checkpoint.yaml
//
// File naming: `{order}-{slug}.{type}.{md|yaml}`. The build picks the type
// from the second extension; .read steps use markdown body, all others use
// YAML.

import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join, resolve, basename } from "node:path";
import { existsSync } from "node:fs";
import matter from "gray-matter";
import YAML from "yaml";

// We re-derive the schema in this Node script because importing TS directly
// requires a build step. Zod is JS-native; we mirror the shapes minimally
// using zod itself, imported from node_modules.
import { z } from "zod";

const REPO = resolve(new URL("..", import.meta.url).pathname);
const CONTENT = join(REPO, "content", "python");
const OUT_DIR = join(REPO, "lib", "generated", "v2");

// ──────────────────────────────────────────────────────────────────────────
// Minimal Zod mirror — keep in sync with lib/content/schema.ts
// (We avoid a full TS build step; this is a deliberate trade.)
// ──────────────────────────────────────────────────────────────────────────

const Hint = z.object({
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  body: z.string(),
  cost: z.number().int().min(0).default(0),
});

const FileTab = z.object({
  name: z.string(),
  body: z.string(),
  readOnly: z.boolean().default(false),
  language: z.enum(["python", "text", "json"]).default("python"),
});

const StringEqualityGrader = z.object({
  kind: z.literal("string-equality"),
  expected: z.union([z.string(), z.array(z.string())]),
  normalize: z.enum(["trim", "collapse-ws", "lower", "none"]).default("trim"),
});

const StdoutEqualityGrader = z.object({
  kind: z.literal("stdout-equality"),
  expected: z.string(),
  normalize: z.enum(["trim", "collapse-trailing-newline", "none"]).default("collapse-trailing-newline"),
  stdin: z.string().optional(),
});

const AstRule = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("calls"), name: z.string() }),
  z.object({ kind: z.literal("uses-loop") }),
  z.object({ kind: z.literal("defines-function"), name: z.string().optional(), minArgs: z.number().int().nonnegative().optional() }),
  z.object({ kind: z.literal("uses-import"), module: z.string() }),
  z.object({ kind: z.literal("no-globals") }),
]);

const AstMatchGrader = z.object({
  kind: z.literal("ast-match"),
  must: z.array(AstRule),
  mustNot: z.array(AstRule).default([]),
});

const Grader = z.union([StringEqualityGrader, StdoutEqualityGrader, AstMatchGrader]);

const StepBaseFields = {
  id: z.string().optional(), // build script supplies if missing
  xp: z.number().int().nonnegative().default(2),
  hint: z.array(Hint).default([]),
  personalize: z.boolean().default(false),
  phase: z.enum(["warmup", "build", "check"]).default("build"),
  estSeconds: z.number().int().min(10).max(300).default(60),
  concept: z.string().optional(),
  files: z.array(FileTab).optional(),
};

const ReadStep = z.object({
  type: z.literal("read"),
  ...StepBaseFields,
  body: z.string(),
  cta: z.string().default("Got it"),
  code: z.string().optional(),
  runnable: z.boolean().default(true),
});

const MultipleChoiceStep = z.object({
  type: z.literal("mc"),
  ...StepBaseFields,
  prompt: z.string(),
  options: z.array(z.object({ id: z.string(), label: z.string(), explain: z.string().optional() })),
  answerIds: z.array(z.string()).min(1),
  shuffle: z.boolean().default(false),
  code: z.string().optional(),
  runnable: z.boolean().default(true),
});

const FillBlankStep = z.object({
  type: z.literal("fill"),
  ...StepBaseFields,
  prompt: z.string(),
  blanks: z.array(z.object({
    id: z.string(),
    accept: z.array(z.string()).min(1),
    caseSensitive: z.boolean().default(false),
    normalize: z.enum(["trim", "collapse-ws", "none"]).default("trim"),
  })).min(1),
});

const PredictStep = z.object({
  type: z.literal("predict"),
  ...StepBaseFields,
  code: z.string(),
  prompt: z.string(),
  grader: StdoutEqualityGrader,
});

const FixBugStep = z.object({
  type: z.literal("fix"),
  ...StepBaseFields,
  brokenCode: z.string(),
  prompt: z.string(),
  grader: Grader,
  bugLines: z.array(z.number().int().positive()).default([]),
  revealAfter: z.number().int().min(1).optional(),
});

const WriteStep = z.object({
  type: z.literal("write"),
  ...StepBaseFields,
  prompt: z.string(),
  starter: z.string().default(""),
  grader: Grader,
  solution: z.string().optional(),
  stdin: z.string().optional(),
  hiddenTests: z.array(StdoutEqualityGrader).default([]),
});

const ReorderStep = z.object({
  type: z.literal("reorder"),
  ...StepBaseFields,
  prompt: z.string(),
  fragments: z.array(z.object({ id: z.string(), code: z.string() })).min(2),
  distractors: z.array(z.object({ id: z.string(), code: z.string() })).default([]),
  correctOrder: z.array(z.string()).min(2),
});

const CheckpointStep = z.object({
  type: z.literal("checkpoint"),
  ...StepBaseFields,
  prompt: z.string(),
  starter: z.string().default(""),
  grader: Grader,
  solution: z.string(),
  passThreshold: z.number().min(0).max(1).default(0.66),
});

const Step = z.discriminatedUnion("type", [
  ReadStep, MultipleChoiceStep, FillBlankStep, PredictStep,
  FixBugStep, WriteStep, ReorderStep, CheckpointStep,
]);

const LessonYaml = z.object({
  slug: z.string(),
  title: z.string(),
  estMinutes: z.number().int().min(1).max(30).default(6),
  prerequisites: z.array(z.string()).default([]),
  order: z.array(z.string()).min(1),
});

const ChapterYaml = z.object({
  number: z.number().int().positive(),
  slug: z.string(),
  title: z.string(),
  blurb: z.string().default(""),
  lessons: z.array(z.string()).min(1), // ordered lesson folder names
});

// ──────────────────────────────────────────────────────────────────────────
// Loaders
// ──────────────────────────────────────────────────────────────────────────

/** Pick the step type out of `01-intro.read.md` → "read". */
function stepTypeFromFilename(filename) {
  const m = filename.match(/^[^.]+\.(\w+)\.(md|yaml|yml)$/);
  return m ? m[1] : null;
}

async function loadStep(lessonDir, filename, stepIndex, lessonId) {
  const fullPath = join(lessonDir, filename);
  const ext = filename.endsWith(".md") ? "md" : "yaml";
  const stepType = stepTypeFromFilename(filename);
  if (!stepType) throw new Error(`Cannot infer step type from "${filename}"`);

  let raw;
  if (ext === "md") {
    // markdown step files use frontmatter for fields, body for `body`
    const text = await readFile(fullPath, "utf8");
    const fm = matter(text);
    raw = { type: stepType, ...fm.data, body: fm.content.trim() };
  } else {
    const text = await readFile(fullPath, "utf8");
    raw = { type: stepType, ...YAML.parse(text) };
  }

  // Default the id from the lesson + filename if missing.
  if (!raw.id) {
    const slug = basename(filename).replace(/\.\w+\.(md|yaml|yml)$/, "");
    raw.id = `${lessonId}/s${String(stepIndex + 1).padStart(2, "0")}-${slug}`;
  }

  // Default the phase by position: first 25% warmup, last 15% check, rest build.
  // Build pipeline supplies this so authors don't need to. Authors can override.
  // (We do final phase fixup at the lesson-level after all steps are loaded.)

  const result = Step.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `    ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Schema error in ${filename}:\n${issues}\n  Raw:\n${JSON.stringify(raw, null, 2).split("\n").map((l) => "    " + l).join("\n")}`,
    );
  }
  return result.data;
}

async function loadLesson(chapterDir, lessonFolder, chapterSlug) {
  const lessonDir = join(chapterDir, lessonFolder);
  const lessonYamlPath = join(lessonDir, "lesson.yaml");
  if (!existsSync(lessonYamlPath)) {
    throw new Error(`Missing lesson.yaml in ${lessonDir}`);
  }
  const lessonMeta = LessonYaml.parse(YAML.parse(await readFile(lessonYamlPath, "utf8")));
  const lessonId = `${chapterSlug}/${lessonMeta.slug}`;

  const steps = [];
  for (let i = 0; i < lessonMeta.order.length; i++) {
    const filename = lessonMeta.order[i];
    const step = await loadStep(lessonDir, filename, i, lessonId);
    steps.push(step);
  }

  // Auto-assign phases by position, but never overwrite an explicit author choice.
  // Heuristic: first 25% warmup, last 15% check, rest build.
  const n = steps.length;
  const warmupCutoff = Math.max(1, Math.floor(n * 0.25));
  const checkCutoff = Math.max(n - Math.max(1, Math.floor(n * 0.15)), warmupCutoff + 1);
  for (let i = 0; i < n; i++) {
    if (steps[i].phase === "build") {
      if (i < warmupCutoff) steps[i].phase = "warmup";
      else if (i >= checkCutoff) steps[i].phase = "check";
    }
  }

  const xpTotal = steps.reduce((acc, s) => acc + s.xp, 0);

  return {
    slug: lessonMeta.slug,
    title: lessonMeta.title,
    estMinutes: lessonMeta.estMinutes,
    prerequisites: lessonMeta.prerequisites,
    steps,
    xpTotal,
  };
}

async function loadChapter(chapterFolder) {
  const chapterDir = join(CONTENT, chapterFolder);
  const chapterYamlPath = join(chapterDir, "chapter.yaml");
  if (!existsSync(chapterYamlPath)) {
    // Authors scaffold lesson folders before writing chapter.yaml. Skip until
    // they declare it; downstream code already handles "chapter not in TOC."
    return null;
  }
  const chapterMeta = ChapterYaml.parse(
    YAML.parse(await readFile(chapterYamlPath, "utf8")),
  );

  const lessons = [];
  for (const lessonFolder of chapterMeta.lessons) {
    const lesson = await loadLesson(chapterDir, lessonFolder, chapterMeta.slug);
    lessons.push(lesson);
  }

  const xpTotal = lessons.reduce((acc, l) => acc + l.xpTotal, 0);

  return {
    number: chapterMeta.number,
    slug: chapterMeta.slug,
    title: chapterMeta.title,
    blurb: chapterMeta.blurb,
    lessons,
    xpTotal,
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(CONTENT)) {
    console.log(`No v2 content at ${CONTENT} yet — skipping (this is fine for early Sprint 1).`);
    return;
  }

  console.log(`Building v2 content from ${CONTENT}...`);

  const entries = await readdir(CONTENT);
  const folders = [];
  for (const e of entries) {
    const s = await stat(join(CONTENT, e));
    if (s.isDirectory() && /^\d+-/.test(e)) folders.push(e);
  }
  folders.sort();

  if (folders.length === 0) {
    console.log("No chapter folders found — exiting.");
    return;
  }

  const chapters = [];
  for (const folder of folders) {
    process.stdout.write(`  ${folder}... `);
    const chapter = await loadChapter(folder);
    if (!chapter) {
      console.log("⏭  no chapter.yaml yet (authoring in progress)");
      continue;
    }
    chapters.push(chapter);
    console.log(`✓ (${chapter.lessons.length} lessons, ${chapter.lessons.reduce((a, l) => a + l.steps.length, 0)} steps, ${chapter.xpTotal} XP)`);
  }

  await mkdir(join(OUT_DIR, "chapters"), { recursive: true });

  // Write per-chapter detail files
  for (const c of chapters) {
    await writeFile(
      join(OUT_DIR, "chapters", `${c.slug}.json`),
      JSON.stringify(c, null, 2),
      "utf8",
    );
  }

  // Write the eager-loaded TOC
  const toc = {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    chapters: chapters.map((c) => ({
      number: c.number,
      slug: c.slug,
      title: c.title,
      blurb: c.blurb,
      lessonCount: c.lessons.length,
      stepCount: c.lessons.reduce((acc, l) => acc + l.steps.length, 0),
      xpTotal: c.xpTotal,
    })),
  };
  await writeFile(
    join(OUT_DIR, "manifest.toc.json"),
    JSON.stringify(toc, null, 2),
    "utf8",
  );

  console.log(`\nWrote ${chapters.length} chapter(s) → ${OUT_DIR}`);
}

main().catch((err) => {
  console.error("\n✗", err.message);
  process.exit(1);
});
