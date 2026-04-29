---
xp: 1
estSeconds: 105
concept: type-coercion-and-traps
code: |
  count = "0"
  count = count + 1
  print(count)
runnable: true
---

# The single most common type bug AI writes you

Run the code on the right. Read the error. We'll come back to it.

```
TypeError: can only concatenate str (not "int") to str
```

This is the type bug you'll see most often in AI-generated Python, and
the reason is structural — Cursor pulls a value from a form, an env var,
a JSON field, or a CLI argument, and it forgets that all of those things
arrive as **strings**, not numbers. Then the next line tries to do math
on the string, and Python refuses.

## What just happened

Line 1: `count = "0"`. The `"0"` has quotes. It's a string. The
*character* zero, not the *number* zero.

Line 2: `count + 1`. Python sees a string on the left and a number on the
right and stops. It will not silently guess what you meant. JavaScript
would. PHP would. Python won't. *That's a feature.*

## The mental model

Python types do not auto-convert across the divide between text and
numbers. A few examples of what Python will and won't do:

```py
"7" + "3"       # works → "73" — string concatenation
7 + 3           # works → 10
"7" + 3         # TypeError — won't mix
"7" * 3         # works → "777" — string repetition (yes, really)
True + 1        # works → 2 — bool secretly counts as int (don't lean on it)
None + 1        # TypeError — None has no math at all
```

If you remember nothing else: **the boundary between `str` and `int` is a
wall**, and AI keeps walking into it.

## How to fix it

Two functions, both built into Python, both used constantly:

- `int("7")` → the integer `7`.
- `str(7)` → the string `"7"`.

Pick the side you want to be on, cast the other one to match. The fixed
version of the broken code is:

```py
count = "0"
count = int(count) + 1
print(count)
```

Now both operands are ints. Math works. The script prints `1`.

## Where this hits real AI code

Three places, ranked by how often you'll see them:

1. **Reading from `input()` or CLI args.** Both return `str`. Cursor
   sometimes remembers to cast, sometimes forgets. When it forgets, your
   program crashes on the first arithmetic line.
2. **Reading from `os.environ`.** Same deal — env vars are always
   strings, even when they look like numbers. `os.environ["PORT"]` is
   `"8080"`, not `8080`.
3. **F-strings hide it.** `f"count: {count}"` works whether `count` is a
   string or an int — Python casts to str automatically inside the
   braces. So a buggy variable can travel through ten print statements
   undetected, and then crash on the first line that does math with it.

## The None side of the same coin

`None` is its own trap. AI writes:

```py
score = lookup_user("maya")    # might return None
total = score + 10             # crashes if score is None
```

The first line *might* return a real score, but if the user isn't found,
it returns `None`. The second line then tries `None + 10` and crashes
with the same family of `TypeError`. We'll fix one of these in step 6.

## What to take into the rest of the lesson

When you read AI code and see a variable being used in two ways — once
as text, once as a number — pause. That's the spot where the bug lives.
Trace back to the assignment and ask, *what type did this start as?*
Cast at the boundary, not in the middle.
