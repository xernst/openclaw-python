---
xp: 1
estSeconds: 110
concept: f-string-anatomy
code: |
  name = "maya"
  score = 87
  ratio = 0.8333333

  print(f"hi, {name}")
  print(f"{name} scored {score}")
  print(f"win rate: {ratio:.2f}")
  print(f"next: {score + 1}")
runnable: true
---

# The f-string is the workhorse

Look at any twenty lines of Python Cursor wrote you this week. Count the
f-strings. You'll find one every three or four lines. They're how AI
builds log messages, error reports, return values, prompt strings, and
LLM inputs. They are everywhere.

The syntax is small, but it has four moving parts and AI uses all four.
Run the editor on the right and watch all four come out. Then read on.

## Part 1: the prefix `f`

```py
f"hi, {name}"
```

The `f` before the opening quote is the entire feature switch. Drop the
`f` and the curly braces stop being magic — they print as literal `{`
and `}`. Forgetting the `f` is the single most common f-string typo
Cursor makes when it's tired:

```py
print(f"score: {score}")    # → score: 87
print("score: {score}")     # → score: {score}        ← bug
```

If your output has literal curly braces in it, you forgot the `f`. Look
at the start of the string.

## Part 2: the curly braces

Anything inside `{ }` gets *evaluated as Python* and the result gets
substituted into the string. Variables work:

```py
print(f"{name} scored {score}")    # → maya scored 87
```

But it's not just variables — any expression works:

```py
print(f"next: {score + 1}")        # → next: 88
print(f"upper: {name.upper()}")    # → upper: MAYA
```

This is huge for reading AI code. When you see `f"{user.profile.email}"`
that's three attribute accesses and a method call all happening inside
the braces. Treat the braces as a tiny window into Python.

## Part 3: the format spec (the colon trick)

After a colon inside the braces, you can shape *how* the value renders:

```py
ratio = 0.8333333
print(f"win rate: {ratio:.2f}")    # → win rate: 0.83
```

The `:.2f` means "format as a float with 2 decimals." This is the most
common spec by far. Two more you'll see:

- `:,` — comma thousands separator. `f"{1000000:,}"` → `1,000,000`
- `:>10` — right-align in a 10-character column.

You don't have to memorize these. When you see a colon inside a brace,
recognize it as "render rule here" and look it up if you need to.

## Part 4: the `=` debug shortcut (Python 3.8+)

This one is small but AI uses it constantly when it's debugging:

```py
print(f"{score=}")     # → score=87
```

The `=` after the variable name prints both the *name* and the *value*.
It's a shortcut for `print(f"score={score}")`. When you see it in
generated code, that's a sign Cursor was debugging and forgot to delete
the line.

## What this means for reading AI code

When you're reading a generated function and you hit a complex
f-string, walk it left to right:

1. Confirm the `f` is there.
2. For each `{ ... }`, identify *what expression* runs inside.
3. For each `:...`, identify *how* the value renders.

Three sub-skills. Same string. That's the whole pattern, repeated
hundreds of times across any codebase.

## Where AI specifically gets f-strings wrong

- **Quotes inside quotes.** `f"name: {data["name"]}"` looks fine but
  crashes — the inner double quotes close the f-string early. Use
  `data['name']` instead. Cursor has gotten better at this, but it still
  trips occasionally.
- **Nested braces.** Two literal braces in a row become one in the
  output: `f"{{not a variable}}"` prints `{not a variable}`. Useful when
  you're generating code, confusing when you're not.
- **Expressions with side effects.** Don't put a function call that
  *changes state* inside an f-string. AI mostly avoids this, but when it
  doesn't, the bug is silent and weird.
