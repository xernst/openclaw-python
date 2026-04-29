// Client-side grader helpers. Mirrors the Zod-validated grader shapes from
// lib/content/schema.ts. Used by step views that submit code through the
// persistent IDE bridge.

import type { Grader } from "@/lib/content/schema";
import type { RunResult } from "../PersistentIDE";

export function normalizeStdout(
  raw: string,
  rule: "trim" | "collapse-trailing-newline" | "none",
): string {
  switch (rule) {
    case "trim":
      return raw.trim();
    case "collapse-trailing-newline":
      return raw.replace(/\n+$/g, "");
    case "none":
    default:
      return raw;
  }
}

export function normalizeString(
  raw: string,
  rule: "trim" | "collapse-ws" | "lower" | "none",
): string {
  switch (rule) {
    case "trim":
      return raw.trim();
    case "collapse-ws":
      return raw.trim().replace(/\s+/g, " ");
    case "lower":
      return raw.toLowerCase();
    case "none":
    default:
      return raw;
  }
}

/** Grade a stdout-shaped result against the canonical grader. */
export function gradeRunResult(grader: Grader, result: RunResult): GradeResult {
  if (grader.kind === "stdout-equality") {
    if (!result.ok || result.stderr) {
      return { passed: false, reason: result.stderr || "Code didn't finish — see the traceback." };
    }
    const got = normalizeStdout(result.stdout, grader.normalize);
    const expected = normalizeStdout(grader.expected, grader.normalize);
    return got === expected
      ? { passed: true }
      : {
          passed: false,
          reason: `Output didn't match. Got "${truncate(got)}", expected "${truncate(expected)}".`,
        };
  }
  if (grader.kind === "string-equality") {
    // Falls through; views that use this grader pass user input as result.stdout
    const expected = Array.isArray(grader.expected) ? grader.expected : [grader.expected];
    const got = normalizeString(result.stdout, grader.normalize);
    const matched = expected.some(
      (e) => normalizeString(e, grader.normalize) === got,
    );
    return matched ? { passed: true } : { passed: false, reason: "That answer didn't match." };
  }
  if (grader.kind === "ast-match") {
    return {
      passed: false,
      reason: "AST graders aren't wired client-side yet — Submit needs a stdout grader for now.",
    };
  }
  return {
    passed: false,
    reason: "This step uses a grader the v1 runtime doesn't support yet.",
  };
}

export type GradeResult =
  | { passed: true }
  | { passed: false; reason: string };

function truncate(value: string, max = 80): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}…`;
}
