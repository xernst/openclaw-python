---
xp: 1
estSeconds: 100
concept: match-statement
code: |
  command = "stop"

  match command:
      case "start":
          print("starting")
      case "stop":
          print("stopping")
      case "restart":
          print("restarting")
      case _:
          print("unknown command")
---

# `match` — the cleaner shape AI uses for "check this one value"

Python 3.10 added a new keyword: `match`. If you're reading AI code
written in the last few years, you'll see it. It looks a little like
`switch` from JavaScript or C, but it's a full pattern-matching
construct. For our purposes, you mostly need to read the simplest
form, which is what Cursor reaches for 90% of the time.

When the AI writes a `match` instead of a long `if/elif`, the giveaway
is the indented `case` keyword and the underscore at the bottom. Once
you've seen the shape twice, it reads as fast as `if/else`.

## The mental model: "look at this value, match a case"

```python
match command:
    case "start":
        print("starting")
    case "stop":
        print("stopping")
    case _:
        print("unknown command")
```

Read it top to bottom:

1. **`match command:`** — *take this value, and check it against the
   cases below.*
2. **`case "start":`** — *if `command` equals `"start"`, run this
   block.* (Match cases use equality by default for plain strings,
   numbers, and other literals.)
3. **`case _:`** — *catch-all.* The underscore matches anything.
   This is the equivalent of `else` in an `if/elif` chain. By
   convention it goes last.

Just like `if/elif`, **the first matching case wins** and everything
below it is skipped.

## A worked example

The editor has `command = "stop"`. Trace each case:

| Case | Matches `"stop"`? | Result |
|------|-------------------|--------|
| `case "start":` | No | skip |
| `case "stop":` | **Yes** | run, exit |
| `case "restart":` | (skipped) | — |
| `case _:` | (skipped) | — |

Output: `stopping`. Same one-branch-wins behavior as `if/elif`, just
with a tighter syntax that makes the intent obvious.

## When AI reaches for `match` vs. `if/elif`

There's a clear split:

- **Use `match`** when every branch is *checking the same value
  against different constants*. Command dispatch, parsing tokens,
  routing by type — all natural fits.
- **Use `if/elif`** when each branch has a *different condition* —
  one checks a number range, the next checks a list length, the next
  calls a function. `match` can't easily express that variety, and
  forcing it gets ugly.

Cursor follows this convention pretty well. When you see `match`,
you can usually trust that you're looking at "single-value dispatch"
code.

## What `match` can do that `if/elif` can't

This lesson stays at the basic shape — `case "literal":` — because
that's 90% of what you'll see. But `match` has powers `if/elif`
doesn't:

- **Destructure data:**
  ```python
  match user:
      case {"role": "admin", "active": True}:
          ...
  ```
  Matches a dict shape and condition in one go.

- **Bind variables in the pattern:**
  ```python
  match point:
      case (x, y):
          print(f"got point {x}, {y}")
  ```
  Unpacks a tuple right in the case.

When you read AI code that uses these advanced patterns, the rule is
the same as for nested data: *read each `case` line as one shape, one
binding at a time.* Don't panic at the syntax — it's just a more
expressive equality check.

## Where AI specifically gets `match` wrong

Two bugs to flag:

1. **Forgetting the catch-all.** A `match` with no `case _:` block
   is *legal* — it just silently does nothing if nothing matches.
   That's almost always wrong. Cursor sometimes ships `match` blocks
   where the catch-all is missing, and a typo in the input value
   leads to silent no-op behavior. When you read `match`, scan for
   `case _:`. If it's missing, ask whether the silent-no-op was
   intended.

2. **Using `case` for things that should be `if`.** AI sometimes
   reaches for `match` when each branch has a different *condition*
   (not just a different *constant*). The result is awkward — every
   case has to use `case _ if condition:`, which is just `elif` with
   extra steps. When you see that, the original `if/elif` was the
   right tool.

Run the editor. With `command = "stop"`, only `stopping` prints.
