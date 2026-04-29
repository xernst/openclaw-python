---
xp: 1
estSeconds: 80
concept: for-loop-over-list
code: |
  pets = ["luna", "moose", "biscuit"]
  for pet in pets:
      print(pet)
runnable: true
---

# Loops — what AI writes when you say *for each*

You will say a version of this sentence to Cursor at least once a day:

- *Go through every row in the CSV and...*
- *For each user in the list, send...*
- *Loop over the messages and find the one with...*

Every one of those phrases triggers the same construct. AI does not
write the same logic three times. It writes a **`for` loop** — a
block of code that runs once per item in a collection.

Loops are the workhorse of every script you'll read this year. If you
can read one cleanly, you can read 80% of the data-processing code
Cursor will hand you.

## The mental model: rebind, run, repeat

A `for` loop has three moving parts that fire in order, on every
pass:

```python
for pet in pets:
    print(pet)
```

1. **Rebind.** The loop variable (`pet`) gets stuck on the next item
   in the source (`pets`). The first time around, `pet` is `"luna"`.
   The second, `"moose"`. The third, `"biscuit"`.
2. **Run the body.** Whatever's indented under the `for` line runs,
   using the current value of `pet`.
3. **Go around again.** Until there are no more items, then the loop
   ends and the program moves on.

The thing to notice: **the loop variable is just a regular variable**.
It gets rebound every iteration (remember the assignment chapter —
"labels stuck on values"). After the loop ends, `pet` still exists,
holding whatever the last item was. That's a quirk that bites people
exactly once.

## A worked example

The editor on the right has a 3-pet list. Trace what happens when you
hit Run:

| Pass | `pet` is... | Output |
|------|-------------|--------|
| 1    | `"luna"`    | `luna` |
| 2    | `"moose"`   | `moose` |
| 3    | `"biscuit"` | `biscuit` |
| —    | (loop ends) | — |

Same `print(pet)` line, three different outputs. Because `pet`
points at a different value each time. The body of the loop is
*static text*; the variable inside it is *what changes*.

## Where AI specifically gets loops wrong

Two patterns to watch for in code Cursor writes:

1. **Using a too-generic loop variable.** AI sometimes writes
   `for x in users:` when `for user in users:` would make the body
   readable. When you read AI code with single-letter loop variables
   over rich data, it's worth renaming them mentally as you go —
   `x["email"]` is harder to track than `user["email"]`.

2. **Mutating the list while looping it.** This is one of the most
   famous Python footguns. If you write:

   ```python
   for user in users:
       if user["inactive"]:
           users.remove(user)
   ```

   …Python silently skips items. The loop's internal index moves
   forward while the list shrinks underneath it. Cursor still ships
   this in 2026 if you ask for "remove inactive users in the loop."
   The fix is to build a *new* filtered list with a comprehension,
   which we'll cover later in this chapter.

Run the editor. Three names, three lines, one loop body running
three times.
