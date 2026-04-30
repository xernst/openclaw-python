"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import DailyGoalDial from "./DailyGoalDial";

type Props = {
  /**
   * Left rail — chapter / lesson / step navigation. v2-specific sidebar
   * comes from A8; the shell just hosts it.
   */
  sidebar: ReactNode;
  /**
   * Centre column — step prompt rendered by StepRouter (A3).
   */
  prompt: ReactNode;
  /**
   * Right column — PersistentIDE instance owned by the parent so it can
   * persist across steps without unmounting.
   */
  ide: ReactNode;
  /**
   * Optional header strip rendered above the prompt panel (lesson title,
   * progress bar, daily-goal dial). Falls back to nothing.
   */
  header?: ReactNode;
  /**
   * Optional footer rendered under the prompt panel — Hint / Skip / Continue
   * buttons usually live here (StepFooter, C2).
   */
  footer?: ReactNode;
};

export default function LessonShell({
  sidebar,
  prompt,
  ide,
  header,
  footer,
}: Props) {
  // Default the mobile drawer to "show prompt" so first-time visitors see
  // lesson content instead of an empty editor. We can only inspect window
  // size client-side, so the SSR render falls back to the IDE pane (matches
  // the desktop two-column view) and we flip after mount on small screens.
  const [drawerOpen, setDrawerOpen] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setDrawerOpen(false);
    }
  }, []);

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col bg-ink-950 text-ink-100">
      <div className="flex h-full min-h-0 flex-1">
        <aside className="hidden w-60 shrink-0 border-r border-ink-800 bg-ink-900 lg:flex lg:flex-col">
          {sidebar}
        </aside>
        <main className="flex min-h-0 w-full flex-1 lg:grid lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)]">
          <section
            className={cn(
              "min-h-0 min-w-0 flex-1 flex-col border-r border-ink-800",
              "lg:max-w-[520px]",
              drawerOpen ? "hidden lg:flex" : "flex",
            )}
          >
            {header && (
              <div className="flex items-start justify-between gap-3 border-b border-ink-800 bg-ink-900 px-5 py-3">
                <div className="min-w-0 flex-1">{header}</div>
                <DailyGoalDial compact className="shrink-0 pt-0.5" />
              </div>
            )}
            <div className="flex-1 min-h-0 overflow-auto px-4 py-5 sm:px-5 sm:py-6">
              {prompt}
            </div>
            {footer && (
              <div className="border-t border-ink-800 bg-ink-900 px-4 py-3 sm:px-5">
                {footer}
              </div>
            )}
          </section>
          <section
            className={cn(
              "min-h-0 min-w-0 flex-1 flex-col",
              drawerOpen ? "flex" : "hidden lg:flex",
            )}
          >
            {ide}
          </section>
        </main>
      </div>
      <button
        type="button"
        onClick={() => setDrawerOpen((v) => !v)}
        className={cn(
          "flex items-center justify-center gap-1.5 border-t border-ink-800 bg-ink-900 py-2 text-xs text-ink-300 lg:hidden",
        )}
        aria-label={drawerOpen ? "Show prompt" : "Show editor"}
      >
        {drawerOpen ? (
          <>
            <ChevronUp size={14} />
            Show prompt
          </>
        ) : (
          <>
            <ChevronDown size={14} />
            Show editor
          </>
        )}
      </button>
    </div>
  );
}
