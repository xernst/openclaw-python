"use client";

import { useEffect, useState } from "react";
import { Sun } from "lucide-react";
import { loadProgressV2 } from "@/lib/storage";
import { cn } from "@/lib/utils";

// C4 — UX §5: floor not target, missed never punishes, exceeded banks ember.
// Renders today's minutes vs the user's daily floor as a 28px ring.
// At goal, the ring fills green (signal). Past goal, it stays green and
// shows a tiny `+` to communicate "banked," not "go away."

const XP_PER_MINUTE = 10; // matches XP_PER_PASS in lib/streaks.ts

type Props = {
  /** Override minutes (testing). Otherwise reads from ProgressV2 streak.todayXp. */
  todayMinutes?: number;
  /** Override goal (testing). Otherwise reads from profile.dailyGoalMinutes. */
  goalMinutes?: number;
  /** Hide the inline label, show ring only. */
  compact?: boolean;
  className?: string;
};

export default function DailyGoalDial({
  todayMinutes,
  goalMinutes,
  compact,
  className,
}: Props) {
  const [state, setState] = useState<{ minutes: number; goal: number } | null>(
    todayMinutes !== undefined && goalMinutes !== undefined
      ? { minutes: todayMinutes, goal: goalMinutes }
      : null,
  );

  useEffect(() => {
    if (todayMinutes !== undefined && goalMinutes !== undefined) return;
    function read() {
      const p = loadProgressV2();
      const minutes =
        todayMinutes ?? Math.round((p.streak?.todayXp ?? 0) / XP_PER_MINUTE);
      const goal = goalMinutes ?? p.profile?.dailyGoalMinutes ?? 10;
      setState({ minutes, goal });
    }
    read();
    function onChange() {
      read();
    }
    window.addEventListener("code-killa:progress-v2", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("code-killa:progress-v2", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [todayMinutes, goalMinutes]);

  if (!state) {
    return (
      <span
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-full border border-ink-800 bg-ink-950",
          className,
        )}
        aria-hidden
      />
    );
  }

  const { minutes, goal } = state;
  const reached = minutes >= goal && goal > 0;
  // Cap visible fill at 100% so ring doesn't overshoot. "Banked" minutes get a `+`.
  const pct = goal > 0 ? Math.min(1, minutes / goal) : 0;
  const banked = reached && minutes > goal;

  // Conic-gradient ring: ember while ramping up, signal at-or-past goal.
  const fillColor = reached ? "var(--color-signal)" : "var(--color-ember-500)";
  const ringStyle = {
    background: `conic-gradient(${fillColor} ${pct * 360}deg, var(--color-ink-800) 0deg)`,
  };

  const label = reached
    ? `Today: ${minutes} min — floor cleared${banked ? ", banking ember" : ""}`
    : `Today: ${minutes} of ${goal} min`;

  return (
    <div
      className={cn("inline-flex items-center gap-2", className)}
      title={label}
      aria-label={label}
    >
      <span
        role="img"
        aria-hidden
        className="relative inline-flex h-7 w-7 items-center justify-center rounded-full"
        style={ringStyle}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink-950 text-[10px] font-medium text-ink-200">
          {reached ? <Sun size={12} className="text-signal" /> : minutes}
        </span>
        {banked && (
          <span
            aria-hidden
            className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-ember-500"
          />
        )}
      </span>
      {!compact && (
        <span className="text-xs text-ink-400">
          <span className="text-ink-200 font-medium">{minutes}</span>
          <span className="text-ink-600"> / {goal} min</span>
        </span>
      )}
    </div>
  );
}
