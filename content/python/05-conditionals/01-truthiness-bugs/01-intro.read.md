---
xp: 1
estSeconds: 35
concept: if-statement-shape
code: |
  score = 92

  if score >= 90:
      print("excellent")
  elif score >= 70:
      print("good")
  else:
      print("needs work")
runnable: true
---

# `if` is a fork in the road

When you tell Cursor *only do X if Y*, the thing it reaches for is an `if`
statement.

The shape on the right is the standard three-branch fork:

- `if score >= 90:` — try this first
- `elif score >= 70:` — only if the first was false, try this
- `else:` — otherwise, do this

Hit **Run**. Only one branch fires per trip. The colon at the end of each
header is non-optional — that's the punctuation that starts a block.
