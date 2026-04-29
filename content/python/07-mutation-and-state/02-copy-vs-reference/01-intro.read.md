---
xp: 1
estSeconds: 100
concept: shallow-copy-recap
code: |
  original = [1, 2, 3]

  # three real ways to copy a list
  a = original[:]
  b = list(original)
  c = original.copy()

  a.append(99)

  print("original:", original)
  print("a:", a)
runnable: true
---

# A copy is a new container with the same items

Last lesson made the rule clear: `b = a` doesn't copy. To get a real
separate list, you have to *create a new one*. This lesson nails the
"how" — three idiomatic ways AI uses to copy a list, and then the
fine print that bites later.

## The three ways to copy a flat list

All three of these allocate a *new* list and fill it with the items
from the original:

```python
a = original[:]       # slice from start to end
b = list(original)    # constructor
c = original.copy()   # method
```

Read them as:

- **`original[:]`** — slice notation with no start or end means *every
  item, beginning to end*. Slicing always returns a new list. This is
  the oldest idiom and the shortest.
- **`list(original)`** — the `list()` constructor takes any iterable
  and builds a new list from it. Works for tuples, sets, generators,
  anything that yields values.
- **`original.copy()`** — added to lists in Python 3.3, this is the
  most readable for new code. The method explicitly says "make a
  copy."

Pick the one that fits. They produce identical results for lists.

## A worked example

The editor on the right makes three copies, then mutates one of them:

```python
original = [1, 2, 3]

a = original[:]
b = list(original)
c = original.copy()

a.append(99)

print("original:", original)
print("a:", a)
```

Output:

```
original: [1, 2, 3]
a: [1, 2, 3, 99]
```

`a` got the `99`. `original` did not. The copy worked — they're now
*two separate lists*, and mutating one doesn't affect the other.
(The same is true for `b` and `c`, which we just don't print here.)

## What "shallow copy" actually means

Each of these three techniques produces what's called a **shallow
copy**: a *new outer list*, with the *same items inside*.

For a flat list of numbers — which is what `original` is here — that
distinction doesn't matter. Numbers and strings in Python are
*immutable*, meaning you can't mutate the `1` itself; you can only
remove it from the list and put a different number in. So "same
items inside" causes no problems.

But the moment your list contains *mutable* items — nested lists,
dicts, sets, custom objects — the "same items inside" part becomes a
trap. You have a new outer list, but the inner contents are still
*shared* between the original and the copy. Mutate something nested,
and the change shows up in both.

That's the bug we'll see in the next lesson. For now, hold this
thought: *shallow copies are fine for flat data, dangerous for
nested data*.

## Where AI specifically reaches for each

Cursor's habits, from reading a lot of AI-generated code:

- **`.copy()`** — most common in modern code. Reads cleanly.
- **`list(...)`** — common when converting from a different type
  (tuple, set, generator) to a list, *and* getting a copy at the
  same time.
- **`[:]`** — common in older code or when AI is in "compact" mode.
  Newer code uses `.copy()` instead.

All three are correct. When you read AI code that does any of them,
recognize it as "make a real copy" and move on.

## The rule of thumb to lock in

> **For flat data, shallow copies (`[:]`, `list(x)`, `x.copy()`) are
> fine. For nested data, you need `copy.deepcopy(x)` from the `copy`
> module.**

We'll cover the nested case next. Run the editor for now and see
that the simple flat copy works exactly as advertised — `a` got the
`99`, `original` did not.
