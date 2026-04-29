---
xp: 1
estSeconds: 100
concept: zero-division-and-value-error
code: |
  # Two errors AI ships when it forgets that real-world inputs aren't clean.

  # ZeroDivisionError: when the denominator comes in empty/zero
  total_orders = 0
  revenue = 1000
  # average = revenue / total_orders   # ZeroDivisionError: division by zero

  # ValueError: right type asked, content can't be converted
  user_input = "thirty"
  # age = int(user_input)              # ValueError: invalid literal for int()

  print("(uncomment a line above to see the crash)")
---

# `ZeroDivisionError` and `ValueError` — the "right type, wrong content" twins

Both of these errors come from the same root cause: AI wrote code
that *assumed something about the content of an input* and got it
wrong when reality didn't cooperate. The type was right. The exact
value broke the assumption.

These show up almost exclusively in code that processes user input,
API responses, or aggregates over data that might be empty. Cursor
ships them constantly because the unit tests it imagines in its head
don't cover the empty/malformed cases.

## `ZeroDivisionError` — the empty-denominator pattern

```python
average = revenue / total_orders
# ZeroDivisionError: division by zero
```

Almost every `ZeroDivisionError` in the wild comes from one specific
pattern: **dividing by a count that turned out to be empty**.

- *Average order value:* `total_revenue / order_count` — fine until
  the user has zero orders.
- *Conversion rate:* `signups / visitors` — fine until the marketing
  campaign hasn't started yet.
- *Score per attempt:* `points / attempts` — fine until a brand-new
  user makes their first call.

The fix is always a one-line guard:

```python
if total_orders == 0:
    average = 0    # or None, or "—", whatever your UI wants
else:
    average = revenue / total_orders
```

Or, more Python-flavored:

```python
average = revenue / total_orders if total_orders else 0
```

When you see `ZeroDivisionError` in AI-generated code, *do not* wrap
the division in `try/except`. The right fix is to *check the
denominator* and decide what "no data" should mean for your domain.
Zero? `None`? "N/A"? That's a product question, not an error-handling
question.

## `ValueError` — the right-type, wrong-content pattern

```python
age = int("thirty")
# ValueError: invalid literal for int() with base 10: 'thirty'
```

`ValueError` is what Python raises when a function got a value of the
*right type* (here, a string) but the *content* can't be coerced into
what the function actually needs (a number). The classic cases:

- `int("hello")` — string, but not a numeric one.
- `float("$5.00")` — string, but the `$` makes it unparseable.
- `datetime.strptime("yesterday", "%Y-%m-%d")` — string, but doesn't
  match the expected date format.

These almost always come from **user input** or **upstream data
that's a little dirtier than expected**. AI tends to write
`int(input())` or `int(form_field)` without thinking about what
happens when someone types "twenty" or leaves the field blank.

The fix depends on what you want to happen on bad input:

- **Reject:** `if not text.isdigit(): raise ValueError(...)` — fail
  loudly with your own message.
- **Default:** `try: x = int(text) except ValueError: x = 0` — accept
  the bad input but treat it as zero.
- **Skip:** wrap a list comprehension with a filter so bad entries
  drop out.

We'll go deeper on these patterns in the error-handling chapter. For
now, recognize the class on sight.

## Where AI specifically gets both wrong

Two patterns to flag in code Cursor writes you:

1. **No empty-input guard before division.** AI tends to assume a
   non-empty list. Whenever you see `total / len(items)` or
   `sum(scores) / len(scores)`, ask: *what if `items` or `scores` is
   empty?*

2. **`int()` and `float()` on dirty input.** Whenever you see
   `int(some_string)` where `some_string` came from user input, an
   API, or a file, that's a `ValueError` waiting to happen on the
   next bad row.

The translation:

- `ZeroDivisionError` → check the denominator before dividing.
- `ValueError` → check the content before casting it.

Both are content validation, both are one-line fixes, both are bugs
AI ships fluently because it doesn't think about edge cases on its
own.
