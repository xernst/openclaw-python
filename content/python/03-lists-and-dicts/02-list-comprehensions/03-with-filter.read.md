---
xp: 1
estSeconds: 45
concept: comprehension-filter
code: |
  scores = [55, 91, 72, 40, 88, 65]

  # keep only the passing scores
  passing = [s for s in scores if s >= 70]

  # double every score, but only the passing ones
  doubled = [s * 2 for s in scores if s >= 70]

  print(passing)
  print(doubled)
---

# Comprehensions can filter, too

Tack an `if` onto the end and the comprehension only keeps the items that
pass the test.

The pattern grows by one piece:

```
[expression for item in iterable if condition]
```

Read it as: *"a new list, where each item is `expression`, for every `item`
in `iterable`, but only when `condition` is true."*

Run the code on the right.

- `passing` keeps only scores ≥ 70 → `[91, 72, 88]`
- `doubled` does the same filter, then doubles each one → `[182, 144, 176]`

This is the Swiss-army knife AI reaches for whenever the prompt has the
words *"only the ones that..."* in it.
