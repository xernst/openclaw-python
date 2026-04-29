---
xp: 2
estSeconds: 130
concept: raise-for-status-and-retries
code: |
  # In real code: response.raise_for_status() crashes on any 4xx/5xx.
  # We simulate it here with a class that mimics httpx.Response.

  class FakeResponse:
      def __init__(self, status, body):
          self.status_code = status
          self._body = body

      def json(self):
          return self._body

      def raise_for_status(self):
          if 400 <= self.status_code < 600:
              raise RuntimeError(f"HTTP {self.status_code}")

  responses = [
      FakeResponse(200, {"id": 7}),
      FakeResponse(429, {"error": "rate limited", "retry_after": 1}),
      FakeResponse(500, {"error": "internal"}),
  ]

  for r in responses:
      try:
          r.raise_for_status()
          print("ok:", r.json())
      except RuntimeError as err:
          if r.status_code >= 500:
              print(f"retry-worthy: {err}")
          else:
              print(f"caller bug: {err} body={r.json()}")
---

# `raise_for_status`, error bodies, and the retry decision

Two things AI does once it's checking status codes correctly: it
uses `response.raise_for_status()` to convert bad statuses into
exceptions, and it inspects the *body* of an error response to find
out what went wrong. This step covers both, plus the mental model
for retrying.

## `raise_for_status` — turn bad statuses into exceptions

`httpx` (and `requests`, the older library) ship a method that
crashes if the response was 4xx or 5xx:

```python
response = httpx.get("https://api.example.com/users/7")
response.raise_for_status()
data = response.json()
```

If `response.status_code` is 200, the call does nothing. If it's
404, it raises `httpx.HTTPStatusError`. The win: you don't have to
write `if response.status_code >= 400: raise ...` everywhere — one
method call replaces all of it.

When to reach for it: when "any non-2xx is a problem" is the right
default. When you specifically want to handle 404 differently from
500, drop back to manual `status_code` branching.

## Error bodies — read what the server is trying to tell you

When an API returns a 4xx or 5xx, it almost always includes a body
explaining what went wrong. Two shapes you'll see:

**Structured JSON.** Modern APIs (Stripe, GitHub, OpenAI, anything
with a real product team behind it) return JSON like:

```json
{"error": {"code": "invalid_request", "message": "missing field 'email'"}}
```

The `.json()` method works fine on these. The body tells you
*exactly* what to fix. Always log this — it's the difference
between debugging in two minutes and debugging in two hours.

**HTML stack traces / load balancer pages.** Older or
internal-facing APIs sometimes return a 500 with an HTML page
attached — a Flask traceback, an nginx default page, something
unparsable as JSON. Calling `.json()` on those raises
`JSONDecodeError`. Defensive code looks like this:

```python
try:
    err_body = response.json()
except ValueError:
    err_body = response.text[:500]   # fall back to raw text, truncated
```

`response.text` always works — it's the raw body as a string.
`.json()` only works when the body is JSON. AI sometimes writes
`response.json()` on the error path without considering this and
the error handler itself crashes — masking the original error.

## The retry mental model

The reason families matter is they tell you whether a retry has any
chance of working:

- **2xx** — no retry. It already worked.
- **4xx** — *don't retry*. The server told you your request was
  wrong. Sending the same request again will fail the same way. The
  one exception: `429 Too Many Requests` is a "wait then retry"
  signal, often with a `Retry-After` header.
- **5xx** — *retry, with backoff*. The server failed for reasons
  unrelated to your request. Wait a bit, try again. Wait longer if
  it fails again. After 3-5 attempts, give up and surface the error.

"Backoff" means doubling the wait time each retry: 1s, 2s, 4s, 8s.
That gives the upstream service room to recover without you piling
on. AI rarely writes retry logic from scratch — it imports a
library like `tenacity`. Reading AI code, what matters is whether
the retry is *bounded* (a `max_attempts=5`) and *targeted at 5xx*,
not at every error.

## A worked example

The editor simulates `raise_for_status()` with a fake response
class so we can demo the pattern without a network. Three responses
flow through:

```python
for r in responses:
    try:
        r.raise_for_status()
        print("ok:", r.json())
    except RuntimeError as err:
        if r.status_code >= 500:
            print(f"retry-worthy: {err}")
        else:
            print(f"caller bug: {err} body={r.json()}")
```

The 200 hits the success branch. The 429 (treated as 4xx — caller's
problem) hits the "caller bug" branch and shows the body. The 500
hits the "retry-worthy" branch. Three responses, three
qualitatively different reactions, all from one helper.

## Where AI specifically gets this wrong

Three patterns to flag.

**One: `raise_for_status()` followed by `.json()` with no try.**
`raise_for_status` doesn't catch — it raises. If you don't wrap the
call in `try/except httpx.HTTPStatusError`, your script crashes on
any 4xx/5xx. AI sometimes ships this without the wrapper, treating
"crash on any error" as the spec.

**Two: retrying 4xx errors.** A common AI mistake: a generic
"retry on any exception" loop that re-sends the same broken request
to a 401-returning API five times. You hit the rate limit twice as
fast and the answer is still "auth was wrong." Retry only on 5xx
(and sometimes 429). Never on 4xx generally.

**Three: not logging the response body on errors.** When the script
does crash, the traceback shows `httpx.HTTPStatusError: 400 Bad
Request` and that's it. You have no idea *what* was bad. Always
log `response.text` (or `response.json()` defensively) when an
error fires. Future-you debugging at 2am will thank you.

Run the editor. Three fake responses, three branches, all driven by
the status code.
