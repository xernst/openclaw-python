---
xp: 1
estSeconds: 35
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

# Every API response is some mix of two things

Every JSON blob you've copied out of ChatGPT, every REST response, every
config file Cursor wrote you — it's all the same two shapes nested inside
each other:

- **List** — `[a, b, c]` — ordered. Get an item by position: `tags[0]`.
- **Dict** — `{"name": "Maya"}` — labeled. Get a value by name: `user["name"]`.

The code on the right is a typical user object — a dict that contains a
list. Hit **Run**. Notice line 6 reaches into the list *inside* the dict
with `user["tags"][0]`. That stacking is what every API response looks like.
