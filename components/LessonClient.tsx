"use client";
import { useEffect, useState } from "react";
import LessonView from "./LessonView";
import CodeEditor from "./CodeEditor";
import OutputPane from "./OutputPane";
import { loadProgress } from "@/lib/storage";
import type { Chapter, Exercise } from "@/lib/types";

type Props = {
  chapter: Chapter;
  exercise: Exercise;
  next: { chapterSlug: string; exerciseSlug: string } | null;
};

type RunResult = { stdout: string; stderr: string; passed: boolean | null };

export default function LessonClient({ chapter, exercise, next }: Props) {
  const [view, setView] = useState<"lesson" | "exercise">("exercise");
  const [result, setResult] = useState<RunResult>({ stdout: "", stderr: "", passed: null });
  const [initialCode, setInitialCode] = useState(exercise.starter);

  useEffect(() => {
    const p = loadProgress();
    const k = `${chapter.slug}/${exercise.slug}`;
    const draft = p.lessons[k]?.draft;
    if (draft && draft.length > 0) setInitialCode(draft);
    setResult({ stdout: "", stderr: "", passed: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter.slug, exercise.slug]);

  return (
    <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section className="border-r border-ink-800 min-h-0">
        <LessonView chapter={chapter} exercise={exercise} view={view} setView={setView} />
      </section>
      <section className="border-r border-ink-800 min-h-0">
        <CodeEditor
          key={`${chapter.slug}/${exercise.slug}`}
          chapterSlug={chapter.slug}
          exercise={exercise}
          initialCode={initialCode}
          onResult={setResult}
        />
      </section>
      <section className="min-h-0">
        <OutputPane
          stdout={result.stdout}
          stderr={result.stderr}
          passed={result.passed}
          expected={exercise.expectedStdout}
          next={next}
        />
      </section>
    </div>
  );
}
