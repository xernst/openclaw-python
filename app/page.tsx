import Link from "next/link";
import { getChapters, getFirstExercise } from "@/lib/content";
import ResumeCard from "@/components/ResumeCard";
import StreakWidget from "@/components/StreakWidget";

export default function Home() {
  const chapters = getChapters();
  const first =
    getFirstExercise() || {
      chapterSlug: chapters[0].slug,
      exerciseSlug: chapters[0].exercises[0]?.slug ?? "",
    };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <header className="mb-12 flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-ember-500">Pyloft</div>
          <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight text-ink-50">
            Python for AI-first builders
          </h1>
          <p className="mt-2 max-w-xl text-ink-400">
            The Python you need to direct AI, read what it wrote, and catch what it got wrong.
          </p>
        </div>
        <StreakWidget />
      </header>

      <ResumeCard
        fallback={first}
        index={Object.fromEntries(
          chapters.map((c) => [
            c.slug,
            {
              number: c.number,
              title: c.title,
              exercises: Object.fromEntries(c.exercises.map((e) => [e.slug, e.number])),
            },
          ]),
        )}
      />

      <section className="mt-12">
        <h2 className="mb-4 text-xs uppercase tracking-widest text-ink-500">All chapters</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((c) => (
            <Link
              key={c.slug}
              href={`/learn/${c.slug}`}
              className="group flex items-center justify-between rounded-lg border border-ink-800 bg-ink-950 p-4 transition hover:border-ink-700 hover:bg-ink-900"
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-600">
                  Ch {String(c.number).padStart(2, "0")}
                </div>
                <div className="mt-0.5 text-sm font-medium text-ink-200 group-hover:text-ember-300">
                  {c.title.replace(/^Chapter\s+\d+\s*[—\-]\s*/, "")}
                </div>
              </div>
              <div className="text-xs text-ink-600">{c.exercises.length} ex</div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-ink-800 pt-6 text-xs text-ink-600">
        <p>
          Press{" "}
          <kbd className="rounded border border-ink-700 bg-ink-900 px-1 py-0.5 font-mono text-[10px] text-ink-300">
            ⌘⇧B
          </kbd>{" "}
          from anywhere to park a thought without losing your place.
        </p>
      </footer>
    </div>
  );
}
