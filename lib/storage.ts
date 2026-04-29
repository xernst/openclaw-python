"use client";
import type { GlobalProgress, LessonProgress, StreakState } from "./types";
import type { StepAttempt, UserProfile } from "./content/schema";

const KEY = "code-killa:progress:v1";
const KEY_V2 = "code-killa:progress:v2";

const FRESH_STREAK: StreakState = {
  lastActivityDate: "",
  current: 0,
  longest: 0,
  embers: 0,
  frozenFlames: 0,
  totalXp: 0,
  todayXp: 0,
  todayDate: "",
};

const FRESH: GlobalProgress = {
  lessons: {},
  streak: FRESH_STREAK,
  conceptsTouched: [],
  brainDump: [],
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadProgress(): GlobalProgress {
  if (typeof window === "undefined") return FRESH;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return FRESH;
    const parsed = JSON.parse(raw) as GlobalProgress;
    return { ...FRESH, ...parsed, streak: { ...FRESH_STREAK, ...parsed.streak } };
  } catch {
    return FRESH;
  }
}

export function saveProgress(p: GlobalProgress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
  // Notify other tabs / our own listeners.
  window.dispatchEvent(new CustomEvent("code-killa:progress"));
}

export function updateProgress(
  fn: (p: GlobalProgress) => GlobalProgress,
): GlobalProgress {
  const cur = loadProgress();
  const next = fn(cur);
  saveProgress(next);
  return next;
}

export function exerciseKey(chapterSlug: string, exerciseSlug: string): string {
  return `${chapterSlug}/${exerciseSlug}`;
}

export function getLesson(
  p: GlobalProgress,
  chapterSlug: string,
  exerciseSlug: string,
): LessonProgress {
  const k = exerciseKey(chapterSlug, exerciseSlug);
  return (
    p.lessons[k] || {
      chapterSlug,
      exerciseSlug,
      status: "not-started",
      attempts: 0,
    }
  );
}

export function setLesson(
  chapterSlug: string,
  exerciseSlug: string,
  patch: Partial<LessonProgress>,
) {
  return updateProgress((p) => {
    const k = exerciseKey(chapterSlug, exerciseSlug);
    const cur = p.lessons[k] || {
      chapterSlug,
      exerciseSlug,
      status: "not-started" as const,
      attempts: 0,
    };
    return {
      ...p,
      lessons: { ...p.lessons, [k]: { ...cur, ...patch } },
      lastVisited: { chapterSlug, exerciseSlug },
      conceptsTouched: p.conceptsTouched.includes(chapterSlug)
        ? p.conceptsTouched
        : [...p.conceptsTouched, chapterSlug],
    };
  });
}

export { todayISO, FRESH_STREAK };

// ──────────────────────────────────────────────────────────────────────────
// V2 progress — additive, lives at its own key. v1 reads still work above.
// Architecture: docs/plan/03-architecture.md §4. UX: docs/plan/02-ux.md §7.
// ──────────────────────────────────────────────────────────────────────────

export type StepProgress = {
  stepId: string;
  status: "passed" | "failed" | "skipped";
  attempts: StepAttempt[];
  firstSeenAt: string;
  passedAt?: string;
  hintsUsed: number;
  draft?: string; // last-typed code, kept across reloads
};

export type LessonProgressV2 = {
  chapterSlug: string;
  lessonSlug: string;
  startedAt?: string;
  completedAt?: string;
  abandonedAt?: string;
};

export type LastVisitedV2 = {
  chapterSlug: string;
  lessonSlug: string;
  stepIndex: number;
};

export type ProgressV2 = {
  schemaVersion: 2;
  userId: string;
  profile: Partial<UserProfile>;
  steps: Record<string, StepProgress>; // key = stepId
  lessons: Record<string, LessonProgressV2>; // key = `${chapterSlug}/${lessonSlug}`
  streak: StreakState; // shared semantics with v1
  lastVisitedV2?: LastVisitedV2;
  conceptsTouched: string[]; // unique step.concept values
  createdAt: string;
};

function freshUserId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `u_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function freshV2(): ProgressV2 {
  return {
    schemaVersion: 2,
    userId: freshUserId(),
    profile: {},
    steps: {},
    lessons: {},
    streak: { ...FRESH_STREAK },
    conceptsTouched: [],
    createdAt: new Date().toISOString(),
  };
}

function lessonKeyV2(chapterSlug: string, lessonSlug: string): string {
  return `${chapterSlug}/${lessonSlug}`;
}

export function loadProgressV2(): ProgressV2 {
  if (typeof window === "undefined") return freshV2();
  try {
    const raw = window.localStorage.getItem(KEY_V2);
    if (!raw) {
      // Bridge from v1: reuse streak so a returning v1 user doesn't lose their fire.
      const v1 = loadProgress();
      const seed = freshV2();
      return { ...seed, streak: { ...FRESH_STREAK, ...v1.streak } };
    }
    const parsed = JSON.parse(raw) as Partial<ProgressV2>;
    const seed = freshV2();
    return {
      ...seed,
      ...parsed,
      schemaVersion: 2,
      profile: { ...seed.profile, ...(parsed.profile ?? {}) },
      steps: { ...(parsed.steps ?? {}) },
      lessons: { ...(parsed.lessons ?? {}) },
      streak: { ...FRESH_STREAK, ...(parsed.streak ?? {}) },
      conceptsTouched: parsed.conceptsTouched ?? [],
      userId: parsed.userId ?? seed.userId,
      createdAt: parsed.createdAt ?? seed.createdAt,
    };
  } catch {
    return freshV2();
  }
}

export function saveProgressV2(p: ProgressV2) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY_V2, JSON.stringify(p));
  window.dispatchEvent(new CustomEvent("code-killa:progress-v2"));
}

export function updateProgressV2(
  fn: (p: ProgressV2) => ProgressV2,
): ProgressV2 {
  const cur = loadProgressV2();
  const next = fn(cur);
  saveProgressV2(next);
  return next;
}

export function getStepAttempts(stepId: string): StepAttempt[] {
  return loadProgressV2().steps[stepId]?.attempts ?? [];
}

export function getStepProgress(stepId: string): StepProgress | undefined {
  return loadProgressV2().steps[stepId];
}

export function setStepAttempt(
  stepId: string,
  attempt: StepAttempt,
  opts?: { concept?: string },
): ProgressV2 {
  return updateProgressV2((p) => {
    const now = attempt.submittedAt;
    const prev = p.steps[stepId];
    const attempts = [...(prev?.attempts ?? []), attempt];
    const passed = attempt.correct || prev?.status === "passed";
    const next: StepProgress = {
      stepId,
      status: passed ? "passed" : "failed",
      attempts,
      firstSeenAt: prev?.firstSeenAt ?? attempt.startedAt ?? now,
      passedAt: passed ? prev?.passedAt ?? now : prev?.passedAt,
      hintsUsed: Math.max(prev?.hintsUsed ?? 0, attempt.hintsUsed),
      draft: prev?.draft,
    };
    const concept = opts?.concept;
    const conceptsTouched =
      concept && !p.conceptsTouched.includes(concept)
        ? [...p.conceptsTouched, concept]
        : p.conceptsTouched;
    return {
      ...p,
      steps: { ...p.steps, [stepId]: next },
      conceptsTouched,
    };
  });
}

export function setStepSkipped(stepId: string): ProgressV2 {
  return updateProgressV2((p) => {
    const prev = p.steps[stepId];
    if (prev?.status === "passed") return p; // never downgrade a pass
    const now = new Date().toISOString();
    const next: StepProgress = {
      stepId,
      status: "skipped",
      attempts: prev?.attempts ?? [],
      firstSeenAt: prev?.firstSeenAt ?? now,
      passedAt: prev?.passedAt,
      hintsUsed: prev?.hintsUsed ?? 0,
      draft: prev?.draft,
    };
    return { ...p, steps: { ...p.steps, [stepId]: next } };
  });
}

export function setStepDraft(stepId: string, draft: string): ProgressV2 {
  return updateProgressV2((p) => {
    const prev = p.steps[stepId];
    const now = new Date().toISOString();
    const next: StepProgress = prev
      ? { ...prev, draft }
      : {
          stepId,
          status: "failed",
          attempts: [],
          firstSeenAt: now,
          hintsUsed: 0,
          draft,
        };
    return { ...p, steps: { ...p.steps, [stepId]: next } };
  });
}

export function markLessonComplete(
  chapterSlug: string,
  lessonSlug: string,
): ProgressV2 {
  return updateProgressV2((p) => {
    const k = lessonKeyV2(chapterSlug, lessonSlug);
    const prev = p.lessons[k];
    const now = new Date().toISOString();
    return {
      ...p,
      lessons: {
        ...p.lessons,
        [k]: {
          chapterSlug,
          lessonSlug,
          startedAt: prev?.startedAt ?? now,
          completedAt: prev?.completedAt ?? now,
        },
      },
    };
  });
}

export function markLessonStarted(
  chapterSlug: string,
  lessonSlug: string,
): ProgressV2 {
  return updateProgressV2((p) => {
    const k = lessonKeyV2(chapterSlug, lessonSlug);
    if (p.lessons[k]?.startedAt) return p;
    return {
      ...p,
      lessons: {
        ...p.lessons,
        [k]: {
          ...(p.lessons[k] ?? {}),
          chapterSlug,
          lessonSlug,
          startedAt: new Date().toISOString(),
        },
      },
    };
  });
}

export function getLessonProgressV2(
  chapterSlug: string,
  lessonSlug: string,
): LessonProgressV2 | undefined {
  return loadProgressV2().lessons[lessonKeyV2(chapterSlug, lessonSlug)];
}

export function setLastVisitedV2(visited: LastVisitedV2): ProgressV2 {
  return updateProgressV2((p) => ({ ...p, lastVisitedV2: visited }));
}

export function getLastVisitedV2(): LastVisitedV2 | undefined {
  return loadProgressV2().lastVisitedV2;
}

export function setUserProfile(profile: Partial<UserProfile>): ProgressV2 {
  return updateProgressV2((p) => ({
    ...p,
    profile: { ...p.profile, ...profile },
  }));
}

export function getUserProfile(): Partial<UserProfile> {
  return loadProgressV2().profile;
}

export { lessonKeyV2 };
