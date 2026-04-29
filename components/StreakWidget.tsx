"use client";
import { useEffect, useState } from "react";
import { Flame, Snowflake, Sparkles } from "lucide-react";
import { loadProgress } from "@/lib/storage";
import { viewStreak } from "@/lib/streaks";
import type { StreakState } from "@/lib/types";

export default function StreakWidget() {
  const [s, setS] = useState<StreakState | null>(null);

  useEffect(() => {
    const refresh = () => setS(viewStreak(loadProgress()));
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("code-killa:progress", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("code-killa:progress", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  if (!s) return null;

  return (
    <div className="flex items-center gap-3 text-xs">
      <span
        title={`${s.current}-day streak (longest ${s.longest})`}
        className="inline-flex items-center gap-1 text-orange-300"
      >
        <Flame size={14} className={s.current > 0 ? "fill-orange-400 text-orange-400" : "text-ink-600"} />
        {s.current}
      </span>
      <span title={`${s.embers} ember(s) — auto-protect missed days`} className="inline-flex items-center gap-1 text-amber-300">
        <Sparkles size={14} className={s.embers > 0 ? "text-amber-400" : "text-ink-600"} />
        {s.embers}
      </span>
      <span title={`${s.frozenFlames} frozen flame(s) — earned per chapter`} className="inline-flex items-center gap-1 text-cyan-300">
        <Snowflake size={14} className={s.frozenFlames > 0 ? "text-cyan-400" : "text-ink-600"} />
        {s.frozenFlames}
      </span>
      <span title="Total XP earned" className="hidden sm:inline text-ink-400">
        {s.totalXp} XP
      </span>
    </div>
  );
}
