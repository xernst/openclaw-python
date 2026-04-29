---
xp: 1
estSeconds: 75
concept: four-core-types
code: |
  count = 7
  name = "maya"
  is_ready = True
  result = None

  print(type(count))
  print(type(name))
  print(type(is_ready))
  print(type(result))
runnable: true
---

# Four shapes, ninety percent of the code

Open any file Cursor wrote you this week. Scroll. Count what kinds of
things the variables hold. You'll find the same four shapes over and
over: a number, a piece of text, a yes-or-no flag, and an absence. That's
it. The whole language has more types than this — lists, dicts, classes,
generators — but at the leaf level, where values actually sit, AI ships
these four constantly.

If you can name the type of every variable on a screen of Python in under
ten seconds, you can read AI code at full speed. If you can't, every
function call becomes a question mark. So we're going to drill it.

## The four

```py
count = 7          # int
name = "maya"      # str
is_ready = True    # bool
result = None      # NoneType
```

- **int** — a whole number. No quotes, no decimal point. `7`, `-3`, `0`.
- **str** — text. Always wrapped in quotes, single or double, doesn't
  matter. `"maya"`, `'7'` (yes, that string is text, not the number).
- **bool** — a flag. Exactly two values: `True` and `False`. Capital T,
  capital F. Lowercase `true` is a `NameError`.
- **NoneType** — the absence of a value. Spelled `None`. Used when a
  function didn't find what you asked for, or hasn't run yet.

## The mental model that actually works

Forget memorizing. Look at the right side of the `=` and ask one
question: *what shape did Python just see?*

- Quotes around it? **str.**
- Just digits, no quotes, no dot? **int.**
- The word `True` or `False` standing alone? **bool.**
- The word `None` standing alone? **NoneType.**

That's the whole game at the leaf level. Every other variable in the
codebase is built out of these (a list of strs, a dict mapping str to
int, a function returning bool-or-None).

## Where AI gets sloppy with types

Two patterns show up in AI-generated Python over and over:

1. **The string-vs-number mixup.** You ask for a counter and AI hands
   back `count = "0"` — a *string* zero, not a *number* zero. Looks
   identical, behaves nothing alike. The next chapter will show you the
   exact crash this causes.
2. **The None-vs-False confusion.** AI writes `if user:` when it should
   have written `if user is not None:`. They look the same in a happy
   path and diverge the moment a user object is falsy-but-present (an
   empty list, a zero score). We'll fix one of these later in the lesson.

## The `type()` builtin

When you can't tell at a glance — and sometimes you can't, because the
value comes from a function call — Python tells you directly:

```py
print(type(count))    # <class 'int'>
print(type(name))     # <class 'str'>
print(type(is_ready)) # <class 'bool'>
print(type(result))   # <class 'NoneType'>
```

Hit **Run** on the editor. Watch the four lines come out. That's your
ground truth: when in doubt, `print(type(thing))` and Python answers.
