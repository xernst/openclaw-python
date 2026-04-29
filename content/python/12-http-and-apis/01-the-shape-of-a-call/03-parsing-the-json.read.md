---
xp: 2
estSeconds: 60
concept: response-json-as-dict
code: |
  # what `response.json()` would return for a typical user endpoint —
  # nested dict + list, exactly like the real API response shape.
  user = {
      "id": 7,
      "name": "maya",
      "email": "maya@pyloft.dev",
      "roles": ["admin", "billing"],
      "org": {"slug": "pyloft", "tier": "pro"},
  }

  print(user["name"])
  print(user["roles"][0])
  print(user["org"]["slug"])
---

# `response.json()` is just a Python dict

Every real API call ends the same way: you parse the body and dig into a
nested dict.

The pattern AI uses constantly:

- `data["name"]` — top-level field
- `data["roles"][0]` — first item of a list field
- `data["org"]["slug"]` — nested dict access

If the field is missing, you get a `KeyError`. If a list is empty, you
get an `IndexError`. Both are common in the wild — APIs add and remove
fields between versions, and AI code rarely accounts for that.

Run the editor. Three different access patterns on the same `user` shape.
