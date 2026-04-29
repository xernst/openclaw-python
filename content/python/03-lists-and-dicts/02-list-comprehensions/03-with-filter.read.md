---
xp: 1
estSeconds: 95
concept: comprehension-filter
code: |
  scores = [55, 91, 72, 40, 88, 65]

  # keep only the passing scores
  passing = [s for s in scores if s >= 70]

  # double every score, but only the passing ones
  doubled = [s * 2 for s in scores if s >= 70]

  print(passing)
  print(doubled)
---

# Comprehensions can filter, too — and that's where AI gets clever

You learned the basic shape: *new list, transform each item, walk the
source.* Now we add the fourth piece — a filter — and you have a
construct that handles roughly 60% of the data-shaping AI does in a
typical script.

Anytime you ask Cursor for *only the active users*, *just the failed
runs*, *only the scores above 70*, the answer comes back as a
filtered comprehension.

## The shape, with one piece added

```
[  expression   for item in iterable   if condition  ]
```

Read it left to right:

> *"a new list, where each item is `expression`, for every `item` in
> `iterable`, but **only when** `condition` is true."*

The `if` at the end acts as a gate. Items that pass the test go into
the new list. Items that fail get silently dropped — no error, no
placeholder, just gone.

## A worked example

The editor on the right has two filtered comprehensions over the same
list:

```python
scores = [55, 91, 72, 40, 88, 65]

passing = [s for s in scores if s >= 70]
doubled = [s * 2 for s in scores if s >= 70]
```

Trace each one:

- `passing` walks every score. For each `s`, it checks `s >= 70`. If
  true, it puts `s` (unchanged) into the result. **You get `[91, 72,
  88]`.**
- `doubled` does the same filter, but the expression is `s * 2`
  instead of `s`. So scores that pass get doubled, and scores that
  fail are dropped entirely. **You get `[182, 144, 176]`.**

Notice the structure: the **filter** decides *which* items survive.
The **expression** decides what shape they take in the new list. The
two are independent.

## The phrase that triggers this in AI's mind

Whenever your prompt to Cursor includes the words *"only the ones
that..."* or *"where..."* or *"if it has..."*, the response will
contain a filtered comprehension. Examples from the wild:

```python
active_users = [u for u in users if u["status"] == "active"]
recent_logs = [log for log in logs if log["ts"] > cutoff]
non_empty = [line for line in lines if line.strip()]
```

Same shape every time. Different verbs, same skeleton.

## Where AI specifically gets this wrong

Two patterns to flag in your reading:

1. **Filter and transform doing too much in one line.**
   `[user["email"].lower().strip() for user in users if user.get("verified") and user.get("active") and "@" in user["email"]]`
   is technically valid Python. It's also four logical operations
   crammed into one expression with no comment. When you see this in
   AI code, it's worth asking whether a real loop with intermediate
   variables would be more honest.

2. **Filtering on a value that might not exist.** If you write
   `[u for u in users if u["active"]]` and one user dict is missing
   the `"active"` key, the whole comprehension crashes with `KeyError:
   'active'`. The safe version uses `u.get("active")`, which returns
   `None` (falsy) instead of raising. That's the trap to flag when
   reading AI code that processes API responses.

Run the editor. `passing` shows `[91, 72, 88]`. `doubled` shows
`[182, 144, 176]`. Same source list, two different result shapes,
both filtered.
