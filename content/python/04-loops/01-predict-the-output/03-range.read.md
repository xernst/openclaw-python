---
xp: 1
estSeconds: 95
concept: range-function
code: |
  for i in range(3):
      print(i)

  print("---")

  for i in range(1, 4):
      print(i)
---

# `range` makes numbers, and the end is *exclusive*

Sometimes you don't have a list to walk through. You just want to do
something a *fixed number of times* — three retries, ten epochs,
twenty rows. Or you want to count from 5 to 100. AI's go-to for both
is `range`.

`range` is the most innocuous-looking function in Python and the
single biggest source of off-by-one bugs in AI-generated code. The
rules are dead simple. Memorize them once.

## The two rules of `range`

```python
range(3)        # produces 0, 1, 2  →  three numbers, starts at zero
range(1, 4)     # produces 1, 2, 3  →  starts at first, stops *before* second
```

Two rules, both visible in the editor on the right:

1. **One argument: `range(n)` produces `0, 1, 2, ..., n-1`.** It
   counts from zero, not one. There are exactly `n` numbers, and
   `n` itself is *not* included.
2. **Two arguments: `range(start, stop)` produces `start, start+1, ..., stop-1`.**
   Always inclusive at the start, **always exclusive at the end**.
   Whatever number you pass as `stop` will *never* appear.

The second rule is the one that bites everyone. `range(1, 4)`
produces `1, 2, 3` — *not* `1, 2, 3, 4`. Python stops before it ever
prints the `4`.

## Why "exclusive end" actually makes sense

It feels arbitrary at first. It isn't. It's chosen so that the most
common thing — *do something for every index of this list* — has the
shortest possible code:

```python
items = ["a", "b", "c"]
for i in range(len(items)):
    print(items[i])
```

`len(items)` is `3`. `range(3)` gives you `0, 1, 2`. Those are
exactly the valid indexes of a 3-item list. If `range` were inclusive
at the end, you'd have to write `range(len(items) - 1)` every single
time, and forgetting the `- 1` would crash with `IndexError`.

The exclusive-end rule trades a small amount of "wait, why?" up front
for a complete absence of off-by-one bugs in the most common loop
pattern.

## Where AI specifically gets `range` wrong

Three failure modes to watch for in Cursor's code:

1. **`range(1, n)` instead of `range(0, n)`.** AI sometimes writes
   `for i in range(1, len(items)):` when it meant to walk the whole
   list. The first item gets silently skipped. We saw this in the
   indexing lesson; you'll see it again, in the wild.

2. **`range(n + 1)` to "include the end."** Cursor writes
   `range(n + 1)` when it wants to count up to and including `n`.
   That works, but is the wrong fix when the original mistake was
   thinking the end was inclusive in the first place. Skim for it
   anyway.

3. **`range` with non-integer arguments.** `range(0, 1, 0.1)` is a
   `TypeError` — `range` only takes integers. If you want to step
   through floats, AI should reach for `numpy.arange` or a
   comprehension, not `range`. When you see `range` crash this way,
   the fix is a different tool, not a different argument.

Run the editor. The first loop prints `0, 1, 2`. The second prints
`1, 2, 3`. **The `4` never appears**, and that's the rule to keep in
your head every time you read a loop with `range` in it.
