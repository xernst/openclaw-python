---
xp: 1
estSeconds: 30
concept: for-loop-over-list
code: |
  pets = ["luna", "moose", "biscuit"]
  for pet in pets:
      print(pet)
runnable: true
---

# A loop is whatever AI writes when you say *for each*

If you've ever asked Claude *go through every row in this CSV and...*, that
"go through every" is a loop.

The shape on the right:

- `for pet in pets:` — start a loop. `pet` is the temporary name for whatever
  item the loop is on right now.
- `print(pet)` — runs once per item, with `pet` rebound each trip.

Hit **Run**. The same `print(pet)` line runs three times — once with `pet`
as `"luna"`, once as `"moose"`, once as `"biscuit"`.
