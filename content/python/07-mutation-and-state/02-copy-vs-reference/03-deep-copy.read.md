---
xp: 1
estSeconds: 60
concept: shallow-vs-deep
code: |
  import copy

  user = {"name": "alex", "skills": ["python", "sql"]}

  shallow = user.copy()
  deep = copy.deepcopy(user)

  # mutate the nested list through the shallow copy
  shallow["skills"].append("javascript")

  print("user:    ", user)
  print("shallow: ", shallow)
  print("deep:    ", deep)
---

# Shallow copy + nested data = surprise mutation

When the items inside your container are *also* containers — a list of
lists, a dict with a nested list, a list of dicts — `.copy()` only copies
the outer layer. The inner stuff is still shared.

Run the code on the right.

`shallow["skills"].append("javascript")` reaches **into** `user["skills"]`
through the shared inner list. Both `user` and `shallow` now show the new
skill. `deep` is the only one that's still clean.

Two rules of thumb:

- Flat structure (list of numbers, dict of strings) → `.copy()` is fine
- Nested structure (list of dicts, dict with lists inside) → use
  `copy.deepcopy(thing)` from the `copy` module

`deepcopy` rebuilds every layer. It's slower, but it's the only way to
get a *truly* independent copy of a nested thing.
