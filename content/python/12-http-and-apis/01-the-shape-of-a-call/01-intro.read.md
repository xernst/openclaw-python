---
xp: 1
estSeconds: 50
concept: http-call-shape
code: |
  # this is the shape AI reaches for. we can't run real http calls in
  # the browser, so we'll use a hardcoded response below for the rest
  # of the lesson.
  fake_response_json = {
      "id": 7,
      "name": "maya",
      "email": "maya@pyloft.dev",
  }

  print(fake_response_json["name"])
runnable: true
---

# The shape of an API call

Every AI-generated script that talks to a service does roughly this:

```python
import httpx

response = httpx.get("https://api.example.com/users/7")
response.raise_for_status()        # crash on 4xx/5xx
data = response.json()              # parse the body as JSON
print(data["name"])
```

Four lines. AI writes them on autopilot. Your job is to read them and
catch the two places it breaks: forgetting the status check, and
indexing into the JSON with the wrong key.

> **A note on this chapter:** the browser can't make real network calls.
> So instead of hitting a real URL, we'll work with hardcoded JSON shapes
> that match what an API would actually return. The pattern is the same;
> we just skip the wire.

Run the editor. We'll start by reading from a fake response.
