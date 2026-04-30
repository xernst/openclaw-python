import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ArrowRight } from "lucide-react";
import {
  getV2Chapter,
  getV2Toc,
  listAllV2ChapterRoutes,
} from "@/lib/content-v2";
import V2ChapterNav, {
  type ChapterNavTree,
} from "@/components/v2/ChapterNav";

export async function generateStaticParams() {
  return listAllV2ChapterRoutes();
}

export default async function V2ChapterOverviewPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: chapterSlug } = await params;
  const chapter = await getV2Chapter(chapterSlug);
  if (!chapter) notFound();

  // No overview body? Fall back to the lesson list page that ships today —
  // jump straight to lesson 1 step 0 so the route stays useful.
  const firstLesson = chapter.lessons[0];
  if (!chapter.overview && firstLesson) {
    redirect(`/learn/v2/${chapter.slug}/${firstLesson.slug}/0`);
  }

  const toc = getV2Toc();
  const tree: ChapterNavTree = { toc, detail: chapter };

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col bg-ink-950 text-ink-100">
      <div className="flex h-full min-h-0 flex-1">
        <aside className="hidden w-60 shrink-0 border-r border-ink-800 bg-ink-900 lg:flex lg:flex-col">
          <V2ChapterNav
            tree={tree}
            activeChapter={chapter.slug}
            activeLesson=""
            activeStepIndex={-1}
          />
        </aside>
        <main className="flex min-h-0 w-full flex-1 flex-col">
          <div className="flex-1 min-h-0 overflow-auto">
            <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
              <div className="text-xs uppercase tracking-[0.2em] text-ember-400">
                Chapter {String(chapter.number).padStart(2, "0")}
              </div>
              <h1 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-5xl">
                {chapter.title.replace(/\s*—.*$/, "")}
              </h1>
              {chapter.blurb && (
                <p className="mt-3 text-lg text-ink-300">{chapter.blurb}</p>
              )}
              <div className="mt-2 font-mono text-[11px] text-ink-500">
                {chapter.lessons.length}{" "}
                {chapter.lessons.length === 1 ? "lesson" : "lessons"} ·{" "}
                {chapter.lessons.reduce((a, l) => a + l.steps.length, 0)} steps
                · {chapter.xpTotal} XP
              </div>

              <div className="prose prose-invert mt-8 max-w-none text-ink-200">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {chapter.overview}
                </ReactMarkdown>
              </div>

              <div className="mt-10 flex items-center gap-3 border-t border-ink-800 pt-6">
                {firstLesson && (
                  <Link
                    href={`/learn/v2/${chapter.slug}/${firstLesson.slug}/0`}
                    className="inline-flex items-center gap-2 rounded-md bg-ember-500 px-4 py-2 text-sm font-medium text-ink-950 transition hover:bg-ember-400"
                  >
                    Start chapter
                    <ArrowRight size={14} />
                  </Link>
                )}
                <Link
                  href="/"
                  className="text-xs text-ink-500 hover:text-ink-300"
                >
                  ← Back to all chapters
                </Link>
              </div>

              <div className="mt-10">
                <h2 className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
                  Lessons in this chapter
                </h2>
                <ol className="mt-2 flex flex-col divide-y divide-ink-800 rounded-md border border-ink-800 bg-ink-950">
                  {chapter.lessons.map((lesson, idx) => (
                    <li key={lesson.slug}>
                      <Link
                        href={`/learn/v2/${chapter.slug}/${lesson.slug}/0`}
                        className="flex items-center justify-between px-4 py-3 text-sm transition hover:bg-ink-900"
                      >
                        <span className="flex items-center gap-3">
                          <span className="font-mono text-[10px] text-ink-500">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="text-ink-200">{lesson.title}</span>
                        </span>
                        <span className="font-mono text-[10px] text-ink-500">
                          {lesson.steps.length} steps
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
