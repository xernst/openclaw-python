---
xp: 1
estSeconds: 30
concept: try-except-introduction
code: |
  try:
      result = int("42")
      print(result)
  except ValueError:
      print("not a number")
runnable: true
---

# `try/except` — the seatbelt AI forgets to put on

Every script has lines that *might* fail. Reading a file that doesn't exist.
Parsing a string that isn't a number. Calling an API that times out.

Python's built-in answer is `try/except`: run the risky line, and if it
explodes, catch the explosion and decide what to do next.

When AI writes code, it tends to write the happy path and leave you to add
the seatbelt. That's the gap this chapter closes.

Hit **Run** on the editor. The string `"42"` parses fine, so the `except`
block never fires. We'll break it on purpose in a moment.
