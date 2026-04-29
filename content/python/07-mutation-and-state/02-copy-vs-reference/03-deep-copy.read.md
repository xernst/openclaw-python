---
xp: 1
estSeconds: 110
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

Now we hit the trap that bit you the moment you started learning
about copies. `.copy()` works perfectly for a flat list. The instant
your data has a *nested structure* — a list inside a dict, a dict
inside a list, anything more than one level deep — `.copy()` only
copies the outer layer. The inside is still shared.

This is the mutation bug from earlier in the chapter, scaled up to
nested data. And nested data is what every API response, every JSON
config, every database row looks like. So this isn't an obscure edge
case — it's the *common case* for any real codebase.

## What "shallow" actually copies

```python
user = {"name": "alex", "skills": ["python", "sql"]}
shallow = user.copy()
```

`user.copy()` builds a *new dict*. The new dict has the same keys
(`"name"`, `"skills"`) and points each key at *the same value the
original pointed at*. That's fine for `"name"` (the string `"alex"`
is immutable — you can't mutate a string). It's *not fine* for
`"skills"`, because the list at that key is *the exact same list
object* in both dicts.

Picture it:

```
user["skills"]    ───┐
                     ▼
                 ["python", "sql"]
                     ▲
shallow["skills"] ───┘
```

Two dicts. Two `"skills"` keys. *One list*. If you `.append()` to
either of them, the list — the one shared list — grows, and both
dicts see it.

The editor on the right does exactly that. `shallow["skills"].append("javascript")`
reaches *into* the shared inner list and adds an item. Run it:

```
user:     {'name': 'alex', 'skills': ['python', 'sql', 'javascript']}
shallow:  {'name': 'alex', 'skills': ['python', 'sql', 'javascript']}
deep:     {'name': 'alex', 'skills': ['python', 'sql']}
```

Both `user` and `shallow` got the new skill. `deep` didn't.

## The fix: `copy.deepcopy`

```python
import copy

deep = copy.deepcopy(user)
```

`copy.deepcopy` walks every level of the structure and rebuilds *all
of it*. New outer dict, new inner list, new everything. The result is
a structure with *no shared references* to the original at any depth.

Mutating any part of `deep` — `deep["skills"].append(...)`,
`deep["name"] = "..."`, anything — leaves `user` untouched.

The cost: it's slower than `.copy()`. For a few records you'll never
notice. For a list of ten thousand nested objects, you might. The
trade is *correctness* (always works on nested data) for *speed*
(slightly more allocation).

## When AI specifically gets this wrong

Three common patterns in Cursor's nested-data code:

1. **"Backup before transform" with `.copy()`.**
   ```python
   backup = response.copy()
   process(response)   # mutates response["users"]
   if something_failed:
       response = backup    # didn't actually back anything up
   ```
   Same shape as the previous-lesson bug, but now it bites at the
   nested level. The fix: `backup = copy.deepcopy(response)`.

2. **Cloning a config to override a few fields.**
   ```python
   default_config = {"retries": 3, "headers": {"x-key": "..."}}
   user_config = default_config.copy()
   user_config["headers"]["x-key"] = "different-key"
   ```
   You just *also* changed `default_config["headers"]["x-key"]`,
   because `headers` is the same dict in both. Every subsequent
   request that uses `default_config` is now using the user's key.
   The fix: `deepcopy`.

3. **Putting nested objects in a cache.** When AI builds a memoize
   helper that stores results in a dict, mutating the cached value
   from the call site silently changes the cache. We'll see that
   pattern when we cover decorators and closures.

## The rule of thumb to internalize

> **Flat structure (list of numbers, dict of strings) → `.copy()` is
> fine. Nested structure (list of dicts, dict with lists, anything
> with another container inside) → `copy.deepcopy(thing)`.**

When you read AI code that does `.copy()` on a structure that's
clearly nested (an API response, a config object, anything from
JSON), flag it. The bug is dormant; it'll surface the first time
something downstream mutates a nested field.

Run the editor. Watch `user` and `shallow` both grow. `deep` stays
clean.
