---
xp: 1
estSeconds: 50
concept: error-class-diagnostic
code: |
  # Each error class is a fingerprint. The class alone tells you
  # what kind of bug to look for, before you even read the message.
---

# The error class is the fingerprint

Last lesson you learned the five most common error types. This one teaches
you to use the **class alone** — `NameError`, `TypeError`, etc. — to know
what kind of bug AI shipped, before you even read the message.

Match the class to the cause:

| Class | Cause |
| --- | --- |
| `NameError` | Variable doesn't exist. Look for a typo or a forgotten `import`. |
| `TypeError` | Wrong type for an operation. Look for `str` mixed with `int`, or `None` where a value should be. |
| `KeyError` | Dict missing a key. Look for a typoed key or a missing field in the JSON. |
| `IndexError` | List shorter than expected. Look for an off-by-one or an empty list. |
| `AttributeError` | Method called on the wrong type. Almost always `None.something()`. |

Two more you'll see:

| Class | Cause |
| --- | --- |
| `ValueError` | Right type, wrong content. `int("hello")` is the canonical case. |
| `ZeroDivisionError` | You divided by `0`. Almost always a denominator that came in empty. |

When you see a traceback, glance at the last line and the class tells you
which corner of the codebase to look at. You don't need to read the whole
stack.
