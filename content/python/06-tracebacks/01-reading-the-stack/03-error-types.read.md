---
xp: 1
estSeconds: 60
concept: common-error-types
code: |
  # The five errors AI ships most often:
  #
  # NameError       — used a variable that doesn't exist
  # TypeError       — wrong type for the operation (e.g. "5" + 10)
  # KeyError        — asked a dict for a key it doesn't have
  # IndexError      — asked a list for an index past its end
  # AttributeError  — called a method on the wrong type (e.g. None.upper())
---

# The five errors you'll see ninety percent of the time

Each one tells you *exactly* what went wrong. Memorize the translation
once and you'll never panic at a traceback again.

| Error | Plain English |
| --- | --- |
| `NameError` | A variable name that doesn't exist. Usually a typo. |
| `TypeError` | The operation doesn't work on this type. Like `"5" + 10`. |
| `KeyError` | A dict doesn't have the key you asked for. |
| `IndexError` | A list isn't long enough for the index you asked for. |
| `AttributeError` | You called `.something()` on the wrong type — usually `None`. |

When AI hands you crashing code, the error type is the first hint. If you
see `KeyError`, don't read the whole codebase — just check what key got
asked for and what the dict actually has.
