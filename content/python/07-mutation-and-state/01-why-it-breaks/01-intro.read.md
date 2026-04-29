---
xp: 1
estSeconds: 110
concept: mutation-vs-reassignment
code: |
  pets = ["luna", "moose"]

  def add_one(items):
      items.append("biscuit")

  add_one(pets)
  print(pets)
runnable: true
---

# A list passed to a function isn't a copy — it's the same list

If there is one chapter that separates "I can read AI's code" from "I
can debug AI's code in production," it's this one. Mutation bugs are
where the most expensive Python bugs in the wild come from. They're
silent, they look fine on inspection, and they cause data to change
in ways you didn't expect — without any error, anywhere.

This lesson is short on lines but long on consequences. Read slowly.

## What the editor on the right is doing

```python
pets = ["luna", "moose"]

def add_one(items):
    items.append("biscuit")

add_one(pets)
print(pets)
```

A function called `add_one`. Inside, it only ever uses a parameter
called `items`. Outside, the variable is called `pets`. The function
never assigns anything back to `pets`. The function never returns
anything.

Run it. After the call, `pets` has *three* items: `"luna"`,
`"moose"`, **`"biscuit"`**. The outside list grew, even though the
function only modified `items`.

If your mental model is "passing a list to a function copies it" —
which is how most other "things you've seen" might work — this
output is impossible. It is not impossible. It's the default Python
behavior. And it is the source of more "wait, my data changed by
itself" bugs than anything else in the language.

## The mental model: parameters share the same list

The crucial thing to absorb: **`items` and `pets` are not two lists.
They are two names pointing at one list.**

When you pass `pets` into `add_one(pets)`, Python doesn't make a
copy of the list. It hands the function the *same list*, with a new
local name (`items`). Now there are two labels on one list. When
`items.append("biscuit")` runs, it changes the *one list both
labels point at* — so when the function returns, `pets` reflects the
change too.

```
before call:    pets ───┐
                        │
                        ▼
                    [luna, moose]

inside call:    pets ───┐
                        ▼
                    [luna, moose]
                        ▲
                items ──┘

after append:   pets ───┐
                        ▼
                    [luna, moose, biscuit]
                        ▲
                items ──┘
```

Two labels. One list. Modify either name's list, and the *list*
itself has changed.

## Why this is the bug AI ships constantly

When you ask Cursor to *"just process the data"* or *"clean up this
list"* or *"add a default to each user"*, it sometimes writes the
processing logic to mutate the list in place. Functions that take
your data, modify it, and return nothing — looking like helper
functions but secretly altering your inputs.

Two function calls later, you're confused why `pets` has the wrong
contents. The bug is that the second function ran on the
already-mutated version of the list, not the one you passed in
originally.

This is the **#1 silent bug in AI-generated Python.** No traceback,
no warning, just code that runs and produces wrong data because the
data changed under it.

## The technical term: *mutation*

Python operations split into two categories:

- **Mutating operations** — change a list/dict/set *in place*.
  `.append()`, `.extend()`, `.remove()`, `.pop()`, `.sort()`, `del`,
  `[i] = value`, `.update()` on dicts. These are the dangerous ones
  in shared-reference situations.
- **Non-mutating operations** — produce a *new* container, leave the
  original alone. List comprehensions, `sorted()` (vs. `.sort()`),
  string concatenation, `dict | other_dict`. These are safe.

When you read AI code, scan for the mutating ones. Whenever you see
`.append`, `.remove`, `.sort`, `del`, or `[i] = value` on something
that came in as a function argument, ask: *is this function changing
its input on purpose, or is that a bug?*

## Where AI specifically gets this wrong

Two patterns to flag:

1. **"Helper" functions that mutate.** Cursor names a function
   `clean_users(users)` or `normalize(records)` and inside, mutates
   the input. The function returns nothing, but your data has
   silently changed. The convention in good Python is: either
   *return a new list*, or *clearly name the function so the
   mutation is obvious* (`sort_in_place`, `remove_duplicates_inplace`).

2. **Mutating shared default arguments.** We saw this in the
   functions chapter — `def add(item, items=[]):` — and the bug
   compounds with mutation. Each call mutates the *same default
   list*. Disaster.

Run the editor. Watch `pets` change after the function call. Mutate
once, mistake forever.
