---
xp: 2
estSeconds: 60
concept: walking-nested-with-loop
code: |
  org = {
      "name": "pyloft",
      "teams": [
          {"name": "eng", "members": ["maya", "marcus"]},
          {"name": "ops", "members": ["riley"]},
      ],
  }

  for team in org["teams"]:
      print(team["name"], "→", len(team["members"]))
---

# Loop through the list, dict-access each item

When you have a list of dicts, the typical pattern is to loop over the
list and pull fields out of each dict. AI writes this constantly.

Two rules to keep in your head while reading nested code:

1. After `for X in Y["key"]`, `X` is one element of that list. If the
   list held dicts, `X` is a dict.
2. The keys you can read from `X` are whatever keys those inner dicts
   actually have — not the keys of the outer dict.

Run the editor. The loop visits each team, prints the team name, and the
member count for that team. The two `team["name"]`s come from *different*
dicts, even though they share a key name.
