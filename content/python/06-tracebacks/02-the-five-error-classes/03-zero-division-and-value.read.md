---
xp: 1
estSeconds: 50
concept: zero-division-and-value-error
code: |
  # Two errors AI ships when it forgets to validate input:

  # ZeroDivisionError: when the denominator is empty/zero
  total_orders = 0
  revenue = 1000
  # average = revenue / total_orders   # ZeroDivisionError: division by zero

  # ValueError: right type asked, content can't be converted
  user_input = "thirty"
  # age = int(user_input)              # ValueError: invalid literal for int()

  print("(uncomment a line above to see the crash)")
---

# Two more errors that look similar but mean different things

Both are about *content*, not type. AI ships these when it forgets that
real-world inputs aren't always clean.

**`ZeroDivisionError`** — almost always means the denominator came in
empty. Pattern: `total / count` where `count` ends up `0`. Common when
counting something that has no rows yet.

**`ValueError`** — the type is right but the *content* can't be turned into
what the function wants. The classic case: `int("hello")`. The argument
is a string, which is what `int()` expects, but the *content* doesn't look
like a number.

Translation rules:

- `ZeroDivisionError` → check what's in your denominator before dividing
- `ValueError` → check what's actually in the string before casting it

The fix is usually a one-line guard: `if count == 0: ...` or
`try: int(x) except ValueError: ...`. We won't cover `try/except` yet, but
recognize the error class on sight.
