---
xp: 1
estSeconds: 100
concept: error-class-diagnostic
code: |
  # Each error class is a fingerprint. The class alone tells you
  # what kind of bug to look for, before you even read the message.
  #
  # NameError       — variable doesn't exist (typo or missing import)
  # TypeError       — wrong type for the operation
  # KeyError        — dict missing a key
  # IndexError      — list shorter than expected
  # AttributeError  — method called on the wrong type (usually None)
  #
  # Two more you'll see weekly:
  # ValueError      — right type, wrong content
  # ZeroDivisionError — divided by zero
---

# The error class is the fingerprint

Last lesson you saw the five most common error types in Python. This
one is about turning that knowledge into a debugging *reflex*: the
moment you see the class name in a traceback, you should already
know which corner of the code to look at, before you read another
character.

This is the difference between "I see a wall of red text and feel
defeated" and "oh, `KeyError: 'data'`, the API response shape changed."
The class is the fingerprint. The message is just confirmation.

## The decoder ring

Each class points at a specific kind of bug. Memorize the mapping:

| Class | Cause | Where to look |
| --- | --- | --- |
| `NameError` | Variable doesn't exist | Typo in the variable name, forgotten `import`, scope mistake |
| `TypeError` | Wrong type for an operation | A function returned `None`, mixed `str` and `int`, wrong number of args |
| `KeyError` | Dict missing a key | Typoed key, missing JSON field, capitalization mismatch |
| `IndexError` | List too short | Off-by-one, empty list, length mismatch with another list |
| `AttributeError` | Method on the wrong type | Almost always `None.something()` — a function gave you nothing |

The two extras worth knowing:

| Class | Cause | Where to look |
| --- | --- | --- |
| `ValueError` | Right type, wrong content | `int("hello")`, parsing user input that isn't well-formed |
| `ZeroDivisionError` | Divided by zero | Denominator came from an empty count or sum |

## A worked example: reading the class first

Suppose Cursor wrote this code and it crashed:

```python
def get_email(user):
    return user["email"]

users = fetch_users()
emails = [get_email(u) for u in users]
```

The traceback ends in:

```
KeyError: 'email'
```

Stop. You've already seen enough.

`KeyError` means: *a dict doesn't have the key being requested.* The
key being requested is `'email'`. So somewhere in `users`, there's a
dict that doesn't have an `"email"` field.

You don't need to read the rest of the traceback to know what to do
next: print one of the user dicts and see what keys it actually has.
Maybe the field is `"emailAddress"` or `"email_address"`. Maybe one
record is missing the field entirely. Either way, the *direction* of
the fix was set by the class alone.

## Where AI specifically gets these wrong

Cursor often misdiagnoses errors when it can only see the *message*
and not the *full traceback*. If you paste it just `KeyError: 'data'`,
it'll guess at fixes — often correctly, sometimes by adding defensive
`.get()` calls everywhere when only one was needed.

The lesson here: when AI gives you a fix and the error is one of
these classes, double-check the diagnosis. A `TypeError: 'NoneType'
object is not subscriptable` is *almost always* upstream of where it
crashed — some function returned `None`. The right fix is to find
*which* function and *why*, not to wrap the crash site in a
`try/except`.

## The reflex to build

For the next month, every time you see a traceback:

1. Read the *last line first* — the class plus the message.
2. Identify the class. Use the table above to know what kind of bug
   it is.
3. Form a one-sentence hypothesis: *"a dict is missing a key"* or
   *"a function returned None."*
4. *Then* look at the line numbers and source code to confirm.

The class is doing 80% of the diagnostic work for you. Use it.
