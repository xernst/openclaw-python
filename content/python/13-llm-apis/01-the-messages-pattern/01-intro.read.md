---
xp: 1
estSeconds: 75
concept: llm-messages-pattern
code: |
  # the shape every LLM call uses. we can't hit the network in the
  # browser, so we'll work with the response a real call WOULD return.
  fake_claude_response = {
      "id": "msg_01",
      "model": "claude-sonnet-4-6",
      "role": "assistant",
      "content": [
          {"type": "text", "text": "The capital of France is Paris."}
      ],
      "stop_reason": "end_turn",
  }

  reply = fake_claude_response["content"][0]["text"]
  print(reply)
runnable: true
---

# The four lines that talk to a model

When Cursor wires up a chatbot, a summarizer, an email drafter — anything
that uses an LLM — the call looks roughly the same. Four lines. The same
four lines, whether it's Claude or OpenAI:

```python
import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "What is the capital of France?"}],
)
print(response.content[0].text)
```

That's it. That's the whole API surface for 90% of what you'll ship this
year. The only thing that changes between scripts is what's inside
`messages` and how you read the response.

> **Browser note:** we can't make real network calls in here, so the
> editor uses a hardcoded dict that matches the exact shape of what
> Anthropic returns. The pattern is identical; we just skip the wire.

## The mental model: a list of turns

A `messages` array is a transcript. Each item is one turn in the
conversation, tagged with a `role`:

- `"user"` — what *you* (or your app) sent
- `"assistant"` — what the model said back

To continue a conversation, you append to the list. To start fresh, you
send a new list. The model has no memory between calls — every request
re-sends the entire transcript. Forgetting this is the single most
common bug AI writes when it builds a chat feature.

## Where AI specifically gets this wrong

Three traps Cursor falls into constantly:

1. **Sending a string instead of a list.** `messages="Hello"` will 400
   the API. It must be a list of dicts.
2. **Forgetting `max_tokens`.** Anthropic requires it; OpenAI doesn't.
   AI ports an OpenAI snippet to Claude and the call rejects.
3. **Reading `response["text"]` directly.** The response is a structured
   object — the text lives at `response.content[0].text`. Indexing the
   wrong field returns a list, not a string, and breaks the next
   `.lower()` you call on it.

Run the editor. We'll start by reading the text out of a stubbed
response.
