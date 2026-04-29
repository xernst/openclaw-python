---
xp: 1
estSeconds: 30
concept: assignment-operator
code: |
  user_score = 7
  print(user_score)

  user_score = 12
  print(user_score)
---

# `=` doesn't mean what it does in math

In math, `=` is a comparison: *the left side equals the right side*.

In Python, `=` is **assignment**: *take the value on the right, give it the
name on the left, replacing whatever was there before.*

Run the code on the right. Notice the value of `user_score` changes between
the two `print` calls. The variable is a *box you can put a new thing in*, not
a permanent definition.

This is the bug that hits non-coders most: when AI rebinds a variable mid-function,
people read it as a contradiction instead of a re-assignment.
