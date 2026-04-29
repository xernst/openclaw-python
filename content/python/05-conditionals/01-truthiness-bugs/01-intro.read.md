---
xp: 1
estSeconds: 90
concept: if-statement-shape
code: |
  score = 92

  if score >= 90:
      print("excellent")
  elif score >= 70:
      print("good")
  else:
      print("needs work")
runnable: true
---

# `if` is a fork in the road — and AI uses it to encode every business rule

If you've ever asked Cursor *only run this when the user is signed in*,
*charge a fee if the order is over $100*, *show the warning when the
score is below 60* — the thing AI reaches for is an `if` statement.
This is how every conditional rule in your code gets expressed.

`if` is the entire grammar of business logic. Once you can read one,
you can read every signup flow, every pricing rule, every permissions
check Cursor will ever write you.

## The mental model: ordered checks, exactly one branch wins

```python
if score >= 90:
    print("excellent")
elif score >= 70:
    print("good")
else:
    print("needs work")
```

Read this top-to-bottom, like a flowchart:

1. **`if` is checked first.** Python evaluates `score >= 90`. If
   `True`, it runs that block and *skips the rest entirely*.
2. **`elif` is checked next, but only if the previous condition was
   false.** You can stack as many `elif`s as you want.
3. **`else` is the catch-all.** It runs only if every condition above
   failed. It has no condition of its own — just a colon.

The hard rule: **exactly one branch runs per trip.** The first
condition that's true wins. Everything below it gets skipped, even if
its condition would also be true.

## A worked example

The editor on the right has `score = 92`. Trace what happens:

| Step | Condition | Result | What runs |
|------|-----------|--------|-----------|
| 1    | `score >= 90` | `True` | `print("excellent")` |
| 2    | `elif score >= 70` | (skipped) | — |
| 3    | `else` | (skipped) | — |

Output: `excellent`. The `elif` would have been true too — `92 >= 70`
is `True` — but Python never checked it, because the `if` already won.

## Why ordering matters more than people expect

Look what happens if you flip the conditions:

```python
if score >= 70:
    print("good")
elif score >= 90:
    print("excellent")
```

Now *every* score 70 or higher prints `"good"`. The `excellent` branch
is unreachable, because anything that matches `>= 90` also matches
`>= 70`, and the first true branch wins.

This is a real bug in real AI-generated code. When Cursor writes `if`
chains over numeric ranges, it sometimes orders them lowest-to-highest
when they should be highest-to-lowest. The script "works" — no
crash — but the output is silently wrong.

## Where AI specifically gets `if` wrong

Three patterns to flag in code Cursor writes:

1. **Forgetting the colon.** `if score >= 90` (no colon) is a
   `SyntaxError`. AI almost never makes this mistake, but you might,
   so it's worth knowing what the error message looks like.

2. **Indenting the body wrong.** Python decides what's "inside" the
   `if` purely by indentation. Mix tabs and spaces, or under-indent
   one line, and the block silently means something different. Cursor
   almost always uses 4 spaces; trouble starts when you copy-paste
   code from somewhere else and the indentation doesn't match.

3. **Conditions in the wrong order.** The flip we just walked through.
   When you read AI-generated `if/elif` chains over numeric ranges,
   read them top to bottom and ask: *"could a value in branch 2 also
   match branch 1?"* If yes, the order is fragile — branch 2 might
   never run.

Run the editor. With `score = 92`, only `excellent` prints. The other
branches are silent — they were never even checked.
