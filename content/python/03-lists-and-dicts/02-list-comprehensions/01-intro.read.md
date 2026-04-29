---
xp: 1
estSeconds: 40
concept: list-comprehension-shape
code: |
  prices = [10, 20, 30]

  # the long way
  with_tax = []
  for p in prices:
      with_tax.append(p * 1.1)

  # the same thing as a comprehension
  with_tax_short = [p * 1.1 for p in prices]

  print(with_tax)
  print(with_tax_short)
runnable: true
---

# The one-liner AI loves

When AI generates a "transform every item in this list" snippet, it almost
never writes the four-line `for` loop. It writes a **list comprehension** —
the same idea collapsed onto one line.

The shape on the right shows both forms doing the same job. Read them as:

- *"a new list, where each item is `p * 1.1`, for every `p` in `prices`"*

Run the code. Both lines print the same list. The comprehension is what
you'll see in 90% of AI-written Python — `[expression for item in iterable]`.

The trap: comprehensions look dense at first. The trick is reading them
**left to right** as plain English, not as code.
