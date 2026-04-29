---
xp: 1
estSeconds: 30
concept: function-definition
code: |
  def double(n):
      return n * 2

  print(double(7))
runnable: true
---

# Functions — and the line AI forgets

A **function** is a named piece of code you can re-run with different inputs.
When AI hands you the same 30-line block twice, it's missing a function.

The shape on the right is the one you'll read all day:

- `def double(n):` — define a function called `double` that takes one input
- `return n * 2` — hand back the answer to whoever called it
- `double(7)` — call the function with `7` as the input

Hit **Run**. The `print` shows what `double(7)` handed back.
