---
xp: 1
estSeconds: 100
concept: break-continue
code: |
  # break stops the loop entirely
  for n in range(10):
      if n == 4:
          break
      print(f"n: {n}")

  print("---")

  # continue skips the rest of this pass and goes to the next
  for n in range(5):
      if n == 2:
          continue
      print(f"m: {n}")
---

# `break` ends the loop. `continue` skips one pass.

Two more loop-control keywords. They're small, they're everywhere in
AI-generated code, and they cause exactly one specific bug each. Once
you know which is which, you can read any loop Cursor writes you in
seconds.

Both work in `for` loops. Both work in `while` loops. The difference
is one stops the *whole* loop, and one only stops the *current pass*.

## The two moves, side by side

```python
break       # leave the loop right now, don't finish the rest of the body,
            # and don't run any more iterations.

continue    # skip the rest of *this iteration's* body, and jump straight
            # to the next iteration.
```

Read them as *exit* vs. *next*.

- `break` — *we're done here, get out.*
- `continue` — *not this one, move on to the next.*

## The worked example

The editor on the right has both. Trace each one:

**Loop 1 (`break`):**

```python
for n in range(10):
    if n == 4:
        break
    print(f"n: {n}")
```

`range(10)` would normally run ten times. But on the iteration where
`n` is `4`, the `if` triggers and `break` fires. The loop exits
*before* `print` runs. The output is `n: 0`, `n: 1`, `n: 2`, `n: 3`.
Then nothing. The `4` never prints, and `5` through `9` never even
get reached.

**Loop 2 (`continue`):**

```python
for n in range(5):
    if n == 2:
        continue
    print(f"m: {n}")
```

`range(5)` runs five times. On every iteration, the `if` checks. When
`n` is `2`, `continue` fires — Python skips the rest of the body for
this pass and starts the next iteration. The output is `m: 0`, `m: 1`,
`m: 3`, `m: 4`. The `2` is missing, but the loop keeps going.

## When AI reaches for each

Specific phrases in your prompt trigger specific keywords:

- *"…until you find one that…"* → `break`. AI loops the collection,
  checks each item, and `break`s the moment a match shows up.
- *"…skip the bad ones and keep going"* → `continue`. AI loops, checks
  each item, and `continue`s past the failures.

Both are common. Both are easy to read once you know the difference.

## Where AI specifically gets these wrong

1. **`break` inside an always-true condition.** Cursor sometimes writes
   `if True: break` (or worse, a condition that *looks* like it could
   be false but never is — `if user is not None:` when user is checked
   earlier). The loop runs exactly once. If you see a loop body whose
   first move is a `break` not guarded by a meaningful check, that's
   the bug.

2. **`continue` doing nothing useful.** Sometimes AI generates code
   like:
   ```python
   for x in items:
       if x is None:
           continue
       else:
           process(x)
   ```
   That works, but the `else` is redundant — `continue` already skipped
   the rest. Cleaner Python:
   ```python
   for x in items:
       if x is None:
           continue
       process(x)
   ```
   Worth flagging when you read it.

3. **Confusing `break` and `return` inside a function.** Inside a
   function body, `return` exits the *function*, not just the loop.
   `break` exits *only* the loop. Cursor sometimes writes `break` when
   it meant to leave the function, or `return` when it meant to exit
   the loop and keep running the surrounding code. Read the indentation
   carefully — the keyword you want depends on what you're trying to
   exit.

Run the editor. Loop 1: four lines printed, then nothing. Loop 2:
four lines, with the `2` missing in the middle.
