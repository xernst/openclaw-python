---
xp: 1
estSeconds: 100
concept: nested-data-introduction
code: |
  response = {
      "ok": True,
      "users": [
          {"id": 1, "name": "maya", "tags": ["admin"]},
          {"id": 2, "name": "marcus", "tags": ["billing", "ops"]},
      ],
  }

  print(response["users"][1]["name"])
  print(response["users"][1]["tags"][0])
runnable: true
---

# AI dumps nested JSON. You walk it.

Open any production AI codebase and look at where the bugs are. Most
of them are not in algorithms or business logic. They're at the spot
where some response from an API gets unpacked into Python objects.
Cursor calls Stripe, Cursor calls OpenAI, Cursor calls a webhook
endpoint — and the response is a dict, that holds a list, that holds
more dicts, four or five layers deep.

This lesson is about reading those shapes without flinching.

## The mental model: each bracket is one step

Every nested access is a path through the structure, one bracket at a
time. There are exactly two kinds of step:

- **`["key"]`** — you're inside a dict, opening one of its keys.
- **`[index]`** — you're inside a list, picking one of its positions.

That's it. There is no third kind of step. No matter how deep the
JSON gets, every single bracket is one of those two moves.

When you read `response["users"][1]["name"]`, your job is to call out
each step:

1. `response` — start with the whole thing. It's a dict.
2. `["users"]` — open the `"users"` key. The value at that key is a
   list of user dicts.
3. `[1]` — pick index `1` of that list. That's the second user. It's
   a dict.
4. `["name"]` — open the `"name"` key on that user dict. It's a
   string.

Slow. Deliberate. One bracket per beat. With practice this happens in
your head in under a second, but build the habit now while the path
is short.

## The worked example

The editor has a pretend API response. Read the structure first:

```python
response = {                              # outer: dict
    "ok": True,                           # bool
    "users": [                            # list of dicts
        {"id": 1, "name": "maya", "tags": ["admin"]},
        {"id": 2, "name": "marcus", "tags": ["billing", "ops"]},
    ],
}
```

Now the two reads:

- `response["users"][1]["name"]` walks dict → list → dict → string.
  Result: `"marcus"`.
- `response["users"][1]["tags"][0]` walks dict → list → dict → list →
  string. Result: `"billing"`.

The second one stacks one extra hop because `tags` itself is a list.
That's the pattern: lists hold dicts, dicts hold lists, repeat until
you reach a string or a number.

## Where AI specifically gets nested access wrong

Two predictable failure modes when Cursor walks nested data:

1. **Missing keys.** If `response` doesn't have `"users"` for some
   reason — maybe the API returned an error shape — `response["users"]`
   crashes with `KeyError: 'users'`. The defense is `dict.get`, which
   returns `None` instead. We'll cover that in the lesson after this.

2. **Empty lists.** `response["users"][0]` crashes with `IndexError`
   if the users list came back empty. AI sometimes assumes "there
   will always be at least one item," and the script blows up the
   first time the user has no records.

Both bugs feel rare in dev — the response shape is usually predictable
when you're testing. Both are extremely common in production, where
edge cases find you whether you wanted them or not.

Run the editor. Two prints, two paths through the same structure.
Watch which brackets are `[index]` and which are `["key"]`.
