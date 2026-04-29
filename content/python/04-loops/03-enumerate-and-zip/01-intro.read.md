---
xp: 1
estSeconds: 90
concept: enumerate-introduction
code: |
  names = ["maya", "marcus", "riley"]

  for i, name in enumerate(names):
      print(i, name)
runnable: true
---

# `enumerate` — when AI needs the index too

About half the loops Cursor writes need *both* the value and its
position. *The third item.* *Line 12 of the file.* *Step 4 of the
workflow.* You can't get the position from a plain `for x in items`
loop — that just hands you values, with no way to tell which one is
which.

The wrong way to fix it (which non-coders try first, and which AI
sometimes mimics):

```python
for i in range(len(names)):
    name = names[i]
    print(i, name)
```

That's a four-line C-flavored solution to a one-line Python problem.
Python ships a built-in for exactly this case.

## The right shape: `enumerate`

```python
for i, value in enumerate(items):
    ...
```

`enumerate` walks any sequence and yields `(index, value)` tuples.
The `for i, value in ...` line *unpacks* each tuple into two named
variables — `i` for the position, `value` for the item.

Read it as: *"for each (index, name) pair when you walk the list…"*

By default, the index starts at `0`. If you want it to start at `1`
(common for human-readable output like "step 1, step 2, step 3"), pass
`start=1`:

```python
for i, name in enumerate(names, start=1):
    print(f"{i}. {name}")
```

That's the entire feature. One built-in, two arguments at most.

## A worked example

The editor on the right has three names:

```python
names = ["maya", "marcus", "riley"]

for i, name in enumerate(names):
    print(i, name)
```

Each iteration, `enumerate` produces a tuple — first `(0, "maya")`,
then `(1, "marcus")`, then `(2, "riley")`. The `for i, name` syntax
splits each tuple in half: `i` gets the number, `name` gets the
string.

Output:

```
0 maya
1 marcus
2 riley
```

Same logic as the four-line `range(len(...))` version, with a third
of the code and zero off-by-one risk.

## Where AI specifically gets indexing wrong

When you read AI code that walks a list with explicit indexes, watch
for these patterns:

1. **`for i in range(len(items)):` followed by `items[i]`.** This is
   the C-style version. It works, but it's the long way and it
   exposes the off-by-one bugs we covered earlier. Cursor sometimes
   writes it when it should write `enumerate`. When you see this
   shape, mentally rewrite it to `for i, item in enumerate(items):`
   and read from there.

2. **Tracking the index manually with a counter.**
   ```python
   i = 0
   for item in items:
       print(i, item)
       i += 1
   ```
   Same anti-pattern, two extra lines. Pure `enumerate` replacement.

3. **Starting the count at the wrong place.** Some AI-generated
   "human-readable" output starts at 0 when it should start at 1
   ("Step 0: …" looks weird). The fix is `enumerate(items, start=1)`,
   not a manual `i + 1` inside the f-string.

Run the editor. Three names, indexed `0`, `1`, `2`. No `range(len(...))`
needed.
