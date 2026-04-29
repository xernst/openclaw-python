---
xp: 1
estSeconds: 40
concept: range-function
code: |
  for i in range(3):
      print(i)

  print("---")

  for i in range(1, 4):
      print(i)
---

# `range` makes numbers, and the end is *exclusive*

When you don't have a list to walk through and just want to do something
*N times*, AI reaches for `range`.

Two rules that catch every newcomer:

- `range(3)` produces `0, 1, 2` — three numbers, starting at zero.
- `range(1, 4)` produces `1, 2, 3` — the **second number is the stop, and
  Python stops *before* it**, never on it.

Run the code. The first loop prints `0, 1, 2`. The second prints `1, 2, 3`.
The `4` never appears.

This off-by-one is the single most common loop bug AI ships. Whenever a
range looks "one short" or "one over," check the `range()` boundaries first.
