// Shared content types — kept in sync with scripts/build-content.mjs output.

export type Exercise = {
  number: number;
  slug: string;
  title: string;
  docstring: string;
  goal: string;
  starter: string;
  expectedStdout: string | null;
  hasSolution: boolean;
};

export type Chapter = {
  number: number;
  slug: string;
  folder: string;
  title: string;
  readme: string;
  lessonCode: string;
  checkpoint: string;
  exercises: Exercise[];
};

export type Manifest = {
  generatedAt: string;
  chapters: Chapter[];
};

// Progress / streak persistence (localStorage shape)

export type LessonProgress = {
  chapterSlug: string;
  exerciseSlug: string;
  status: "not-started" | "attempted" | "passed";
  attempts: number;
  passedAt?: string;
  lastAttemptAt?: string;
  draft?: string; // user's current code
  notes?: string; // brain-dump content
};

export type StreakState = {
  lastActivityDate: string; // YYYY-MM-DD
  current: number; // current streak length in days
  longest: number;
  embers: number; // earned-buffer days, max 2
  frozenFlames: number; // grace tokens, max 4
  totalXp: number;
  todayXp: number;
  todayDate: string;
};

export type GlobalProgress = {
  lessons: Record<string, LessonProgress>; // key: `${chapter}/${exercise}`
  streak: StreakState;
  lastVisited?: { chapterSlug: string; exerciseSlug: string };
  conceptsTouched: string[]; // unique chapter slugs ever touched
  brainDump: string[]; // global brain-dump items
};
