---
xp: 1
estSeconds: 90
concept: positional-arguments
code: |
  def send_email(to, subject, body):
      print(f"to: {to}")
      print(f"subject: {subject}")
      print(f"body: {body}")

  send_email("sam@example.com", "lunch?", "1pm okay?")
runnable: true
---

# Arguments are positional by default — and that's where the bugs live

You ask Cursor for *a function that sends an email* or *kicks off a
job* or *creates a user*. It writes a `def` line that takes three or
four parameters. Now every call site has to line those values up in
the right order. Get one wrong, Python doesn't notice — your subject
ends up in the body and the email goes out anyway.

This is the most common silent bug in AI-generated code. Not a
crash, not a traceback, just a function that *runs but means
something different than you thought*.

## How positional matching works

When you write `def send_email(to, subject, body):`, you've defined
three "slots" in a fixed order. When you call `send_email(...)`, the
values you pass in get poured into those slots **left to right**:

```python
send_email("sam@example.com", "lunch?", "1pm okay?")
#          ^to                ^subject  ^body
```

Python doesn't read the values to figure out where they go. It doesn't
know that `"sam@example.com"` "looks like" an email. It just counts
positions. First arg → first parameter. Second → second. Third → third.

If the parameters were `(subject, to, body)` instead, the same call
would put `"sam@example.com"` into `subject`. Same code on the call
side. Completely different meaning.

## The bug that hits everyone exactly once

Imagine the function order changes between two AI sessions. Cursor
refactors `send_email` from `(to, subject, body)` to `(subject, to,
body)` because some new code path needs subject first. You don't
notice. Now this call:

```python
send_email("sam@example.com", "lunch?", "1pm okay?")
```

…still runs without error. But it tries to email "lunch?" with the
subject "sam@example.com" and the body "1pm okay?". The recipient is
your subject. No traceback. No warning. Just a wrong email out the
door.

The defense is to use **keyword arguments** when the call site is more
than two positions long:

```python
send_email(to="sam@example.com", subject="lunch?", body="1pm okay?")
```

Now the order doesn't matter. Python matches by name, not position.
We'll drill keyword args harder in the next steps — internalize this
defense early.

## Where AI specifically bites

Two patterns to watch for in code Cursor writes you:

1. **Long positional call sites.** Anytime you see four or more
   un-named arguments in a row — `client.create_user("alex", "founder",
   28, True, None)` — that's a future bug waiting on someone to refactor
   the function signature.
2. **Same-type arguments adjacent.** `move(from_x, from_y, to_x, to_y)`
   is the classic case. AI will swap `from_y` and `to_x` once a year
   and the program runs, just wrong. Keyword args eliminate this entire
   category of bug.

Run the editor. The function prints each argument with a label so you
can see exactly which value landed in which slot.
