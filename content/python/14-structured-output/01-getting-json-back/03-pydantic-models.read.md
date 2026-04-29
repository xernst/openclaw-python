---
xp: 2
estSeconds: 75
concept: pydantic-basemodel-shape
code: |
  # in real code with pydantic installed:
  #
  #     from pydantic import BaseModel
  #
  #     class Ticket(BaseModel):
  #         email: str
  #         severity: int
  #         summary: str
  #
  #     ticket = Ticket.model_validate_json(raw_text)
  #
  # we'll mimic that with a plain function and dict so it runs here.

  def validate_ticket(data):
      assert isinstance(data["email"], str), "email must be str"
      assert isinstance(data["severity"], int), "severity must be int"
      assert isinstance(data["summary"], str), "summary must be str"
      return data

  good = {"email": "maya@pyloft.dev", "severity": 2, "summary": "slow"}
  ticket = validate_ticket(good)
  print(ticket["email"])
  print(ticket["severity"])
---

# Pydantic models — the schema is the contract

A Pydantic model is just a Python class where every attribute has a type
hint. That class is *the contract* between your prompt and your
downstream code:

```python
from pydantic import BaseModel

class Ticket(BaseModel):
    email: str
    severity: int
    summary: str
```

Three things this gives you that AI relies on:

1. **JSON schema for free.** `Ticket.model_json_schema()` returns the
   exact schema you can pass to the model in a tool definition or
   `response_format`. The model now knows what shape you expect.
2. **One-line parse + validate.** `Ticket.model_validate_json(raw)`
   parses the JSON string, type-checks every field, raises
   `ValidationError` if anything is off. No manual `isinstance` checks.
3. **Real Python objects.** After validation you write `ticket.email`,
   not `ticket["email"]`. Your IDE autocompletes the field names and
   catches typos at edit time.

## Three field-type idioms you'll see constantly

```python
from typing import Literal
from pydantic import BaseModel, Field

class Issue(BaseModel):
    title: str
    severity: Literal["low", "medium", "high"]   # enum
    score: int = Field(ge=0, le=10)              # bounded int
    tags: list[str] = []                         # default empty list
```

`Literal[...]` for enums (the model is forced to pick one of three
strings). `Field(ge=..., le=...)` for numeric bounds. Default values
make a field optional. AI uses all three on every real schema.

Run the editor. We mimic Pydantic with a plain dict + assertions —
identical logic, just lower-level — so you can see what
`model_validate_json` does for you in one call.
