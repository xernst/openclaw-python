---
xp: 2
estSeconds: 110
concept: except-as-and-tuple-syntax
code: |
  def parse_record(data, key):
      try:
          return int(data[key])
      except (KeyError, ValueError) as err:
          print(f"could not parse {key!r}: {type(err).__name__}")
          return None

  print(parse_record({"age": "42"}, "age"))
  print(parse_record({"age": "n/a"}, "age"))
  print(parse_record({"age": "42"}, "name"))
---

# Two shortcuts you'll see in real AI code

The "one except per class" pattern from the last step is the safe
default, but you'll see two other shapes constantly in code Cursor
writes. Both are useful, and both have a specific time to use them.

## The tuple form: catch several classes the same way

When two or more exceptions deserve the *same* recovery, you don't have
to repeat yourself. Group them in a tuple:

```python
try:
    return int(data[key])
except (KeyError, ValueError):
    return None
```

That single block matches if `data[key]` raises `KeyError` *or* if
`int(...)` raises `ValueError`. The parentheses are required — without
them you'd be writing something different and confusing (more on that
in a later chapter). Read it as: *"if any one of these classes flies
out, do this."*

When to reach for this shape: the recovery is identical, and a reader
shouldn't need to know which specific exception fired. "Either way, we
fall back to `None`."

## The `as` form: bind the exception to a variable

When you *do* want to know what fired — to log it, to inspect it, to
re-raise it — bind it to a name with `as`:

```python
except (KeyError, ValueError) as err:
    print(f"failed: {type(err).__name__}")
```

Now inside the block, `err` is the actual exception instance. You can
read its attributes (`err.args`, `err.__class__.__name__`), pass it to a
logger, or include its message in the response you return. This is the
form professional Python code uses for anything more interesting than
"return a fallback and move on."

The editor on the right combines both shapes:

```python
def parse_record(data, key):
    try:
        return int(data[key])
    except (KeyError, ValueError) as err:
        print(f"could not parse {key!r}: {type(err).__name__}")
        return None
```

Three calls, three outcomes:

1. `parse_record({"age": "42"}, "age")` — happy path. Returns `42`.
2. `parse_record({"age": "n/a"}, "age")` — `int("n/a")` raises
   `ValueError`. The except logs `could not parse 'age': ValueError`
   and returns `None`.
3. `parse_record({"age": "42"}, "name")` — `data["name"]` raises
   `KeyError`. Same except runs, but `type(err).__name__` reflects
   *which* class actually fired. Logs `could not parse 'name': KeyError`.

Same handler, same fallback, but the log line tells you which failure
mode you hit. That's the win: one block, one fallback, full visibility.

## Where AI specifically gets this wrong

Two patterns to flag.

**One: bundling exceptions that need different handling.** Cursor
sometimes writes `except (KeyError, ValueError, TypeError) as e: pass`
because catching more feels safer. It isn't. `TypeError` usually means
"the code itself is wrong" and should crash. Only group exceptions in a
tuple when the *recovery* is genuinely the same.

**Two: using `as e` and then ignoring `e`.** If the variable is bound
and never read, you've added noise. Either log it, return it, or drop
the `as` clause entirely. AI ships dead `as e` bindings constantly —
they're a smell that the prompt asked for "good error handling" without
saying what to do with the error.

Run the editor and watch the same `except` block print three different
class names depending on which line in the `try` actually failed.
