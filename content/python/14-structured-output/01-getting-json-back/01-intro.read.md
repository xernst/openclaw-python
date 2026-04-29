---
xp: 1
estSeconds: 80
concept: structured-output-pattern
code: |
  # what a real LLM call WOULD return when you ask for JSON.
  # we work with the parsed dict directly — Pydantic isn't pre-loaded
  # in the browser, so we'll demonstrate the validation logic by hand.
  raw_text_from_model = '{"name": "maya", "role": "pm", "years_exp": 6}'

  import json
  data = json.loads(raw_text_from_model)

  # naive shape check — the kind Pydantic does for you in one line
  assert isinstance(data["name"], str)
  assert isinstance(data["years_exp"], int)
  assert data["years_exp"] >= 0

  print(f"{data['name']} ({data['role']}) — {data['years_exp']}y exp")
runnable: true
---

# Free-form text is not data

The first time you ask Claude to "extract the user's email from this
support ticket," it returns *exactly* what you wanted: `maya@pyloft.dev`.
The second time, it returns `Sure! The email is maya@pyloft.dev.`. The
third time, `The email address you're looking for is maya@pyloft.dev`.

Three different shapes. Your downstream code expected a string. Now it
either has to regex-extract the email out of natural language every
time, or fail.

This is why every production AI feature — without exception — uses
**structured output**: you tell the model *exactly* what JSON shape
to return, and you validate the response when it comes back.

The pattern AI ships every time:

```python
import anthropic
from pydantic import BaseModel

class Ticket(BaseModel):
    email: str
    severity: int          # 1-5
    summary: str

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=512,
    messages=[{"role": "user", "content": "Extract from: <ticket text>"}],
)

raw = response.content[0].text
ticket = Ticket.model_validate_json(raw)   # parse + validate in one call
print(ticket.email)
```

Three pieces. The schema (the `BaseModel` class), the prompt (asking for
JSON), and the validation step (`model_validate_json`). All three matter.
Skip the schema and you're back to regex-on-natural-language. Skip the
validation and you'll find out about the model's hallucinated field at
3am from a NoneType error in production.

> **Browser note:** Pydantic isn't bundled with Pyodide. We'll use plain
> `dict` validation here — same logic, just spelled out — so you can
> read and write the pattern. Switching to `BaseModel` later is a
> two-line change.

## Where AI specifically gets this wrong

- **Trusting the model on first try.** Models lie. They drop required
  fields, return strings where you wanted ints, and invent enum values
  you never defined. Validate every response.
- **Forgetting `response_format` / tool use.** On OpenAI you set
  `response_format={"type": "json_object"}`. On Anthropic you typically
  use a tool definition. Without one, the model wraps its JSON in prose.
- **Catching `ValidationError` too broadly.** When Pydantic rejects a
  response, you usually want to retry with the error message back to
  the model — not silently fall through.

Run the editor. We extract a name and validate the shape by hand.
