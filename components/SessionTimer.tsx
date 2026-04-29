"use client";
// ADHD rule #5: visible session timer (now is real), invisible deadlines.
// Just shows how long you've been on this page. No countdowns, no "left today" pressure.

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function SessionTimer() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return (
    <span title="Time on this lesson" className="inline-flex items-center gap-1 text-xs text-ink-500 tabular-nums">
      <Clock size={12} />
      {m}:{String(s).padStart(2, "0")}
    </span>
  );
}
