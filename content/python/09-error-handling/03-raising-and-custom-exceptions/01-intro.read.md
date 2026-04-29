---
xp: 1
estSeconds: 100
concept: raising-exceptions
code: |
  def charge(amount):
      if amount <= 0:
          raise ValueError(f"amount must be positive, got {amount}")
      print(f"charging ${amount}")

  charge(50)
  charge(-10)
runnable: true
---

# Raising errors — telling Python to crash on purpose

So far every exception you've seen was raised *by Python itself*: a bad
`int(...)`, a missing dict key, an out-of-range index. But you can also
raise your own. The keyword is `raise`, and it's how you turn a quiet
"the inputs to this function are nonsense" into a loud, traceback-able
crash that points at the exact line that's wrong.

This is the move that separates code that hides bugs from code that
*finds them for you*. Cursor reaches for it inconsistently — sometimes
right, often missing. Reading AI code, the question to ask at the top
of every function is: *what inputs make this function meaningless, and
does it `raise` for them or silently produce garbage?*

## The mental model

`raise` is the inverse of `try/except`. Where `try` says *"if something
goes wrong, here's what to do,"* `raise` says *"something is wrong,
here's what to throw."* The shape:

```python
raise ValueError("amount must be positive")
```

Three parts: the keyword `raise`, an exception class (`ValueError`),
and — usually — a string explaining what's wrong. Python wraps the
message in an instance of the class and propagates it up the call
stack the same way an automatic exception would. Anyone with a
matching `except` catches it. Nobody catches it, the program crashes
with a traceback.

When the message is good, the traceback alone tells the next developer
(or future-you) exactly what went wrong without opening the file. When
the message is `"error"` or `"invalid"`, you get a useless traceback
that forces you to re-read the function. Spend the extra five seconds
on a real message.

## A worked example

The editor on the right has a payment function with input validation:

```python
def charge(amount):
    if amount <= 0:
        raise ValueError(f"amount must be positive, got {amount}")
    print(f"charging ${amount}")

charge(50)
charge(-10)
```

`charge(50)` passes the check (50 is greater than 0), so it prints
`charging $50` and returns. `charge(-10)` fails the check on line 2.
The `raise` fires immediately. Python builds a `ValueError` instance
with the message `amount must be positive, got -10` and propagates it
up. There's no `try` around the call site, so the program crashes and
you see a clean traceback that names the offending value.

That last detail — *"got -10"* — is what makes a raised exception
useful. The class tells you the *kind* of failure (a value is
invalid). The message tells you which value, what it was, and why it
was wrong. Six words. Unforgettable when you're debugging at 11pm.

## Where AI specifically gets this wrong

Two patterns to flag in code Cursor writes you.

**One: silent guards.** AI loves to write `if amount <= 0: return None`
instead of `raise`. Now the function "works" for negative inputs — it
returns nothing, and the caller has no idea anything went wrong. Three
function calls later, something else explodes for a reason that has
nothing to do with the real bug. `raise` would have caught it on line
two of the original function.

**Two: useless messages.** `raise ValueError("error")` and `raise
ValueError()` are both legal Python and both useless. The exception
class alone is barely more informative than `print("something
broke")`. Always include a message that names *which* input failed
and what its value was.

Run the editor. The first call works. The second crashes with a
traceback that points at line 3 — the `raise` itself — and tells you
exactly what was wrong with the input.
