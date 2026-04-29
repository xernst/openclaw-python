---
xp: 1
estSeconds: 100
concept: eq-vs-is
code: |
  a = [1, 2, 3]
  b = [1, 2, 3]

  print(a == b)
  print(a is b)
---

# `==` and `is` are not the same — and Cursor mixes them up

This is the bug Claude ships *all the time* when it writes things
like `if status is "done"` or `if count is 0`. The code looks fine.
It even works on small examples. Then it silently breaks the moment
the values come from a different source.

There's a single rule that prevents the bug forever. Read this once
and you will never write the wrong one again.

## The two comparisons, side by side

- **`==`** asks: *do these have the same **value**?*
- **`is`** asks: *are these the **same object** in memory?*

Two questions, two different answers. Most of the time you want the
first one. Almost never the second one.

```python
a = [1, 2, 3]
b = [1, 2, 3]

a == b   # True  — same contents
a is b   # False — two separate lists that happen to hold the same items
```

`a` and `b` were created by *two different `[...]` expressions*, so
Python made two separate list objects. They look identical from the
outside, but they live in different memory locations. `==` cares about
contents. `is` cares about identity. They disagree here.

## Why this is even allowed to silently work

Python *interns* small integers and short strings — meaning it reuses
the same object for repeated literal values. Because of that:

```python
x = 5
y = 5
x is y   # True (because Python reused the same int object)

x = "done"
y = "done"
x is y   # True (interned string literal)
```

Both of those evaluate to `True`. So when Cursor writes `if status is
"done":`, it works in dev, where `status` was assigned from a string
literal. *Then* the script reads `status` from a JSON file or an API
response, which creates a fresh string object — and `is` returns
`False`. The condition silently stops matching, and the bug is in
production.

`==` would have worked in both cases.

## The one place `is` is actually right: `None`

There is exactly *one* common Python value where `is` is the correct
move: `None`.

```python
if x is None:
    ...
if x is not None:
    ...
```

`None` is a singleton — there's only ever one `None` object in the
entire interpreter. Any value that's `None` *is* the same object as
every other `None`. So `is` works, and stylistically Python prefers
it over `== None` (because `==` can be overridden by classes to lie,
but `is` always tells the truth about identity).

You'll also see `is True` and `is False` occasionally. They're
technically valid for the same reason, but `==` is more conventional
and harder to get wrong.

## The rule of thumb to memorize

> **Use `==` for everything. Use `is` only for `None`.**

When you read AI code that uses `is` against a string, an integer, a
list, or any other regular value, that's a bug. Cursor sometimes
writes `if status is "done":` because it sounds more English. It is
not English. It is wrong.

```python
# wrong (works in dev, breaks in prod)
if status is "done":
    ...

# right
if status == "done":
    ...
```

Run the editor. `a == b` is `True`. `a is b` is `False`. Same values,
different objects — and that's the gap that the bug lives in.
