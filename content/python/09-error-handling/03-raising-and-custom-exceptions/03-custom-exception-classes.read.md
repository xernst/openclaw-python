---
xp: 2
estSeconds: 120
concept: custom-exception-classes
code: |
  class PaymentDeclined(Exception):
      pass

  class InsufficientFunds(PaymentDeclined):
      pass

  def charge(account, amount):
      if account["balance"] < amount:
          raise InsufficientFunds(
              f"need {amount}, have {account['balance']}"
          )
      account["balance"] -= amount

  try:
      charge({"balance": 30}, 100)
  except PaymentDeclined as err:
      print(f"payment failed: {err}")
---

# Custom exceptions — naming the failures your code actually has

The five built-in exceptions (`ValueError`, `KeyError`, `TypeError`,
`IndexError`, `FileNotFoundError`) cover most situations. But they're
*generic*. Every Python program in the world uses `ValueError` for
"the input was wrong." When you read an AI-generated FastAPI app and
see `except ValueError`, you have no idea whether that's catching a
parse error, a validation error, an out-of-range business rule, or a
genuine bug.

The fix: define your own exception class for failures that have a
specific meaning in *your* code. It's three lines and it pays back
every time you read the codebase later.

## The mental model

A custom exception is just a Python class that inherits from
`Exception` (or one of its subclasses). The body can be empty:

```python
class PaymentDeclined(Exception):
    pass
```

That's it. You now have a fully functional exception class. You can
raise it (`raise PaymentDeclined("...")`), catch it (`except
PaymentDeclined`), and — most importantly — anyone reading the code
sees the *name* and immediately knows what kind of failure this is.
"Payment declined" is unambiguous. "Value error" isn't.

You can also build a small hierarchy when several failures share a
category:

```python
class PaymentDeclined(Exception):
    pass

class InsufficientFunds(PaymentDeclined):
    pass

class CardExpired(PaymentDeclined):
    pass
```

Now `except PaymentDeclined` catches *both* of the specific subclasses
(because of inheritance), and `except InsufficientFunds` catches only
that one. You get to choose how broad each catch is.

## A worked example

The editor on the right has a tiny payment system:

```python
class PaymentDeclined(Exception):
    pass

class InsufficientFunds(PaymentDeclined):
    pass

def charge(account, amount):
    if account["balance"] < amount:
        raise InsufficientFunds(
            f"need {amount}, have {account['balance']}"
        )
    account["balance"] -= amount

try:
    charge({"balance": 30}, 100)
except PaymentDeclined as err:
    print(f"payment failed: {err}")
```

`charge` notices the balance is too low, raises
`InsufficientFunds(...)`. The `except` clause catches
`PaymentDeclined`, and because `InsufficientFunds` is a subclass,
inheritance means the catch fires. Output: `payment failed: need 100,
have 30`.

Notice the asymmetry: the `raise` is specific (`InsufficientFunds`),
the `except` is broad (`PaymentDeclined`). That's almost always the
right shape — raise as specifically as you can, catch as broadly as
the recovery applies. A handler that says "any payment failure goes
to this branch" is fine. A handler that says "any error anywhere goes
to this branch" is `except Exception` again, and we already covered
why that's a bad idea.

## When to actually do this

Don't make a custom exception for every function. The bar is: *would
a reader be confused about what kind of failure this is?* If the
answer is yes, name it. Real cases where it earns its keep:

- Domain rules. `InsufficientFunds`, `OrderAlreadyShipped`,
  `RateLimitExceeded`. These are events in the business, not generic
  bad values.
- Boundary failures. `UpstreamAPIError`, `ConfigMissing`,
  `AuthenticationFailed`. These mark *where* the failure came from so
  the right caller can handle it.
- Anything you'll need to handle differently from a generic
  `ValueError` somewhere upstream.

## Where AI specifically gets this wrong

Cursor under-uses custom exceptions and over-uses string messages
inside `ValueError`. You'll see code like `raise ValueError("user
not found")` and `raise ValueError("token expired")` and `raise
ValueError("rate limited")` all in the same file. Now any caller has
to *parse the message string* to figure out which case fired. That's
fragile — a typo in the message breaks the handler, and a reader has
to grep for the string everywhere.

When you see three `raise ValueError(...)` calls in the same module
with three meaningfully different meanings, that's the signal: lift
each into its own class. Run the editor and watch a custom exception
catch its own subclass.
