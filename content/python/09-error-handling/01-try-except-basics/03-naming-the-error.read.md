---
xp: 2
estSeconds: 100
concept: specific-exception-types
code: |
  pets = {"dog": "rex"}

  try:
      print(pets["cat"])
  except KeyError:
      print("no cat in the dict")

  try:
      print(pets["dog"] + 7)
  except TypeError:
      print("can't add a string and a number")
---

# Catch the specific error, not "anything that goes wrong"

The single most damaging pattern in AI-generated error handling is the
**bare except**:

```python
try:
    do_the_risky_thing()
except:
    pass
```

This catches *everything* — `ValueError`, `KeyError`, `KeyboardInterrupt`
when you hit Ctrl+C, `SystemExit` when something tries to shut down the
process, even unrelated bugs the AI didn't anticipate. The script
silently swallows them and keeps going as if nothing happened. Hours
later, you notice the output is wrong, and you have *no log line, no
traceback, nothing* explaining why.

Cursor reaches for bare `except` because it feels safe. It is the
opposite of safe. It is the line that hides bugs.

## The fix: name the exception you actually expect

```python
except ValueError:
    ...
```

Now Python only catches `ValueError`. Any other exception — a real bug
you didn't see coming — passes through and crashes the script with a
proper traceback. Loud failure beats silent corruption. You want the bug
to crash, because then you can fix it.

## The exception types AI uses constantly

These five cover roughly 90% of what you'll see Cursor writing:

- **`ValueError`** — the value is the wrong shape. `int("hi")` is the
  classic. Raised when a function got an argument of the right type but
  with bad contents.
- **`KeyError`** — a dict didn't have the key you asked for. `pets
  ["cat"]` when `pets` only has a dog.
- **`IndexError`** — a list/tuple was shorter than the index you used.
  `items[5]` on a list of three.
- **`TypeError`** — the operation doesn't work on the types you gave it.
  `"rex" + 7` is the classic — string plus int isn't defined.
- **`FileNotFoundError`** — `open(path)` couldn't find the file.

A handful of others show up in specific domains: `JSONDecodeError` (bad
JSON in `response.json()`), `requests.ConnectionError` (network down),
`AttributeError` (`obj.thing` when `thing` doesn't exist on `obj`),
`ZeroDivisionError` (rare in real code, common in textbooks).

## A worked example

The editor on the right runs two completely separate `try` blocks, each
catching the specific exception that block can produce:

```python
pets = {"dog": "rex"}

try:
    print(pets["cat"])
except KeyError:
    print("no cat in the dict")

try:
    print(pets["dog"] + 7)
except TypeError:
    print("can't add a string and a number")
```

Block one tries to read `pets["cat"]`. The dict has no `cat` key, so
Python raises `KeyError`. The `except KeyError` block catches it, prints
`no cat in the dict`, and execution moves on.

Block two tries to add `"rex"` (a string) to `7` (an int). Python's `+`
operator doesn't know how to combine those, so it raises `TypeError`.
The second block catches it and prints `can't add a string and a number`.

Notice the precision: each `except` names the *specific* exception that
matches what the `try` block can actually raise. Neither uses bare
`except`. Neither uses `except Exception` (which is also overly broad).

## Where AI specifically gets this wrong

Three patterns to flag in code Cursor writes:

1. **`except:` with no exception named.** Always wrong. Replace with the
   specific exception, or with `except Exception` if you genuinely don't
   know which one — but never bare.

2. **`except Exception: pass`.** The "I don't want to think about this"
   move. The script is now blind to every bug in the `try` block.
   Either log the exception (`except Exception as e: log.error(e)`) or
   handle it specifically.

3. **Catching the wrong exception entirely.** Cursor sometimes writes
   `except ValueError` around `data["user"]["score"]`, but the lookup
   raises `KeyError`, not `ValueError`. The `except` doesn't match, the
   real exception flies through, and the "handler" never runs. When the
   handler doesn't fire, the exception name is usually the bug.

Run the editor. Two `try` blocks, two specific exceptions, two clean
recoveries.
