---
xp: 1
estSeconds: 100
concept: specific-exception-classes
code: |
  def get_score(data, user):
      try:
          return int(data[user])
      except KeyError:
          return None
      except ValueError:
          return 0

  print(get_score({"maya": "42"}, "maya"))
  print(get_score({"maya": "42"}, "marcus"))
  print(get_score({"maya": "n/a"}, "maya"))
runnable: true
---

# Each exception is a different shape of failure

Last lesson you saw a single `except ValueError` catch a single failure.
Real AI code is messier than that. Cursor will write you a function with
three ways to fail in three lines, and each failure raises a *different*
exception class. If you catch them all with one broad block, you've built
a function that smiles politely while it lies to you.

The move this lesson teaches: read the body of the `try`, list every
exception each line could raise, and write a separate `except` for the
ones you actually know how to handle. The rest are bugs — let them crash
loudly so you can fix them.

## The mental model

Every Python exception is a Python class. `ValueError` is a class.
`KeyError` is a class. `FileNotFoundError` is a class. When a line raises,
Python creates an *instance* of that class and goes hunting for an
`except` clause that names a matching class. First match wins. No match,
the program crashes.

A `try` block can have many `except` clauses stacked underneath:

```python
try:
    risky_thing()
except KeyError:
    # only runs for KeyError
    ...
except ValueError:
    # only runs for ValueError
    ...
```

Python checks them top to bottom. As soon as one matches, that block
runs and the rest are skipped. The order matters when the classes are
related — but for the five everyday exceptions (`KeyError`, `ValueError`,
`TypeError`, `IndexError`, `FileNotFoundError`), they're all siblings, so
order is just readability.

## A worked example

The editor on the right has `get_score`, a function with two distinct
failure modes wired to two distinct excepts:

```python
def get_score(data, user):
    try:
        return int(data[user])
    except KeyError:
        return None
    except ValueError:
        return 0
```

Three calls, three paths through the code:

1. `get_score({"maya": "42"}, "maya")` — both lookups succeed.
   `data["maya"]` returns `"42"`, `int("42")` returns `42`. Output: `42`.
2. `get_score({"maya": "42"}, "marcus")` — `data["marcus"]` raises
   `KeyError`. The first `except` matches. Output: `None`.
3. `get_score({"maya": "n/a"}, "maya")` — `data["maya"]` returns
   `"n/a"`, `int("n/a")` raises `ValueError`. Second `except` matches.
   Output: `0`.

Two failure modes, two recovery values, zero confusion about which one
fired. A reader can scan the function and know exactly what each branch
means. That's the point.

## Where AI specifically gets this wrong

The pattern Cursor reaches for first is `except Exception:` — one block
that catches every error class in the language. It looks responsible.
It's not. It welds together failure modes that should be handled
differently:

- A missing dict key probably means the user doesn't exist yet → return
  `None` and move on.
- A bad string-to-int conversion probably means dirty data → return `0`
  and log it.
- A `TypeError` from passing the wrong shape to a helper → that's a
  *bug in your code*, not a runtime condition. You want it to crash so
  you notice.

`except Exception:` collapses all three into the same response. Two of
them get the wrong fallback, the third gets silently swallowed, and you
ship a function that "handles errors" without handling any of them
correctly. Run the editor — three calls, three branches, three
behaviors that map to three real situations.
