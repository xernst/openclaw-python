---
xp: 1
estSeconds: 40
concept: zero-based-indexing
code: |
  pets = ["luna", "moose", "biscuit"]

  print(pets[0])
  print(pets[1])
  print(pets[2])
  print(pets[-1])
---

# Indexing starts at zero, and `-1` is the last item

Two rules you'll trip over once and never again:

- **Lists count from `0`**, not `1`. The first item is `pets[0]`.
- **Negative numbers count from the end.** `pets[-1]` is the last item,
  no matter how long the list is.

Run the code. The script prints `luna`, `moose`, `biscuit`, then `biscuit`
again — because `[-1]` and `[2]` happen to point at the same spot in this
3-item list.

This is one of the top off-by-one bugs AI ships: it'll write `for i in range(1, len(items))` when it meant `range(len(items))`, skipping the first item silently.
