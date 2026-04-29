---
xp: 2
estSeconds: 100
concept: zip-pairs-and-mismatch
code: |
  cities = ["austin", "berlin", "tokyo"]
  zones = ["CST", "CET"]

  # zip stops at the shorter list — tokyo is silently dropped
  for city, zone in zip(cities, zones):
      print(city, zone)
---

# `zip` walks two lists in lockstep — and silently drops the leftovers

Half of "loop over the data" turns into "loop over *parallel* data."
You have names and scores in separate lists. Headers and values.
Inputs and expected outputs. A request and its response. Anytime you
need to walk two collections side-by-side, AI reaches for `zip`.

It's exactly the right tool for the job. It also has a single sharp
edge that has bitten every Python programmer who has ever used it.

## The mental model: tuples paired by position

```python
zip(a, b)
# yields (a[0], b[0]), (a[1], b[1]), (a[2], b[2]), ...
```

`zip` produces tuples by lining up the items in each input by
position — like a zipper closing two sides of a jacket. The first
items pair, the second items pair, and so on.

The `for x, y in zip(...)` syntax then unpacks each tuple into two
named variables, just like `enumerate` did. Read the line as:
*"for each (city, zone) pair when you walk these two lists side by
side…"*

## The trap: `zip` stops at the shorter list

Look at the editor:

```python
cities = ["austin", "berlin", "tokyo"]    # 3 items
zones = ["CST", "CET"]                    # 2 items

for city, zone in zip(cities, zones):
    print(city, zone)
```

You'd expect three iterations. You get two:

```
austin CST
berlin CET
```

`tokyo` is **silently dropped**. There's no warning, no error, no
indication anywhere in the output that an item was missed. `zip`
reaches the end of the shorter list and stops, full stop.

This is the single most predictable bug in `zip`-using code. If your
two lists are guaranteed the same length, you're fine. If they're
not — if they came from different parts of an API response, or one
got filtered upstream — `zip` swallows whatever doesn't fit.

## When AI reaches for `zip`

Phrases in your prompt that trigger `zip` in Cursor's mind:

- *"…match each X with its Y"*
- *"…pair these two lists together"*
- *"…walk these in lockstep"*
- *"…iterate over both at once"*

You'll see `zip(headers, row)`, `zip(question, answer)`, `zip(inputs,
expected)`, and so on. All the same shape.

## Where AI specifically gets `zip` wrong

Three patterns to flag in code Cursor writes you:

1. **No length check before `zip`.** AI assumes the two lists are
   the same length and silently truncates. Defense: when reading code
   that zips data of unknown size, ask whether the function should
   *crash* on mismatched lengths, *fill in defaults* for missing
   items, or *truncate*. Each is a valid choice; AI usually picks
   "truncate" because it's the default behavior of `zip`, not
   because it's what you wanted.

2. **Three-list `zip` getting truncated by a stale list.**
   `zip(names, scores, comments)` — if `comments` is shorter than the
   other two because it was missing from one record, you lose pairs
   from `names` and `scores` that you wanted to keep. The bug looks
   like *missing data* with no obvious cause.

3. **Reaching for `zip` when `enumerate` is the right tool.** AI
   sometimes writes `zip(range(len(items)), items)` when it just
   wanted indexing. That's `enumerate(items)` written the long way.
   Skim for it.

## The fix when you need to keep all items

When silently dropping isn't OK, use `itertools.zip_longest`:

```python
from itertools import zip_longest

for city, zone in zip_longest(cities, zones, fillvalue="UNKNOWN"):
    print(city, zone)
```

`zip_longest` keeps going until the *longest* list is exhausted, and
fills in your `fillvalue` for whichever side ran out. That gives you
all three iterations, with `tokyo UNKNOWN` on the third.

Run the editor. Two iterations. Notice that `tokyo` never prints —
that's the silent truncation in action.
