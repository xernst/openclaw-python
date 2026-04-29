---
xp: 1
estSeconds: 50
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

# `match` is the cleaner shape for "check this one value against a list"

Python 3.10 added `match`. When you have one value and you want to dispatch
on its exact contents, `match` is what AI reaches for instead of a long
`if/elif` chain.

The shape on the right reads as:

- `match command:` — look at this value
- `case "start":` — if it equals `"start"`, run this block
- `case _:` — the underscore is the catch-all (like `else`)

Run the code.

`match` is not a replacement for `elif` in general. Use `if/elif` when each
branch has a different *condition*. Use `match` when each branch checks the
same value against a different *constant*.

When you see AI-generated `match` code, the giveaway is the indented `case`
keyword and the underscore `_` at the bottom.
