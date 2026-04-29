---
xp: 1
estSeconds: 110
concept: shared-list-reference
code: |
  a = [1, 2, 3]
  b = a

  b.append(4)

  print("a:", a)
  print("b:", b)
---

# `b = a` doesn't copy. It just gives the same list a second name.

Last lesson, the mutation happened across a function boundary. This
lesson, it happens in three lines of straight-line code, with *no
function call at all*. That's how shallow the bug is. And it's the
exact thing AI ships when you ask it to "make a backup before
modifying."

## The mental model, again, for emphasis

```python
a = [1, 2, 3]
b = a
```

A naive read: *"`a` is a list with three items, `b` is a list with
three items."* Wrong. The right read: *"`a` is a list with three
items, **and `b` is a second name for that same list**."*

Remember the labels-on-values mental model from chapter 1? `a = [1,
2, 3]` stuck the label `a` on a list. `b = a` looked at what `a`
pointed at, and stuck the label `b` on the same value. There is one
list. There are two names for it.

Run the editor. After `b.append(4)`:

```
a: [1, 2, 3, 4]
b: [1, 2, 3, 4]
```

Both names show four items. Because there's only one list, and you
appended to it.

## Why this is the bug AI ships when you say "back it up"

Watch this scene play out. You ask Cursor:

> *Before you modify the user list, make a backup so I can roll back.*

Cursor writes:

```python
backup = users
users.append(new_user)
# ... later, if something goes wrong ...
users = backup    # rollback?
```

This *looks* like backup-and-restore. It is not. `backup = users`
gave you a second name for the same list. `users.append(new_user)`
mutated it. Now `backup` and `users` *both* contain the new user.
Setting `users = backup` doesn't restore anything — it just rebinds
`users` to the same already-mutated list.

The bug looks innocent enough that it's been shipped to production
many, many times. The "rollback" path silently does nothing. This is
not a hypothetical — it's a category of bug big enough to have
caused real outages.

## How to actually copy a list

If you want a real, independent copy of a list, you have to *make a
new one*. Three idiomatic ways:

```python
b = a[:]         # slice from start to end → new list with same contents
b = list(a)      # the list() constructor builds a new list from any iterable
b = a.copy()     # the .copy() method, added in Python 3.3
```

Pick whichever reads best in context. They all do the same thing:
allocate a *new* list and fill it with the same items. After any of
them, you have *two* lists, each with its own future:

```python
a = [1, 2, 3]
b = a.copy()
b.append(4)

# a: [1, 2, 3]      <- unchanged
# b: [1, 2, 3, 4]
```

Now mutating `b` only changes `b`. `a` is safe.

## Where AI specifically gets this wrong

Three patterns to flag in code Cursor writes:

1. **"Backup before modify" via assignment.** As above. Always check:
   does the "backup" actually allocate a new list, or just rename the
   existing one? `backup = users.copy()` good. `backup = users` bad.

2. **Returning the same list a function took as input.**
   ```python
   def normalize(records):
       records.sort()
       return records
   ```
   The caller might think they got back a *normalized copy*. They
   didn't. They got the *original list, mutated and handed back*.
   Cursor sometimes writes this and the original input changes
   silently as a side effect.

3. **`for record in records: records.remove(record)` in some form.**
   We mentioned this in the loops chapter — mutating a list while
   iterating it produces silent skips. This is mutation cocktail #1
   for AI-shipped bugs.

The fix for all three is the same: **prefer non-mutating operations,
or copy first**. Build new lists with comprehensions. Pass copies
into functions that might mutate. The discipline of "this function
takes input and returns a new value, never modifies its input" makes
mutation bugs vanish.

Run the editor. Watch both `a` and `b` print `[1, 2, 3, 4]`. Same
list, two labels.
