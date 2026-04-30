## The two data structures every API response is made of

Open the JSON tab in your browser's DevTools next time you load a website. Or run `curl https://api.github.com/repos/anthropics/claude-cookbook` in your terminal. The response is a tree of two things: lists (ordered collections in `[ ]`) and dicts (key-value maps in `{ }`). Sometimes nested fifteen levels deep, but always those two structures.

Every API you'll ever consume is a list-and-dict tree. Every JSON file you parse, every database row you load, every LLM response object — list-and-dict, list-and-dict, list-and-dict. Master these two and you can read any data Cursor or Claude Code hands you.

This chapter is about reading them on sight.

## The mental model

**Lists** are ordered. Items are accessed by position: `users[0]` is the first user, `users[-1]` is the last. Use a list when "first one I added" and "in the order I added them" matter.

**Dicts** are key-addressed. Items are accessed by name: `user["email"]` is the email field, `user["preferences"]["theme"]` is the theme inside the preferences dict. Use a dict when you have named fields and you want to look one up directly.

Real data is both. A JSON response from any API is typically a dict at the top level, with a list of items somewhere inside, where each item is itself a dict with named fields. The bones of every API.

```python
response = {
    "page": 1,
    "items": [
        {"id": 42, "title": "first thing"},
        {"id": 43, "title": "second thing"},
    ],
}
print(response["items"][1]["title"])  # "second thing"
```

That access path — `response["items"][1]["title"]` — is the most common pattern in Python data work. Read it left-to-right: dict-key, list-index, dict-key. Once that pattern reads cleanly to you, every API call you'll touch is approachable.

## What this chapter covers in three lessons

**Lesson 1: The bones of APIs.** Lists and dicts side by side, the access patterns, the iteration patterns (`for item in items`, `for key, value in d.items()`), and the AI-bug of mixing up index access on a dict (`users[0]` doesn't work; you want `users["first"]` or `list(users.values())[0]`).

**Lesson 2: List comprehensions.** Python's most-loved one-liner: `[x * 2 for x in numbers]`. AI uses these constantly because they're idiomatic. Reading them well is half of reading modern Python. Includes the dict comprehension and the trap of nesting them four levels deep "because it works."

**Lesson 3: Nested data shapes.** Real-world JSON: trees, missing keys, optional fields, the `.get(key, default)` pattern that doesn't crash on missing keys, and how to traverse a deeply nested response without getting lost in `.get(...).get(...).get(...)` chains.

## What AI specifically gets wrong with lists and dicts

Three patterns:

1. **`KeyError` from assuming a field exists.** API returns vary. AI writes `data["items"]` without checking, and the request that returned `data["error"]` instead crashes. The fix is `data.get("items", [])` — returns an empty list if missing. Lesson 3 step 6 drills this.

2. **Mutating a list while iterating it.** `for x in items: items.remove(x)` looks reasonable and silently skips elements. AI writes this when you ask it to "remove all items matching X." The fix is to iterate a copy or build a new list. Lesson 2 covers it.

3. **Subtle index off-by-one.** AI writes `range(len(items))` and indexes `items[i]` when it could just write `for item in items`. The longer form is where Cursor sometimes ships off-by-one bugs. We drill the cleaner pattern.

## What you'll be able to do at the end

Three lessons, ~27 steps. By the end you'll be able to:

- Read any JSON response (or Python dict/list nesting) and traverse to the value you want without getting lost.
- Use list and dict comprehensions for the patterns AI ships most often.
- Avoid the three top "AI ships wrong list/dict access" patterns in code review.
- Pull a value out of a four-levels-deep nested response confidently.

This is the chapter that makes API work approachable. Chapters 12 (HTTP and APIs), 13 (LLM APIs), 14 (structured output) all assume you can read nested data. The more this chapter clicks, the easier those land.

Press *Start chapter* below.
