---
xp: 1
estSeconds: 110
concept: http-status-families
code: |
  # the shape of a real call (read-only — we run a stub here because
  # the browser can't make actual network calls):
  #
  # response = httpx.get("https://api.example.com/users/7")
  # status = response.status_code
  # body = response.json()

  responses = [
      {"status": 200, "body": {"id": 7, "name": "maya"}},
      {"status": 404, "body": {"error": "user not found"}},
      {"status": 503, "body": {"error": "service unavailable"}},
  ]

  for r in responses:
      family = r["status"] // 100
      if family == 2:
          print("ok:", r["body"])
      elif family == 4:
          print("client error:", r["body"]["error"])
      elif family == 5:
          print("server error:", r["body"]["error"])
runnable: true
---

# Status codes — three numbers tell you everything

Every HTTP response carries a *status code*: a three-digit number
that tells you what happened. AI ships scripts that read the body
and ignore the status code constantly — and then can't figure out
why their data is empty when the API actually returned a 401
"unauthorized" page. Reading AI code, the first question is: *does
this script check the status code, and how?*

There are only three families that matter for everyday work, and
they're identified by the *first digit* of the code.

## The three families

- **`2xx` — success.** `200 OK` is the workhorse. `201 Created` is
  what you get back from a POST that made something new. `204 No
  Content` means "I did it, no body to return." All you need to
  know: anything in the 200s means the request worked.

- **`4xx` — client error. *You* are wrong.** `400 Bad Request`
  (your JSON was malformed). `401 Unauthorized` (no/invalid auth).
  `403 Forbidden` (auth was valid, but you can't access this).
  `404 Not Found` (the URL or resource doesn't exist). `429 Too
  Many Requests` (you hit the rate limit). The common thread: don't
  retry blindly. Fix the request.

- **`5xx` — server error. *They* are wrong.** `500 Internal Server
  Error` (something exploded on their side). `502 Bad Gateway`,
  `503 Service Unavailable`, `504 Gateway Timeout`. The common
  thread: it's not your fault and a retry might work in a few
  seconds.

The `// 100` trick: integer-divide a status by 100 to get the
family number. `200 // 100 == 2`, `404 // 100 == 4`, `503 // 100
== 5`. AI uses this exact pattern when bucketing responses.

## The shape AI ships when it gets it right

```python
import httpx

response = httpx.get("https://api.example.com/users/7")

if response.status_code == 200:
    data = response.json()
    process(data)
elif response.status_code == 404:
    return None
elif response.status_code >= 500:
    retry_later()
else:
    raise RuntimeError(f"unexpected status: {response.status_code}")
```

Four branches: success, expected-not-found, server-side flake, and
"this is a real bug." Reading AI code, you want to see this kind of
explicit branching, or at least a `response.raise_for_status()` that
crashes on anything not in `2xx`. (We'll cover that helper in the
next read step.)

## A worked example

The editor on the right works with three hardcoded fake responses
since the browser can't make real network calls:

```python
responses = [
    {"status": 200, "body": {"id": 7, "name": "maya"}},
    {"status": 404, "body": {"error": "user not found"}},
    {"status": 503, "body": {"error": "service unavailable"}},
]

for r in responses:
    family = r["status"] // 100
    if family == 2:
        print("ok:", r["body"])
    elif family == 4:
        print("client error:", r["body"]["error"])
    elif family == 5:
        print("server error:", r["body"]["error"])
```

Three iterations, three branches, three completely different
behaviors:

```
ok: {'id': 7, 'name': 'maya'}
client error: user not found
server error: service unavailable
```

Same code, three responses, branching on the family digit. This is
the mental model: ignore the exact code, look at the family, decide
the behavior.

## Where AI specifically gets this wrong

Two patterns to flag in code Cursor writes you.

**One: ignoring the status code entirely.** The script does
`response.json()` straight after the call without checking
`response.status_code` first. If the API returns 401 with a JSON
error body, `response.json()` actually succeeds and gives you back
`{"error": "..."}`. Now your downstream code expects `data["name"]`
and gets a `KeyError`. The traceback points at the wrong line. The
real bug is six lines higher: nobody checked the status.

**Two: treating 4xx and 5xx the same.** AI sometimes writes a
single `if response.status_code != 200: return None`. That hides
the difference between "the user doesn't exist" (a normal business
case) and "the upstream service is on fire" (a transient failure
that should be retried). Different responses warrant different
handling. Family-based branching is the move.

Run the editor. Three fake responses get routed to three different
branches based purely on the first digit of their status.
