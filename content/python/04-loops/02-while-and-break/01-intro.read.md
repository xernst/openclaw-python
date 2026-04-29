---
xp: 1
estSeconds: 40
concept: while-loop
code: |
  count = 3
  while count > 0:
      print(f"countdown: {count}")
      count -= 1

  print("liftoff")
runnable: true
---

# `while` keeps going until the condition flips

A `for` loop runs once per item in a collection. A `while` loop runs as long
as a condition is `True`. When the condition becomes `False`, the loop stops
and the script moves on.

When you tell Cursor *"keep retrying until the API responds"* or *"loop
until the user types quit,"* the thing it reaches for is `while`.

The shape on the right reads as:

- `while count > 0:` — keep going as long as `count` is positive
- `count -= 1` — make the condition closer to false each pass

Hit **Run**. Three iterations, then liftoff.

The trap: if the body never changes the condition, the loop never ends.
That's the bug we're learning to spot.
