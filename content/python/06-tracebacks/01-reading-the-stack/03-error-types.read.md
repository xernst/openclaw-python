---
xp: 1
estSeconds: 100
concept: common-error-types
code: |
  # The five errors AI ships most often.
  # The class alone tells you what kind of bug to look for.
  #
  # NameError       — used a variable that doesn't exist
  # TypeError       — wrong type for the operation (e.g. "5" + 10)
  # KeyError        — asked a dict for a key it doesn't have
  # IndexError      — asked a list for an index past its end
  # AttributeError  — called a method on the wrong type (e.g. None.upper())
---

# The five errors you'll see ninety percent of the time

Python has dozens of built-in error classes. AI-generated code, in
practice, hits maybe five of them again and again. If you can
recognize those five on sight, you can diagnose almost any crash in
the first second of reading the traceback — *before* you read the
message, *before* you check the line number.

This is one of those force multipliers that turns "AI's code is
broken and I have no idea what's wrong" into "oh, that's a `KeyError`,
let me check the JSON shape."

## The five core errors and what they actually mean

| Error | Plain English | Where it comes from |
| --- | --- | --- |
| `NameError` | A variable name that doesn't exist | Typo in a variable name, forgot an `import`, used something before defining it |
| `TypeError` | The operation doesn't work on this type | Mixed types (`"5" + 10`), passed `None` where a value was expected, wrong number of args to a function |
| `KeyError` | A dict doesn't have the key you asked for | Typoed key, key missing from API response, capitalization mismatch |
| `IndexError` | A list isn't long enough | Off-by-one bug, list came back empty, asked for `items[5]` on a 3-item list |
| `AttributeError` | You called a method on the wrong type | Almost always `None.something()` — a function returned `None` and you tried to use it |

Read the table once. Come back to it whenever a crash surprises you.
Within a week the translation is automatic.

## The diagnostic shortcut

Each error class is a *fingerprint* — a signal of which kind of bug
you're looking at, before you even read the message. When AI hands
you a stack trace:

- **See `NameError`?** It's a typo or a missing import. Look at the
  exact name in the error and search the file for it.
- **See `TypeError`?** Something is the wrong type. Often `None`
  showing up where a value should be — which means a function
  returned `None` instead of what you expected. Hello, return-vs-print
  bug from chapter 2.
- **See `KeyError`?** A dict is missing a key. Either the key is
  typoed in the code, or the data shape isn't what AI assumed.
  Print the dict's keys and compare.
- **See `IndexError`?** A list is shorter than expected. Empty list,
  off-by-one, range mismatch.
- **See `AttributeError`?** You called `.something()` on something
  that didn't have it. Usually `None`. Find the function whose
  return value you used and check why it gave you nothing.

## Where AI specifically gets each one wrong

Cursor doesn't just *read* these errors — it also *generates* them
predictably:

- **`NameError` from refactor drift.** AI renames a variable in one
  spot and forgets the other usage. The script crashes the first
  time it hits the unrenamed line.
- **`TypeError` from `None` propagation.** AI writes a function with
  a missing `return`. Calling code uses the result, blows up on the
  next operation. Symptom is a `TypeError` two lines downstream of
  the actual bug.
- **`KeyError` from optimistic API shape assumptions.** AI writes
  `response["data"]["users"]` based on the docs — but the live API
  returned `{"error": "rate limited"}`. No `"data"` key, no
  defensive check, instant crash.
- **`AttributeError: NoneType has no attribute X`.** The all-time
  champion of Python bugs. Some function returned `None`. Find which
  one. The fix is usually upstream of where the crash is.

## The two extras you'll also see

Two more errors that don't make the top-five but appear weekly:

- **`ValueError`** — right type, wrong content. `int("hello")`. The
  argument *type* is correct, but the *value* can't be converted.
- **`ZeroDivisionError`** — divided by zero. Almost always means the
  denominator came from a count that was empty.

When you see these, the fix is content validation, not type
validation. We have a whole lesson on those two coming up next.
