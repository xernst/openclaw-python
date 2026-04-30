---
xp: 1
estSeconds: 120
concept: context-management
code: |
  # a tiny stand-in for a session log. each entry is one turn.
  session = [
      {"turn": 1, "kind": "feature", "tokens": 800},
      {"turn": 2, "kind": "feature", "tokens": 1100},
      {"turn": 3, "kind": "debug",   "tokens": 2400},
      {"turn": 4, "kind": "debug",   "tokens": 3100},
      {"turn": 5, "kind": "refactor","tokens": 4200},
      {"turn": 6, "kind": "feature", "tokens": 5800},
  ]

  total = sum(t["tokens"] for t in session)
  print(f"turns: {len(session)} | total tokens: {total}")
  print("kinds in window:", sorted({t["kind"] for t in session}))
runnable: true
---

# Long context windows still rot

Modern models advertise million-token windows. You can read all of
*Hamlet* and have room left over. So why does AI start making weird
decisions four hours into a long Cursor session — using a deprecated
helper you removed two hours ago, mixing up `User` and `UserProfile`,
introducing a bug you already fixed?

Run the editor on the right. That session log is a toy version of what
Cursor or Claude Code is carrying around — a growing pile of turns,
each one full of tokens, each turn pulling the model's attention in a
slightly different direction.

The window doesn't *truncate* — that part works. But the model's
attention does *dilute*. By turn 6, the model has to pull signal out of
a soup that includes a deleted helper from turn 1, a stack trace from
turn 3, and three different refactor attempts from turn 5. Even a model
with a million-token window has to *choose* what to weight, and choices
get noisy when the inputs do.

## The two failure modes

Long sessions decay in two distinct ways. Knowing which one you're in
tells you what to do.

**Mode 1: stale context.** The model is using something that's no
longer true. You renamed `Order` to `OrderRecord` an hour ago. The
model still calls it `Order`. The fix isn't a better prompt — it's a
fresh session with the *current* file pasted in.

**Mode 2: drift.** The model started solving the right problem and
slowly slid sideways. You asked for a bug fix, it fixed the bug and
also rewrote three unrelated functions. The fix here is the *plan-first
prefix* (next paragraph) before the next prompt.

## The plan-first prefix

This is the single highest-ROI prompt move you'll learn this lesson:

```
Before writing any code, write a 5-line plan for what you'll change
and which files. Wait for me to approve. Then implement.
```

Drop that into any non-trivial request and three things happen:

1. The model articulates its intent in a form you can read in 20
   seconds, before any code gets written.
2. You catch wrong assumptions cheaply (you say "no, don't touch X" and
   it adapts before generating).
3. When the diff lands, you can compare it against the plan — drift
   becomes visible.

Use the prefix any time the change touches more than one file or
involves logic you can't fit on one screen.

## When to start fresh

Three signals you should kill the session and open a new one:

1. **The model references a file or symbol that no longer exists.**
   Pure stale context. New session, paste the current file, restate the
   goal.
2. **It's hallucinating function signatures.** Especially common with
   library upgrades. The model is averaging across versions in its
   training data. New session with the current `requirements.txt` or
   `package.json` pasted in.
3. **You've said "no, that's wrong" twice in a row.** The session has a
   wrong working theory baked in. Anything you say now fights that
   theory. Start over.

## What about Claude Code's `/clear` and `/compact`?

Same idea, lower friction. `/clear` starts a fresh conversation with
empty context — your `CLAUDE.md`, skills, and `settings.json` persist
because they live on disk, not in the chat. Use it freely.

For mid-task context relief without losing the thread, reach for
`/compact` instead — it summarizes the conversation so far and keeps
going. `/compact` is the more idiomatic move when you're not done but
the buffer is heavy. `/clear` is for "I'm starting something new."

You're not losing progress either way — the *files* are the progress.
The chat is a means.

## How AI specifically gets this wrong

When AI suggests "let me continue where we left off" after a long gap,
that's a tell. The model has no memory between sessions; it only sees
what's in *this* turn. If "where we left off" isn't visible in the
current conversation or the current files, it's making something up.
Don't reward that. Restate the goal as if from scratch.
