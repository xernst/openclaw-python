---
xp: 1
estSeconds: 80
concept: list-and-dict-shape
code: |
  user = {
      "name": "Maya",
      "tags": ["pm", "early-adopter"],
      "score": 92,
  }
  print(user["name"])
  print(user["tags"][0])
runnable: true
---

# Every API response is the same two shapes nested

Every JSON blob that comes back from a Stripe call, every config file
Cursor wrote you, every response from the OpenAI API, every row of
data your front end fetches — *all of it* is some mix of the same two
shapes wrapped around each other.

If you can read those two shapes, you can read 90% of the data you'll
ever touch. If you can't, every API integration becomes a guessing
game.

## The two shapes

```python
[10, 20, 30]                # list
{"name": "Maya", "score": 92}   # dict
```

- **List `[a, b, c]`** — *ordered*. Items live at numbered positions.
  You get them by index: `tags[0]` is the first item.
- **Dict `{"key": value}`** — *labeled*. Items live at named keys. You
  get them by name: `user["name"]` is the value at the `"name"` key.

That's the entire vocabulary. Every nested data structure you'll ever
read is one of these two shapes containing more of either of these
two shapes.

## The mental model: peel one layer at a time

When AI writes you code that reads `response["data"]["users"][0]["email"]`,
your eyes try to read it all at once and your brain panics. Don't.
Read **left to right, one bracket at a time**:

1. `response` — start with the whole thing (a dict).
2. `["data"]` — open the `"data"` key. What's inside? Probably another
   dict.
3. `["users"]` — open the `"users"` key. Now you have a list.
4. `[0]` — first item of that list. Whatever those items were —
   probably dicts.
5. `["email"]` — open the `"email"` key on that one. Read the string.

Five steps, one layer each. The pattern *never* gets more complicated
than this, no matter how nested the JSON gets. It just gets longer.

## A worked example

The editor on the right has a typical user object. Read the structure
top to bottom:

```python
user = {                     # outer shape: dict
    "name": "Maya",          # name → a string
    "tags": ["pm", "early-adopter"],   # tags → a list of strings
    "score": 92,             # score → a number
}
```

Then two reads:

- `user["name"]` — open the `"name"` key on `user`. You get `"Maya"`.
- `user["tags"][0]` — open the `"tags"` key on `user` (you get a list),
  then take index `0` (you get the first string in that list, `"pm"`).

That `["tags"][0]` move — *into a dict, then into a list* — is the
shape you'll see in literally every codebase that talks to an API.

## Where AI specifically gets this wrong

When Cursor writes code against an API response, it sometimes guesses
at the shape. It'll assume `response["users"]` is a list when it's
actually a dict, or vice versa, and the code crashes with a confusing
error like `TypeError: list indices must be integers, not str`.

When you see that error in AI-generated code, the fix is almost always:
**print the thing one level up, eyeball the actual shape, and adjust
the brackets**. We'll drill that in the loops chapter and again in
nested data later in this chapter.

Run the editor. Two prints, two paths into the same little structure.
