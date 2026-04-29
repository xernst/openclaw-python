---
xp: 2
estSeconds: 55
concept: zip-pairs-and-mismatch
code: |
  cities = ["austin", "berlin", "tokyo"]
  zones = ["CST", "CET"]

  # zip stops at the shorter list — tokyo is silently dropped
  for city, zone in zip(cities, zones):
      print(city, zone)
---

# `zip` walks two lists in lockstep

`zip(a, b)` builds tuples `(a[0], b[0])`, `(a[1], b[1])`, and so on.
It's how AI lines up parallel data: names + scores, columns + values,
inputs + expected outputs.

The trap: **`zip` stops at the shorter list**. If `cities` has three
entries and `zones` has two, you only get two iterations. The third
`city` is silently dropped — no warning, no error.

When AI writes `zip` over data of unknown length, this is the bug to look
for. If you need *every* element, check the lengths first or use
`itertools.zip_longest`.

Run the editor. Two iterations, even though `cities` has three items.
