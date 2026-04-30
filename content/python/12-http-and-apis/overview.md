## Every AI script eventually calls an API

Every interesting Python script you write this year will, at some point, hit an HTTP API. Get a weather forecast. Read a Linear ticket. Post a Slack message. Query a model. Save a record to your database. Underneath all of these is one verb: HTTP.

This chapter is the four lines of `httpx` that make an API call, plus everything you need to read what comes back: status codes, JSON parsing, the difference between a 404 and a 500, and the AI-generated mistakes that ship into network code constantly.

It's the chapter immediately before the wedge — the foundation that ch13 (LLM APIs) and every chapter after assumes you already have.

## The mental model

An HTTP call is a *request* (you send) and a *response* (you receive). Both have a few standard parts:

- **Method** — `GET` (read), `POST` (create), `PUT` (replace), `PATCH` (update), `DELETE` (remove). The verb that says what you're doing.
- **URL** — where you're hitting (`https://api.github.com/repos/anthropics/claude-cookbook`).
- **Headers** — metadata: `Authorization`, `Content-Type`, `User-Agent`. Not visible in the URL.
- **Body** — for `POST`/`PUT`/`PATCH`, the JSON payload you're sending.

The response has:

- **Status code** — `200` (good), `404` (not found), `401` (auth failed), `500` (server error). Three-digit number, the most diagnostic field in the response.
- **Headers** — server's metadata.
- **Body** — usually JSON, occasionally HTML or plain text.

`httpx` is the modern Python HTTP client. The `requests` library is older but widely-shipped; both work the same way for basic calls. Anthropic and OpenAI's official Python SDKs use `httpx` under the hood. AI ships both libraries; we standardize on `httpx`.

```python
import httpx

response = httpx.get("https://api.github.com/repos/anthropics/claude-cookbook")
response.raise_for_status()  # raise on 4xx or 5xx
data = response.json()
print(data["stargazers_count"])
```

Four lines. That's the API call. The rest of the chapter is variations on these four lines.

## What this chapter covers in three lessons

**Lesson 1: The shape of a call.** `httpx.get`, `httpx.post`, headers, query parameters, request bodies. Reading the four lines above and writing your own variants. Includes the AI-bug of forgetting `response.raise_for_status()` and treating a 500 response like a successful one.

**Lesson 2: Status codes and errors.** The status-code categories (2xx good, 3xx redirect, 4xx client error, 5xx server error), the most-seen specific codes (`200`, `201`, `400`, `401`, `403`, `404`, `429`, `500`, `502`, `503`), and the `httpx.HTTPStatusError` exception. AI ships code that checks `if response.status_code == 200` instead of `response.raise_for_status()` — both work, one's idiomatic.

**Lesson 3: Parsing nested responses.** Real APIs return deeply nested JSON. `response.json()["items"][0]["author"]["name"]`. Combines this chapter with chapter 3 (lists and dicts) — same skills, applied to a real API. Includes the bug Cursor ships when the API field is sometimes-present and the access path crashes on the missing case.

## What AI specifically gets wrong about HTTP

Three patterns:

1. **No timeout.** `httpx.get(url)` defaults to no timeout. If the server hangs, your script hangs forever. AI ships this constantly. The right pattern: `httpx.get(url, timeout=10.0)`. Lesson 1 step 5 fixes one.

2. **Treating 4xx/5xx as success.** Cursor sometimes writes `data = response.json()` without checking the status. If the response is a 500 with HTML in the body, `response.json()` crashes with a confusing JSON parse error and the real bug (the API returned 500) is invisible. Use `response.raise_for_status()`. Lesson 2 fixes a case of this.

3. **Hardcoded API keys in code.** AI sometimes writes `headers={"Authorization": "Bearer sk-ant-api03-..."}` with a real key inline. This is what chapter 18 (secrets and env) is for; this chapter plants the flag.

## What you'll be able to do at the end

Three lessons, ~27 steps. By the end you'll be able to:

- Make any standard HTTP API call from Python with `httpx` (or `requests`).
- Read a status code and tell what kind of failure it represents.
- Parse a nested JSON response and pull out the field you want.
- Spot the three top "AI shipped wrong API code" patterns in code review.

This is the keystone for ch13-22. Every wedge chapter assumes you can call an API and read the response. Get this chapter solid and the entire wedge installs cleanly on top — chapter 13 is "use this exact pattern, but the URL is `api.anthropic.com` and the body has a `messages` field."

Press *Start chapter* below.
