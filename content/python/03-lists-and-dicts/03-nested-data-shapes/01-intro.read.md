---
xp: 1
estSeconds: 50
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

# AI dumps nested JSON. You read it.

When Cursor calls an API, the response is almost never flat. It's a dict
that holds a list of dicts that hold more dicts. Walking that structure
is half the job.

The mental model: every step is either `["key"]` (you're inside a dict)
or `[index]` (you're inside a list). Read left to right, peel one layer
at a time.

In the editor, `response["users"]` gives you a list. `[1]` picks the
second user. `["name"]` reads a string from that user dict. `["tags"][0]`
reaches into the user's tag list.

Run it. Two prints, two paths through the same structure.
