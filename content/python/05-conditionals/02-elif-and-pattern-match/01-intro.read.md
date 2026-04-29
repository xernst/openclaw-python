---
xp: 1
estSeconds: 100
concept: elif-chain
code: |
  status_code = 404

  if status_code == 200:
      print("ok")
  elif status_code == 301:
      print("redirect")
  elif status_code == 404:
      print("not found")
  elif status_code == 500:
      print("server error")
  else:
      print("unknown")
runnable: true
---

# `elif` is "otherwise, check this" — and ordering is everything

When you ask Cursor for *handle each HTTP status differently*, *route
the request based on its type*, *show a different message for each
plan tier* — the shape it reaches for is an `if/elif/else` chain.
This is the most common multi-way decision in any AI-generated
script.

The mechanics are simple. The trap is in the ordering. We'll cover
both.

## The mental model: top-down, first-match-wins

```python
if status_code == 200:
    print("ok")
elif status_code == 301:
    print("redirect")
elif status_code == 404:
    print("not found")
elif status_code == 500:
    print("server error")
else:
    print("unknown")
```

Read it as a series of "otherwise, try this" steps:

1. Python checks `status_code == 200`. If true, `print("ok")` runs and
   the rest of the chain is skipped. Done.
2. If false, it moves to `status_code == 301`. If true, run that
   block, skip the rest.
3. Keep cascading down until either a condition is true or the chain
   reaches `else`.
4. **`else` runs only if every preceding condition was false.** It's
   not optional in style — but it is optional in syntax. You can leave
   it off, in which case "no condition matched" simply runs nothing.

The hard rule, again: **the first true condition wins**. Everything
below it is dead code on that pass.

## A worked example

The editor has `status_code = 404`. Trace each check:

| Step | Condition | Result |
|------|-----------|--------|
| 1 | `status_code == 200` | False, skip |
| 2 | `status_code == 301` | False, skip |
| 3 | `status_code == 404` | **True**, run `print("not found")`, exit chain |
| 4 | `status_code == 500` | (never checked) |
| 5 | `else` | (never checked) |

Output: `not found`. Notice that Python *stops checking* the moment
it finds the first true branch. The `500` and `else` blocks are
dead code on this pass — they were never even evaluated.

## Where AI specifically gets `elif` chains wrong

The single biggest bug in AI-generated `if/elif` is **putting a
broader condition before a narrower one**. Compare these two chains:

```python
# Wrong — the second branch never runs
if score >= 70:
    print("good")
elif score >= 90:
    print("excellent")
```

Anything `>= 90` is also `>= 70`, so the first branch always wins for
high scores. The `elif` is unreachable. Cursor writes this when it
generates conditions in an order that "feels natural" (low to high)
without thinking about which condition strictly contains the others.

```python
# Right — narrower conditions go first
if score >= 90:
    print("excellent")
elif score >= 70:
    print("good")
```

Now `>= 90` is checked first. Anything that matches takes that branch
and exits. Only scores between 70 and 89 reach the `elif`.

Two more patterns to watch for:

1. **Mutually exclusive vs. overlapping conditions.** When the
   conditions are equality checks against distinct values
   (`status_code == 200`, `== 301`, `== 404`), order doesn't matter
   logically — only one can ever be true. When the conditions are
   *ranges* or *contains-checks*, order matters a lot.

2. **Forgetting `else`.** Cursor sometimes ships an `if/elif` chain
   with no `else`, and the result is silent. If you read AI code with
   no `else` branch, ask: *what should happen for cases I didn't list?*
   If the answer is "nothing," the missing `else` is fine. If the
   answer is "log a warning" or "raise an error," the missing `else`
   is a bug.

Run the editor. With `status_code = 404`, only `not found` prints.
The chain runs in order until it hits the first true branch.
