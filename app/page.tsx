import Link from "next/link";
import { getChapters } from "@/lib/content";
import { getV2Toc, getV2Chapter } from "@/lib/content-v2";
import HomeClient from "@/components/v2/HomeClient";
import StreakWidget from "@/components/StreakWidget";

export default async function Home() {
  const toc = getV2Toc();

  // Resolve the first lesson slug for each v2 chapter so cards deep-link
  // straight into a step page. Done on the server during prerender.
  const v2Chapters = await Promise.all(
    toc.chapters.map(async (entry) => {
      const detail = await getV2Chapter(entry.slug);
      const firstLessonSlug = detail?.lessons[0]?.slug ?? null;
      return {
        slug: entry.slug,
        title: entry.title,
        number: entry.number,
        blurb: entry.blurb,
        lessonCount: entry.lessonCount,
        stepCount: entry.stepCount,
        firstLessonSlug,
      };
    }),
  );

  const fallback = {
    chapterSlug: "variables",
    lessonSlug: "naming-things",
    stepIndex: 0,
  };

  const legacyChapters = getChapters();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <header className="mb-12 flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-ember-500">Pyloft</div>
          <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight text-ink-50">
            Python for AI-first builders
          </h1>
          <p className="mt-2 max-w-xl text-ink-400">
            The Python you need to direct AI agents, read what they wrote, and
            catch what they got wrong. Unlike Codecademy, we&rsquo;re built around
            the AI you already use.
          </p>
        </div>
        <StreakWidget />
      </header>

      <HomeClient
        fallback={fallback}
        chapters={v2Chapters.map((c) => ({
          slug: c.slug,
          title: c.title,
          number: c.number,
        }))}
      />

      <section className="mt-12">
        <h2 className="mb-4 text-xs uppercase tracking-widest text-ink-500">
          Chapters
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {v2Chapters.map((c) => {
            const href = c.firstLessonSlug
              ? `/learn/v2/${c.slug}/${c.firstLessonSlug}/0`
              : null;
            const titleClean = c.title.replace(/\s*—.*$/, "");
            const cardBody = (
              <>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-600">
                  Ch {String(c.number).padStart(2, "0")}
                </div>
                <div className="mt-1 text-sm font-medium text-ink-100 group-hover:text-ember-300">
                  {titleClean}
                </div>
                <p className="mt-2 line-clamp-3 text-xs text-ink-500">
                  {c.blurb}
                </p>
                <div className="mt-3 font-mono text-[10px] text-ink-600">
                  {c.stepCount} steps · {c.lessonCount}{" "}
                  {c.lessonCount === 1 ? "lesson" : "lessons"}
                </div>
              </>
            );
            return href ? (
              <Link
                key={c.slug}
                href={href}
                className="group flex flex-col rounded-lg border border-ink-800 bg-ink-950 p-4 transition hover:border-ember-700/60 hover:bg-ink-900"
              >
                {cardBody}
              </Link>
            ) : (
              <div
                key={c.slug}
                className="flex flex-col rounded-lg border border-ink-800 bg-ink-950 p-4 opacity-60"
              >
                {cardBody}
              </div>
            );
          })}
        </div>
      </section>

      <details className="group mt-12 rounded-lg border border-ink-800 bg-ink-950">
        <summary className="cursor-pointer list-none px-4 py-3 text-xs uppercase tracking-widest text-ink-500 hover:text-ink-300">
          <span className="mr-2 inline-block transition group-open:rotate-90">
            ▸
          </span>
          Legacy 28-chapter course (old style)
        </summary>
        <div className="grid grid-cols-1 gap-2 border-t border-ink-800 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {legacyChapters.map((c) => (
            <Link
              key={c.slug}
              href={`/learn/${c.slug}`}
              className="group flex items-center justify-between rounded-lg border border-ink-800 bg-ink-950 p-3 transition hover:border-ink-700 hover:bg-ink-900"
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
      </details>

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
