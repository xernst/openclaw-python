"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import type { Chapter, Exercise } from "@/lib/types";

type Props = {
  chapter: Chapter;
  exercise: Exercise;
  view: "lesson" | "exercise";
  setView: (v: "lesson" | "exercise") => void;
};

export default function LessonView({ chapter, exercise, view, setView }: Props) {
  // Strip the docstring's outer triple quotes for cleaner rendering.
  const exerciseDoc = exercise.docstring;

  return (
    <div className="flex h-full flex-col">
      <div className="flex border-b border-ink-800 bg-ink-900">
        <button
          onClick={() => setView("exercise")}
          className={`flex-1 py-2 text-xs font-medium transition ${
            view === "exercise"
              ? "bg-ink-950 text-ember-400 border-b-2 border-ember-500"
              : "text-ink-500 hover:text-ink-300"
          }`}
        >
          Exercise {chapter.number}.{exercise.number}
        </button>
        <button
          onClick={() => setView("lesson")}
          className={`flex-1 py-2 text-xs font-medium transition ${
            view === "lesson"
              ? "bg-ink-950 text-ember-400 border-b-2 border-ember-500"
              : "text-ink-500 hover:text-ink-300"
          }`}
        >
          Chapter notes
        </button>
      </div>
      <div className="prose prose-invert max-w-none flex-1 overflow-auto p-6 prose-headings:font-semibold prose-pre:bg-ink-950 prose-pre:border prose-pre:border-ink-800 prose-code:before:content-none prose-code:after:content-none prose-code:bg-ink-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-ember-300 prose-h1:text-2xl prose-h2:text-lg prose-h3:text-base prose-p:text-ink-300 prose-li:text-ink-300 prose-strong:text-ink-100">
        {view === "exercise" ? (
          <>
            <h1 className="!mt-0">{exercise.title}</h1>
            <pre className="!bg-ink-900 !border !border-ink-800 whitespace-pre-wrap !text-sm !text-ink-300 leading-relaxed">
              {exerciseDoc}
            </pre>
            {exercise.expectedStdout != null && (
              <details className="mt-4 rounded-md border border-ink-800 bg-ink-900 p-3 text-sm">
                <summary className="cursor-pointer text-ink-400">Hint: Expected output (peek)</summary>
                <pre className="mt-2 !bg-ink-950 !border !border-ink-800 whitespace-pre-wrap text-ember-300">
                  {exercise.expectedStdout}
                </pre>
              </details>
            )}
          </>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {chapter.readme}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
