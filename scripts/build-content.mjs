// scripts/build-content.mjs
// Reads the canonical course at $COURSE_PATH (defaults to ../python-course-2026
// relative to the repo), runs every solutions/exercise_*.py to capture expected
// stdout, and emits lib/generated/manifest.json — the only thing the app reads
// at runtime. We deliberately do NOT symlink the course into the repo, because
// Turbopack/Tailwind walks symlinks and panics when they leave the project root.

import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join, resolve, isAbsolute } from "node:path";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";

const REPO = resolve(new URL("..", import.meta.url).pathname);
const CONTENT = (() => {
  const fromEnv = process.env.COURSE_PATH;
  if (fromEnv) {
    if (fromEnv.startsWith("~")) return join(homedir(), fromEnv.slice(1));
    return isAbsolute(fromEnv) ? fromEnv : resolve(REPO, fromEnv);
  }
  return join(homedir(), "python-course-2026");
})();
const OUT_DIR = join(REPO, "lib", "generated");
const OUT_FILE = join(OUT_DIR, "manifest.json");

if (!existsSync(CONTENT)) {
  // Cloud builds (Vercel, etc.) won't have the v1 course tree at
  // ~/python-course-2026 — that's the local-only authoring workspace.
  // v1 is the legacy 28-chapter foldout on the home page; v2 is the
  // canonical experience. If the source isn't available, write a stub
  // manifest so `lib/content.ts`'s static import resolves and
  // `getChapters()` returns []. Home page just renders an empty legacy
  // section instead of breaking the build.
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify({ chapters: [] }, null, 2));
  console.warn(
    `Course content not found at ${CONTENT} — wrote empty manifest. ` +
      `Set COURSE_PATH if you want the legacy v1 course to render.`,
  );
  process.exit(0);
}

const PY = process.env.PYTHON_BIN || "python3";

/** Slugify a chapter folder name like "01-getting-started" → "getting-started" + number 1 */
function parseChapterDir(name) {
  const m = name.match(/^(\d+)-(.+)$/);
  if (!m) return null;
  return { number: parseInt(m[1], 10), slug: m[2], folder: name };
}

/** Pull a "GOAL" / "WHAT TO DO" snippet out of an exercise file's docstring. */
function extractExerciseMeta(src) {
  const docMatch = src.match(/^\s*"""([\s\S]*?)"""/);
  const doc = docMatch ? docMatch[1].trim() : "";

  const titleMatch = doc.match(/^Exercise\s+[\d.]+\s*[—\-:]\s*(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : "";

  const goalMatch = doc.match(/GOAL\s*\n\s*([\s\S]*?)(?=\n\s*(?:WHAT TO DO|HINT|HINTS|RUN|RULES|THINK ABOUT IT|WHEN YOU'?RE DONE)\b|$)/);
  const goal = goalMatch ? goalMatch[1].trim() : "";

  return { title, doc, goal };
}

/** Run a Python file and capture its stdout. Returns { ok, stdout, stderr }. */
function runPython(file, input = "") {
  const res = spawnSync(PY, [file], {
    input,
    encoding: "utf8",
    timeout: 10_000,
  });
  return {
    ok: res.status === 0,
    stdout: res.stdout || "",
    stderr: res.stderr || "",
    status: res.status,
  };
}

async function loadChapter(folder) {
  const dir = join(CONTENT, folder);
  const meta = parseChapterDir(folder);
  if (!meta) return null;

  const readmePath = join(dir, "README.md");
  const readme = existsSync(readmePath) ? await readFile(readmePath, "utf8") : "";

  const checkpointPath = join(dir, "CHECKPOINT.md");
  const checkpoint = existsSync(checkpointPath)
    ? await readFile(checkpointPath, "utf8")
    : "";

  // Title = first H1 in README, fallback to slug
  const titleMatch = readme.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : meta.slug;

  // Lesson example (01_lesson.py) is the runnable lesson code
  const lessonPath = join(dir, "01_lesson.py");
  const lessonCode = existsSync(lessonPath) ? await readFile(lessonPath, "utf8") : "";

  // Exercises 1..5
  const exercises = [];
  for (let i = 1; i <= 5; i++) {
    const exPath = join(dir, `exercise_${i}.py`);
    const solPath = join(dir, "solutions", `exercise_${i}.py`);
    if (!existsSync(exPath)) continue;

    const starter = await readFile(exPath, "utf8");
    const m = extractExerciseMeta(starter);

    let expectedStdout = null;
    let solutionExists = existsSync(solPath);
    if (solutionExists) {
      const solRes = runPython(solPath);
      if (solRes.ok) {
        expectedStdout = solRes.stdout;
      } else {
        console.warn(
          `  solution failed for ${folder}/exercise_${i}: ${solRes.stderr.slice(0, 120)}`,
        );
      }
    }

    exercises.push({
      number: i,
      slug: `exercise-${i}`,
      title: m.title || `Exercise ${meta.number}.${i}`,
      docstring: m.doc,
      goal: m.goal,
      starter,
      expectedStdout,
      hasSolution: solutionExists,
    });
  }

  return {
    number: meta.number,
    slug: meta.slug,
    folder,
    title,
    readme,
    lessonCode,
    checkpoint,
    exercises,
  };
}

async function main() {
  console.log(`Building content from ${CONTENT}...`);
  const entries = await readdir(CONTENT);
  const folders = [];
  for (const e of entries) {
    const s = await stat(join(CONTENT, e));
    if (s.isDirectory() && /^\d+-/.test(e)) folders.push(e);
  }
  folders.sort();

  const chapters = [];
  for (const folder of folders) {
    process.stdout.write(`  ${folder}... `);
    const ch = await loadChapter(folder);
    if (ch) {
      chapters.push(ch);
      console.log(`✓ (${ch.exercises.length} exercises, ${ch.exercises.filter((e) => e.expectedStdout != null).length} graded)`);
    } else {
      console.log("skipped");
    }
  }

  await mkdir(OUT_DIR, { recursive: true });
  const manifest = {
    generatedAt: new Date().toISOString(),
    chapters,
  };
  await writeFile(OUT_FILE, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`\nWrote ${chapters.length} chapters → ${OUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
