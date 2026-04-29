---
xp: 1
estSeconds: 100
concept: return-vs-print
code: |
  def shout_returns(word):
      return word.upper()

  def shout_prints(word):
      print(word.upper())

  a = shout_returns("hello")
  b = shout_prints("hello")

  print("a is:", a)
  print("b is:", b)
---

# `return` and `print` are not the same — and AI confuses them constantly

This is the highest-frequency bug in any AI-generated function under
twenty lines. Two things that *look* similar to a non-coder do
completely different jobs, and Cursor mixes them up the moment you
ask for "a function that gives me back the result."

You will hit this bug. Probably this week. Read this until the
distinction is automatic.

## What each one actually does

- **`print(x)`** — *writes `x` to the screen, full stop.* It's a
  side-effect. The function keeps running. Once `print` is done, the
  string is just gone — nothing in the program "has" it.
- **`return x`** — *hands `x` back to whoever called the function.*
  The function stops at that point. The value flows back into the
  call site as the result of `function_name(...)`.

The two often produce the same *visible output* in a quick demo,
which is exactly why the bug hides. A function that prints `"HELLO"`
on the screen and a function that returns `"HELLO"` *look identical*
when you call them at the top level. They are not.

## The worked example

The editor on the right has both versions side by side:

```python
def shout_returns(word):
    return word.upper()

def shout_prints(word):
    print(word.upper())

a = shout_returns("hello")
b = shout_prints("hello")
```

Trace what happens:

- `shout_returns("hello")` runs `"hello".upper()` → `"HELLO"`, then
  `return` hands that string back. **`a` is now `"HELLO"`.**
- `shout_prints("hello")` runs `"hello".upper()` → `"HELLO"`, then
  `print` writes it to the screen. The function ends without a
  `return`, so it implicitly hands back `None`. **`b` is now `None`.**
  The screen shows `HELLO`, but `b` itself is `None`.

When you then `print("b is:", b)`, you see `b is: None`. The shout
function "worked" — it shouted — but the value is unrecoverable.

## Why this is the bug AI ships most often

When you ask Cursor for *a function that capitalizes the user's name*
or *a function that doubles the score*, it has a coin flip in front of
it: `return` or `print`. If the prompt sounds like *"display the result"*
or *"show me the answer"*, AI tilts toward `print` — and now you have a
function that you can't compose with anything else. You can't store its
output, can't pass it to another function, can't write it to a file.
The information is *visible* but not *captured*.

The fix is almost always: change the `print` to a `return`. If you
also need to see it on screen, *the caller* prints what the function
returned.

```python
result = shout_returns("hello")
print(result)
```

Two lines, but the `result` is now a real value you can use again.

## How to catch this when reading AI code

Skim the body of every function for two things:

1. **Is there a `return`?** If not, the function returns `None`.
2. **Does the `return` come at the end of the path you care about?**
   A `return` inside an `if` and not in the `else` means one branch
   gives you a value and the other gives you `None`.

Run the editor and watch `b is: None` print out. That's the bug
captured in nine lines.
