---
xp: 2
estSeconds: 130
concept: defensive-nested-walk
code: |
  # GitHub search API response shape (simplified):
  github_response = {
      "total_count": 2,
      "items": [
          {
              "name": "fastapi",
              "owner": {"login": "tiangolo"},
              "stargazers_count": 70000,
          },
          {
              "name": "httpx",
              "owner": {"login": "encode"},
              "stargazers_count": 12000,
          },
      ],
  }

  # the safe walk: default to [] for the list, .get for nested fields
  for repo in github_response.get("items", []):
      name = repo.get("name", "<unnamed>")
      owner = repo.get("owner", {}).get("login", "<unknown>")
      stars = repo.get("stargazers_count", 0)
      print(f"{name} by {owner}: {stars}")
---

# Walking lists and dicts safely — the patterns AI should ship

The intro covered single-level access. Real responses are deeper —
lists of dicts of dicts of lists. This step covers the patterns
AI *should* be using when it walks them, and the trap to watch for
when it doesn't.

## The chained `.get(...)` pattern

The single most useful trick: `.get` on a dict returns a value
*you can call `.get` on again* — as long as you give it a dict-shaped
default:

```python
owner = repo.get("owner", {}).get("login", "<unknown>")
```

Two `.get`s, two defaults. If `owner` is missing, the first `.get`
returns `{}` (an empty dict), and the second `.get` runs on *that*,
returning `"<unknown>"`. If `owner` is present but doesn't have a
`login`, the second `.get` returns `"<unknown>"` directly. Either
way, no crash.

The rule for chains: **make sure the default at each step matches
the shape of the next step.** Dict next? Default to `{}`. List
next? Default to `[]`. Walking ends in a value? Default to whatever
makes sense (`""`, `0`, `None`).

## Loops over `.get(..., [])`

When the next step in the chain is "iterate," default to an empty
list:

```python
for repo in response.get("items", []):
    ...
```

If `items` is missing or `None`, the loop body simply doesn't
execute — nothing crashes. Compare to the unsafe version:

```python
for repo in response["items"]:    # KeyError if missing
    ...

for repo in response.get("items"):  # TypeError if missing (None is not iterable)
    ...
```

The first crashes loudly on missing `items`. The second crashes
*even louder* and points at the wrong line — the `for` rather than
the access. The `.get(..., [])` shape avoids both failure modes.

## When to be strict and when to be forgiving

The temptation is to slap `.get` on everything. Don't. **Strict
access is right when the field is required** — for example, the
`id` field on an OpenAI response. If `id` is missing, the response
is so broken that "default to None" is hiding a real problem.
Crash, log it, fix the upstream.

**Forgiving access is right when the field is genuinely optional**
— `usage` (only on final responses), `tool_calls` (only when the
model called a tool), `images` (only on multimodal responses). For
these, `.get(..., default)` is the right shape because absence is
an expected state.

The rule of thumb: read the API docs (or one good response) and
mark each field as required or optional. Strict access for
required, defensive for optional. Mixing them randomly is what
gives you the worst of both worlds.

## A worked example

The editor on the right walks a GitHub-shaped search response with
the chained `.get` pattern:

```python
for repo in github_response.get("items", []):
    name = repo.get("name", "<unnamed>")
    owner = repo.get("owner", {}).get("login", "<unknown>")
    stars = repo.get("stargazers_count", 0)
    print(f"{name} by {owner}: {stars}")
```

Three things to notice:

1. The outer `for` defaults to `[]`. If the response was missing
   `items` entirely, the loop simply doesn't run.
2. `owner` is a nested dict — the default `{}` lets the next `.get`
   work whether or not `owner` is present.
3. Each leaf field has a sensible default for its type:
   `"<unnamed>"` for strings, `0` for numbers.

Output:
```
fastapi by tiangolo: 70000
httpx by encode: 12000
```

If you removed the `owner` field from the second item entirely,
the code still runs — it would print `httpx by <unknown>: 12000`.

## Where AI specifically gets this wrong

Three patterns to flag.

**One: `.get(...)` with no default and then chaining.** Already
covered, but it's the single most common parse bug AI ships. If you
see `.get("items")[0]` anywhere, that's a `TypeError` waiting for
the first response that omits `items`.

**Two: forgetting that *list* indexing is unsafe too.** Even with
chained `.get`s on dicts, `choices[0]` blows up if `choices` is an
empty list. The defensive version: `choices = response.get("choices",
[])` then `if not choices: return None` then `choices[0]`. We'll
practice this in the fix step.

**Three: silent `None` propagation.** If the chain returns `None`
from a missing field, and the caller doesn't check, the `None`
flows downstream and crashes somewhere unrelated. Always handle the
"missing" case at the parse site — log it, return a sentinel, raise
a custom exception. Don't let `None` leak.

Run the editor. The walk handles two complete repos cleanly, but
the same code would gracefully handle a response missing any of the
nested fields.
