---
xp: 2
estSeconds: 100
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

Once you have a list of dicts — and you will, every single time you
unpack an API response — the natural next move is to loop. Walk every
item in the list, pull a few fields out of each, do something. AI
writes this constellation of moves a *staggering* number of times in
any given file.

The pattern feels obvious in hindsight, but it has a couple of subtle
traps that catch new readers.

## The mental model: `for X in Y["key"]` is two operations

Read this line:

```python
for team in org["teams"]:
    ...
```

There are two things happening:

1. `org["teams"]` evaluates first. You're reaching into the dict to
   get the value at `"teams"`. That value is a list.
2. The `for ... in ...` then walks that list, one item at a time. On
   each iteration, the loop variable `team` holds one element of the
   list — which, since the list contained dicts, is itself a dict.

So inside the loop body, `team` is *one team dict*, not the whole
org, not the list. The keys you can read from it (`team["name"]`,
`team["members"]`) are whatever keys live on that inner shape — *not*
the keys of the outer `org`.

This is the reading habit to build: at the top of every loop body,
ask yourself *"what kind of thing is the loop variable right now?"*

## The worked example

The editor on the right has a small organization with two teams:

```python
org = {
    "name": "pyloft",
    "teams": [
        {"name": "eng", "members": ["maya", "marcus"]},
        {"name": "ops", "members": ["riley"]},
    ],
}

for team in org["teams"]:
    print(team["name"], "→", len(team["members"]))
```

Trace what happens:

- Iteration 1: `team` is `{"name": "eng", "members": ["maya",
  "marcus"]}`. So `team["name"]` is `"eng"` and
  `len(team["members"])` is `2`. Prints `eng → 2`.
- Iteration 2: `team` is `{"name": "ops", "members": ["riley"]}`. So
  `team["name"]` is `"ops"` and `len(team["members"])` is `1`. Prints
  `ops → 1`.

Notice: the two `team["name"]` reads return *different values*. The
key name is identical, but it's a different dict each time. That
trips up beginners reading nested code — they sometimes think
`team["name"]` "means" something fixed.

## Where AI specifically gets this wrong

Two patterns to watch for when Cursor writes nested-walk code:

1. **Looping the wrong layer.** AI sometimes writes
   `for team in org:` when it meant `for team in org["teams"]:`.
   The first one walks the *keys of the outer dict* (`"name"`,
   `"teams"`), not the list of teams. The bug looks confusing because
   the loop runs without crashing — it just hands you strings instead
   of dicts on each iteration.

2. **Reading a key that doesn't exist on the inner shape.** Cursor
   writes `team["url"]` because it remembered "url" from a different
   data structure earlier in the file. The keys on `team` are only
   `"name"` and `"members"`. You get `KeyError: 'url'`. Defense: when
   reading AI code, eyeball the actual data shape *before* trusting
   the keys it reaches for.

## Two more shapes you'll see this week

- **List of lists**: `for row in rows: for cell in row: ...` — typical
  for CSV or table data.
- **Dict of dicts**: `for user_id, user in users.items(): ...` — when
  the outer container is keyed by ID, not ordered.

Both are the same idea: loop the outer, reach into each item by its
shape. The reading habit is identical.

Run the editor. Watch the two lines print, one per team.
