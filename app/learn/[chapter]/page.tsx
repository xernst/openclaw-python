import { notFound } from "next/navigation";
import Link from "next/link";
import { getChapter, getChapters } from "@/lib/content";

export function generateStaticParams() {
  return getChapters().map((c) => ({ chapter: c.slug }));
}

export default async function ChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter: chapterSlug } = await params;
  const chapter = getChapter(chapterSlug);
  if (!chapter) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-ink-500">
          Chapter {chapter.number}
        </div>
        <h1 className="mt-1 text-2xl font-bold text-ink-50">
          {chapter.title.replace(/^Chapter\s+\d+\s*[—\-]\s*/, "")}
        </h1>
      </div>
      <div className="mb-6 rounded-lg border border-ink-800 bg-ink-950 p-4 text-sm text-ink-400">
        {chapter.exercises.length} exercises · all gradeable in your browser.
      </div>
      <ul className="space-y-2">
        {chapter.exercises.map((ex) => (
          <li key={ex.slug}>
            <Link
              href={`/learn/${chapter.slug}/${ex.slug}`}
              className="flex items-center justify-between rounded-lg border border-ink-800 bg-ink-950 p-4 transition hover:border-ember-700/50 hover:bg-ink-900"
            >
              <div>
                <div className="font-mono text-[10px] text-ink-600">
                  {chapter.number}.{ex.number}
                </div>
                <div className="mt-0.5 font-medium text-ink-200">{ex.title}</div>
                {ex.goal && (
                  <div className="mt-1 text-xs text-ink-500 line-clamp-1">{ex.goal.split("\n")[0]}</div>
                )}
              </div>
              <span className="text-xs text-ink-600">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
