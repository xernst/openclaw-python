---
xp: 1
estSeconds: 90
concept: zero-based-indexing
code: |
  pets = ["luna", "moose", "biscuit"]

  print(pets[0])
  print(pets[1])
  print(pets[2])
  print(pets[-1])
---

# Indexing starts at zero, and `-1` is the last item

This is the rule that produces the largest single category of bug in
all of programming, and AI is not exempt. Every off-by-one error,
every "skipped the first item," every "crashed on the last row" —
they all trace back to one thing: **lists count from zero, and humans
do not**.

You'll trip over this once. Then it's automatic forever.

## The two indexing rules

```python
pets = ["luna", "moose", "biscuit"]
#         0       1         2       <- positive indexes
#        -3      -2        -1       <- negative indexes
```

- **Positive indexes count from the start, beginning at `0`.** The
  first item is `pets[0]`. The third item is `pets[2]`.
- **Negative indexes count from the end, beginning at `-1`.** The
  last item is `pets[-1]`. The second-to-last is `pets[-2]`.

Read the editor on the right. With a 3-item list, `pets[2]` and
`pets[-1]` happen to point at the same item — `"biscuit"` — because
that's both "position 2 from the front" and "position 1 from the
back". This is a coincidence of length, not a rule.

## Why `-1` is the move AI loves

When you ask Cursor for *the last message*, *the most recent file*,
*the latest entry*, it almost always reaches for `[-1]`. Why? Because
you don't have to know the length of the list. `pets[len(pets) - 1]`
is the same as `pets[-1]`, but the second one is shorter and
length-agnostic.

You'll see this constantly in code that reads logs, tails feeds,
processes the most-recent record. Any time the prompt has the words
*"last"*, *"latest"*, *"most recent"*, the code has a `[-1]` in it.

## Where the off-by-one bug actually shows up

The classic AI flub: writing a `for` loop that walks a list and
secretly skips the first item.

```python
items = ["a", "b", "c"]
for i in range(1, len(items)):    # starts at 1, not 0!
    print(items[i])
```

That prints `"b"` and `"c"`. The `"a"` got silently dropped because
`range(1, len(items))` starts at `1`, but the first item is at index
`0`. Cursor writes this maybe 5% of the time when you ask for "loop
through the list," and the bug looks innocent until you notice your
output is short by one.

The right version:

```python
for i in range(len(items)):    # starts at 0
    print(items[i])
```

Or even better, the Python-native version:

```python
for item in items:
    print(item)
```

We'll drill this exact pattern in the loops chapter. For now, when
you see `range(1, ...)` in AI code, ask yourself: *did it mean to skip
index 0, or is that a bug?*

## What happens when you go off the end

Reading past the end of a list crashes:

```python
pets[10]   # IndexError: list index out of range
```

There's no "default" or "empty string" fallback. Python raises an
exception. This is one of the top three runtime errors you'll see in
AI-generated code, and the fix is always the same: check the length
first, or use a method that has a default (we'll cover `dict.get`
later for the dict version).

Run the editor and watch the four prints. `luna`, `moose`, `biscuit`,
`biscuit` — index `2` and index `-1` line up in a 3-item list.
