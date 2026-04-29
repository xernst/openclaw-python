---
xp: 1
estSeconds: 90
concept: try-except-introduction
code: |
  try:
      result = int("42")
      print(result)
  except ValueError:
      print("not a number")
runnable: true
---

# `try/except` — the seatbelt AI forgets to put on

Every non-trivial script has lines that *might* fail. Reading a file that
doesn't exist. Parsing a string the user mistyped. Calling an API that
returns a 500 instead of a 200. Indexing a list that turned out empty.

When the line that fails has no protection around it, Python halts the
whole program and prints a traceback. Sometimes that's what you want — a
loud crash beats silent corruption. But for *expected* failure modes —
"the user might paste something that isn't a number," "the API might be
down for ten seconds" — you want the script to keep running and recover.
That's what `try/except` is for.

## The mental model

Read this two-line shape out loud:

```python
try:
    result = int("42")
except ValueError:
    print("not a number")
```

In English: *"Try to run the indented code. If a `ValueError` happens
anywhere inside the `try` block, jump down to the `except` block instead
of crashing. Otherwise, skip the `except` block entirely."*

Two paths through the code. Python picks one based on whether the risky
line raised the exception you named:

- **Happy path:** the `try` body runs all the way through. The `except`
  block is skipped. Execution continues past both blocks.
- **Sad path:** somewhere inside the `try` body, a `ValueError` gets
  raised. Python *immediately* abandons the rest of the `try` body, jumps
  into the `except` block, runs that, and continues past both blocks.

Whichever way it went, the program does not crash and the next line of
your script gets to run.

## A worked example

The editor on the right has the canonical first shape:

```python
try:
    result = int("42")
    print(result)
except ValueError:
    print("not a number")
```

Run it. `"42"` is a valid integer string, so `int("42")` succeeds, returns
`42`, and the print fires. The `except` block never runs. Output:

```
42
```

Now imagine the input was `"forty-two"` instead. `int("forty-two")` would
raise `ValueError`, the second `print` inside `try` would be skipped, and
the `except` block would print `not a number`. Same code, two outcomes —
controlled by the input.

## Where AI specifically gets this wrong

Cursor writes the happy path almost every time and leaves you to add the
seatbelt. Look at the typical AI snippet for "fetch a user's score from
the API":

```python
data = response.json()
score = data["user"]["score"]
print(score)
```

There are at least four things that can blow up: `response.json()` if the
body isn't JSON, `data["user"]` if there's no `user` key, `data["user"]
["score"]` if the user has no score, and the `print` if `score` is some
weird object. AI assumes none of those happen.

Your job, reading AI code, is to spot the lines that *can* fail and
decide which deserve a `try/except` wrapper. This chapter teaches you the
moves to do that fluently. Hit **Run**. The string `"42"` parses fine, so
the `except` block never fires. We'll break it on purpose two steps from
now.
