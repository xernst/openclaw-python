"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import LessonShell from "./LessonShell";
import PersistentIDE, {
  type IDEFile,
  type PersistentIDEHandle,
} from "./PersistentIDE";
import StepRouter, { type StepIDEBridge } from "./StepRouter";
import V2ChapterNav, { type ChapterNavTree } from "./ChapterNav";
import type { Chapter, Lesson, Step, StepAttempt, UserProfile } from "@/lib/content/schema";
import {
  loadProgressV2,
  setStepAttempt,
  setLastVisitedV2,
  markLessonStarted,
  markLessonComplete,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

type Props = {
  tree: ChapterNavTree;
  chapter: Chapter;
  lesson: Lesson;
  step: Step;
  stepIndex: number;
  next: { chapterSlug: string; lessonSlug: string; stepIndex: number } | null;
};

const FRESH_PROFILE: UserProfile = {
  name: "",
  goal: "curious",
  level: "absolute-beginner",
  flavor: {},
  dailyGoalMinutes: 10,
  reducedMotion: false,
  soundEnabled: false,
  createdAt: new Date(0).toISOString(),
};

export default function LessonStepClient({
  tree,
  chapter,
  lesson,
  step,
  stepIndex,
  next,
}: Props) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(FRESH_PROFILE);
  const [latestAttempt, setLatestAttempt] = useState<StepAttempt | null>(null);
  const ideRef = useRef<PersistentIDEHandle>(null);

  // Load profile + record visit on mount / step change.
  useEffect(() => {
    const progress = loadProgressV2();
    if (progress.profile) {
      setProfile({ ...FRESH_PROFILE, ...progress.profile });
    }
    setLastVisitedV2({
      chapterSlug: chapter.slug,
      lessonSlug: lesson.slug,
      stepIndex,
    });
    if (stepIndex === 0) {
      markLessonStarted(chapter.slug, lesson.slug);
    }
    setLatestAttempt(null);
  }, [chapter.slug, lesson.slug, stepIndex]);

  const ideFiles = useMemo<IDEFile[]>(() => buildFilesForStep(step), [step]);
  const stepRunnable = useMemo(() => stepIsRunnable(step), [step]);

  const ideBridge = useMemo<StepIDEBridge>(
    () => ({
      run: async () => ideRef.current?.run() ?? null,
      getActiveCode: () => ideRef.current?.getActiveCode() ?? "",
    }),
    [],
  );

  function handleAttempt(attempt: StepAttempt) {
    setLatestAttempt(attempt);
    setStepAttempt(step.id, attempt, { concept: step.concept });
    if (attempt.correct && next === null) {
      markLessonComplete(chapter.slug, lesson.slug);
    }
  }

  function handleContinue() {
    if (!next) {
      router.push("/");
      return;
    }
    if (next.chapterSlug === chapter.slug && next.lessonSlug === lesson.slug) {
      router.push(`/learn/v2/${next.chapterSlug}/${next.lessonSlug}/${next.stepIndex}`);
    } else {
      router.push(`/learn/v2/${next.chapterSlug}/${next.lessonSlug}/${next.stepIndex}`);
    }
  }

  const totalSteps = lesson.steps.length;
  const passed = latestAttempt?.correct === true;

  return (
    <LessonShell
      sidebar={
        <V2ChapterNav
          tree={tree}
          activeChapter={chapter.slug}
          activeLesson={lesson.slug}
          activeStepIndex={stepIndex}
        />
      }
      header={
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs text-ink-400">
            <span className="uppercase tracking-wide">
              {chapter.title}
            </span>
            <span className="font-mono">
              {stepIndex + 1} / {totalSteps}
            </span>
          </div>
          <h1 className="font-display text-xl text-ink-100">{lesson.title}</h1>
          <ProgressBar value={(stepIndex + 1) / totalSteps} />
        </div>
      }
      prompt={
        <StepRouter
          step={step}
          profile={profile}
          onAttempt={handleAttempt}
          ide={ideBridge}
        />
      }
      footer={
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-500">
            {passed
              ? "Locked in. Move on when you're ready."
              : "⌘↵ runs the editor."}
          </span>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!passed && step.type !== "read"}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition",
              "bg-ember-500 text-ink-950 hover:bg-ember-400",
              "disabled:cursor-not-allowed disabled:bg-ink-800 disabled:text-ink-500",
            )}
          >
            {next ? "Continue →" : "Finish"}
          </button>
        </div>
      }
      ide={
        <PersistentIDE
          ref={ideRef}
          stepId={step.id}
          files={ideFiles}
          runnable={stepRunnable}
        />
      }
    />
  );
}

function ProgressBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1 w-full overflow-hidden rounded-full bg-ink-800"
    >
      <div
        className="h-full bg-ember-500 transition-all motion-reduce:transition-none"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function buildFilesForStep(step: Step): IDEFile[] {
  if (step.files && step.files.length > 0) {
    return step.files.map((f) => ({
      name: f.name,
      body: f.body,
      readOnly: f.readOnly,
      language: f.language,
    }));
  }

  switch (step.type) {
    case "read":
    case "mc": {
      const code = step.code ?? "";
      return [
        {
          name: "main.py",
          body: code,
          readOnly: true,
          language: "python",
        },
      ];
    }
    case "predict":
      return [
        {
          name: "main.py",
          body: step.code,
          readOnly: true,
          language: "python",
        },
      ];
    case "fix":
      return [
        {
          name: "main.py",
          body: step.brokenCode,
          readOnly: false,
          language: "python",
        },
      ];
    case "write":
    case "checkpoint":
      return [
        {
          name: "main.py",
          body: step.starter,
          readOnly: false,
          language: "python",
        },
      ];
    case "fill":
    case "reorder":
      return [
        {
          name: "main.py",
          body: "",
          readOnly: true,
          language: "python",
        },
      ];
  }
}

function stepIsRunnable(step: Step): boolean {
  switch (step.type) {
    case "read":
    case "mc":
      return step.runnable !== false && (step.code?.length ?? 0) > 0;
    case "predict":
    case "fix":
    case "write":
    case "checkpoint":
      return true;
    case "fill":
    case "reorder":
      return false;
  }
}
