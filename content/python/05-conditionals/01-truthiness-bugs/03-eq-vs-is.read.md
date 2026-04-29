---
xp: 1
estSeconds: 45
concept: eq-vs-is
code: |
  a = [1, 2, 3]
  b = [1, 2, 3]

  print(a == b)
  print(a is b)
---

# `==` and `is` are not the same comparison

This is the bug Claude ships when it writes `if x is "done"`. It looks fine.
It works on small examples. It silently breaks later.

- `==` asks: *do these have the same value?*
- `is` asks: *are these the exact same object in memory?*

Run the code on the right. Both `a` and `b` are lists with `[1, 2, 3]` —
same value, but two separate lists in memory.

- `a == b` is `True` because the contents match.
- `a is b` is `False` because they're two different lists.

Rule of thumb: use `==` for everything except `None`. The one place `is`
belongs: `if x is None:`. Anywhere else, AI is hallucinating.
