// Streak logic — boot.dev's ember + frozen-flame pattern, tuned for ADHD.
// - Streak day = at least one exercise passed OR ≥10 XP earned.
// - Embers: 1 earned for every 30 XP/day, max 2 stored. Spent BEFORE flames
//   when a day is missed, so effectively a "5-day-a-week" streak.
// - Frozen flames: granted on chapter completion (not bought with gems —
//   we have no gem economy on purpose). Max 4. Each protects one missed day.
// - Welcome-back: if the streak is broken, we never show "you lost X days" —
//   we show "welcome back, here's where you were."

import type { GlobalProgress, StreakState } from "./types";
import { FRESH_STREAK, todayISO, updateProgress } from "./storage";

const XP_PER_PASS = 10;
const XP_PER_EMBER = 30;
const MAX_EMBERS = 2;
const MAX_FROZEN_FLAMES = 4;

function daysBetween(a: string, b: string): number {
  if (!a || !b) return Infinity;
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / 86_400_000);
}

/** Roll the streak forward to "today" — spending embers/flames if we missed
 *  a day. Idempotent: safe to call on every render. */
function rollStreak(s: StreakState): StreakState {
  const today = todayISO();
  if (!s.lastActivityDate) {
    return { ...s, todayDate: today, todayXp: 0 };
  }
  const gap = daysBetween(s.lastActivityDate, today);
  if (gap <= 0) {
    // Same day or future skew — no roll.
    if (s.todayDate !== today) {
      return { ...s, todayDate: today, todayXp: 0 };
    }
    return s;
  }
  // gap = 1 means yesterday was the last activity → no penalty.
  let embers = s.embers;
  let flames = s.frozenFlames;
  let current = s.current;
  let missed = gap - 1;
  while (missed > 0) {
    if (embers > 0) embers -= 1;
    else if (flames > 0) flames -= 1;
    else {
      current = 0;
      break;
    }
    missed -= 1;
  }
  return {
    ...s,
    embers,
    frozenFlames: flames,
    current,
    todayDate: today,
    todayXp: 0,
  };
}

/** Award a passed-exercise event. Updates XP, streak, embers. */
export function awardPass(): GlobalProgress {
  return updateProgress((p) => {
    const today = todayISO();
    const s0 = rollStreak(p.streak);
    const todayXp = (s0.todayDate === today ? s0.todayXp : 0) + XP_PER_PASS;
    const earnedEmbers = Math.floor(todayXp / XP_PER_EMBER) - Math.floor((todayXp - XP_PER_PASS) / XP_PER_EMBER);
    const embers = Math.min(MAX_EMBERS, s0.embers + Math.max(0, earnedEmbers));
    const isNewActivityDay = s0.lastActivityDate !== today;
    let current = s0.current;
    if (isNewActivityDay) {
      const gap = daysBetween(s0.lastActivityDate || today, today);
      current = gap <= 1 ? s0.current + 1 : 1; // first day of a new run = 1
    }
    const longest = Math.max(s0.longest, current);
    return {
      ...p,
      streak: {
        ...s0,
        lastActivityDate: today,
        current,
        longest,
        embers,
        totalXp: s0.totalXp + XP_PER_PASS,
        todayXp,
        todayDate: today,
      },
    };
  });
}

/** Grant a frozen flame on chapter completion (max 4 stored). */
export function grantFrozenFlame(): GlobalProgress {
  return updateProgress((p) => ({
    ...p,
    streak: {
      ...p.streak,
      frozenFlames: Math.min(MAX_FROZEN_FLAMES, p.streak.frozenFlames + 1),
    },
  }));
}

/** Read-only view: roll forward without persisting. */
export function viewStreak(p: GlobalProgress): StreakState {
  return rollStreak(p.streak);
}

export const STREAK_RULES = {
  XP_PER_PASS,
  XP_PER_EMBER,
  MAX_EMBERS,
  MAX_FROZEN_FLAMES,
};

export { FRESH_STREAK };
