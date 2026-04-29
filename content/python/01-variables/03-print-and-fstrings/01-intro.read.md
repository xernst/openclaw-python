---
xp: 1
estSeconds: 75
concept: print-vs-repr
code: |
  name = "maya"
  print(name)
  print(repr(name))
runnable: true
---

# How AI shows you what's inside a variable

Every Python script Cursor writes you ends up doing the same thing
eventually — converting some value into a string and showing it to a
human. A log line. A debug print. A message in the UI. A line in a
report. The plumbing between *the value in memory* and *the characters
on the screen* is exactly two functions and one syntax feature, and
you'll use them constantly:

- `print(...)` — show this thing to a human.
- `repr(...)` — show this thing to a *programmer* (so you can see types
  and quote marks).
- `f"..."` — drop variables straight into a string template.

That's the whole toolkit. Master these three and you'll never have to
ask AI "why doesn't this print right?" again.

## `print` shows the friendly face

Run the editor on the right. Look at the first output line:

```
maya
```

No quotes. No type info. Just the characters of the string. That's
`print`. It's optimized for *humans reading a terminal*. When AI writes
`print(user_score)`, it's saying "show me a clean version of whatever
this is."

`print` accepts any number of arguments and joins them with spaces:

```py
print("score:", 7, "level:", 3)   # → score: 7 level: 3
```

It always adds a newline at the end. If you don't want one, pass
`end=""`. (You almost never need to.)

## `repr` shows the honest face

Look at the second output line from the editor:

```
'maya'
```

Same string, but now wrapped in quotes. That's `repr` — the
*programmer's view*. The whole point of `repr` is to make the type and
boundaries unambiguous. Two strings that print the same can have
different repr:

```py
print("7")        # → 7
print(repr("7"))  # → '7'      (with quotes — it's a string)
print(7)          # → 7
print(repr(7))    # → 7        (no quotes — it's an int)
```

When you're debugging AI-generated code and the output looks right but
the math is wrong, `print(repr(x))` is the move. It will tell you
whether `x` is `7` or `"7"` — and that's almost always the bug.

## The mental model

- **`print(x)`** — for users.
- **`repr(x)`** (or `print(repr(x))`) — for *you*, while debugging.
- **`f"..."`** — the third tool, coming up next. It's how AI builds 90%
  of its output strings.

## Where AI gets this wrong

Two patterns to watch for:

1. **Printing a `None` and pretending it's empty.** `print(None)`
   produces the literal text `None`, not an empty line. AI sometimes
   writes `print(maybe_value)` without checking, and your log file ends
   up with `None` in places you expected blanks.
2. **Concatenating with `+` instead of using f-strings.** Cursor
   occasionally falls back to `"score: " + str(score)` even though
   `f"score: {score}"` is shorter and harder to mess up. Both work — but
   the f-string version doesn't crash if you forget to cast.

The f-string is the workhorse. The next read step takes it apart.
