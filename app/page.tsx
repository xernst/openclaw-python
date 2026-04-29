import Link from "next/link";
import { getChapters } from "@/lib/content";
import { getV2Toc, getV2Chapter } from "@/lib/content-v2";
import HomeClient from "@/components/v2/HomeClient";
import StreakWidget from "@/components/StreakWidget";

export default async function Home() {
  const toc = getV2Toc();

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
          <div className="text-xs uppercase tracking-[0.2em] text-ember-500">
            Pyloft
          </div>
          <h1 className="mt-2 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink-50 sm:text-6xl">
            Python for AI-first builders.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-300">
            The Python you need to direct AI agents, read what they wrote, and
            catch what they got wrong.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-ink-500">
            Built for the marketing managers, PMs, and ops folks who use Cursor
            daily and have hit the ceiling of what they can do without code
            literacy. Free. Open-source. No certificate, no leaderboards, no
            paywall in the first five chapters.
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

      <section className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          {
            title: "Read what AI wrote",
            body:
              "Most lessons start with code Cursor or Claude already produced. You learn to read it, predict its output, and judge whether it works.",
          },
          {
            title: "Catch what it got wrong",
            body:
              "Hallucinated APIs, silent type bugs, off-by-one errors, broken imports. The bugs AI ships are different from the bugs humans ship. We drill those.",
          },
          {
            title: "Direct it deliberately",
            body:
              "When you understand mutation, scope, and control flow, you can prompt the AI like a tech lead instead of a passenger.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-lg border border-ink-800 bg-ink-950 p-5"
          >
            <div className="font-display text-lg font-semibold text-ink-50">
              {card.title}
            </div>
            <p className="mt-2 text-sm text-ink-400">{card.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-16">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xs uppercase tracking-widest text-ink-500">
            Eight chapters · sixteen lessons · 134 steps
          </h2>
          <Link
            href="/onboarding"
            className="text-xs text-ember-400 hover:text-ember-300"
          >
            new here? start the 5-question onboarding →
          </Link>
        </div>
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
