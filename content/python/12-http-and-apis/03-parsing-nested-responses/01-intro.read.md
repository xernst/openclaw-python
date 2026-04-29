---
xp: 1
estSeconds: 110
concept: nested-response-shapes
code: |
  # the shape of a real LLM response (hardcoded — Pyodide can't make
  # a live API call, but the JSON below is the actual shape from
  # OpenAI/Anthropic chat completions):

  response = {
      "id": "chatcmpl-abc123",
      "model": "gpt-4o-mini",
      "choices": [
          {
              "index": 0,
              "message": {
                  "role": "assistant",
                  "content": "the answer is 42"
              },
              "finish_reason": "stop"
          }
      ],
      "usage": {"prompt_tokens": 12, "completion_tokens": 8}
  }

  text = response["choices"][0]["message"]["content"]
  print(text)
runnable: true
---

# Nested API responses — the bracket chains AI scripts are made of

Every meaningful API on the internet returns nested JSON. OpenAI
hides the assistant's text three levels deep (`choices[0]
.message.content`). Anthropic does it slightly differently
(`content[0].text`). GitHub returns a `repository` inside a
`repositories` array inside a `search_result`. Stripe wraps every
payment in a `data` array inside an `object: list` envelope.

Reading AI code, you'll see chains like
`response["choices"][0]["message"]["content"]` constantly. Knowing
how to read these chains, *and how to make them safe when a key
might be missing*, is what separates an AI script that survives
real traffic from one that crashes once a day on edge cases.

## The mental model

A nested response is a tree. Each `[...]` step takes you one level
deeper:

- `response["choices"]` — first step, you're now inside the list of
  choices.
- `response["choices"][0]` — second step, you're now inside the
  first choice (a dict).
- `response["choices"][0]["message"]` — third step, you're inside
  the message dict.
- `response["choices"][0]["message"]["content"]` — fourth step,
  you have the string.

Each step assumes the level above succeeded. If `choices` is missing
entirely, the second step crashes with a `KeyError`. If `choices`
is an empty list, the `[0]` step crashes with `IndexError`. Four
levels of nesting means four chances to crash.

## Two ways to access — and they fail differently

There are two ways to pull a value out of a dict in Python, and
they have meaningfully different failure modes:

```python
response["choices"]            # dict[key] — KeyError if missing
response.get("choices")        # dict.get(key) — returns None if missing
response.get("choices", [])    # dict.get(key, default) — returns the default
```

`response["choices"]` is *strict*. If the key isn't there, the
program crashes loudly. That's the right shape when the field is
*supposed* to be there and a missing one is a real bug.

`response.get("choices")` is *forgiving*. If the key isn't there,
it returns `None` and execution continues. That's the right shape
when the field is *optional* — for example, Anthropic only includes
a `usage` field on completed responses, never on streaming chunks.

`response.get("choices", [])` returns the default you specify
instead of `None`. This is useful when the next step is a list
operation — the default is an empty list, so `for choice in
response.get("choices", [])` works even when `choices` is missing.

## A worked example

The editor on the right has a real OpenAI/Anthropic-shaped response
and pulls the assistant text out with the standard four-step chain:

```python
response = {
    "choices": [
        {
            "message": {"role": "assistant", "content": "the answer is 42"},
            "finish_reason": "stop"
        }
    ],
    ...
}

text = response["choices"][0]["message"]["content"]
print(text)
```

The chain reads left-to-right: get the `choices` list, take the
first item, drill into `message`, pull out `content`. That's the
exact line AI ships in any wrapper it writes around an LLM call.
Output: `the answer is 42`.

## Where AI specifically gets this wrong

Three patterns to flag in code Cursor writes you.

**One: deep `[]` chains with no protection.** Code like
`response["choices"][0]["message"]["content"]` *assumes* every
level exists. Real production traffic includes weird edge cases:
empty `choices` (a content-filtered response), missing `message`
(an old API version), missing `content` (a tool call instead). One
bad response and the script crashes. We'll cover the safe shape in
the next read step.

**Two: using `.get()` *and* indexing the result.**
`response.get("choices")[0]` is worse than the strict version. If
`choices` is missing, `.get` returns `None`, then `None[0]` raises
`TypeError: 'NoneType' object is not subscriptable`. You traded a
clear `KeyError` for a confusing `TypeError` and called it
"defensive." The right shape is `.get("choices", [])` — return a
list either way.

**Three: mixing `.get()` and `[]` randomly.** In a single chain you
either commit to strict (`[]` everywhere) or defensive (`.get()`
with sensible defaults). AI mixes them, which gives you all the
disadvantages: chains that *might* crash and *might* return `None`,
with no way to predict which until it does. Pick a posture per
chain. Strict for required fields, defensive for optional ones.

Run the editor. Four levels of nesting, one clean string out the
other side.
