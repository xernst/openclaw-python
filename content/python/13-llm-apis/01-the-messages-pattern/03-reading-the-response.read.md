---
xp: 2
estSeconds: 70
concept: llm-response-shape
code: |
  # exact shape Anthropic returns. content is a LIST of blocks.
  response = {
      "id": "msg_017abc",
      "model": "claude-sonnet-4-6",
      "role": "assistant",
      "stop_reason": "end_turn",
      "content": [
          {"type": "text", "text": "Paris is the capital of France."}
      ],
      "usage": {"input_tokens": 14, "output_tokens": 9},
  }

  # the text is buried two layers deep — list, then dict
  reply_text = response["content"][0]["text"]
  print(reply_text)

  # token usage is how you'll track cost
  cost_inputs = response["usage"]["input_tokens"]
  print(f"input tokens: {cost_inputs}")
---

# The response is a structured object, not a string

The biggest reason AI breaks on its own first LLM call: it treats the
response like it's just a string. It isn't. It's a structured object
with a list of `content` blocks, each tagged by `type`.

Why a list? Because a single response can contain multiple things —
plain text, a tool call, an image, a thinking block. Today you'll see
mostly `text`. Tomorrow, when we get to agents, you'll see `tool_use`
blocks in the same list.

The pattern AI ships every time:

- `response.content[0].text` — the actual reply text (Anthropic SDK)
- `response.choices[0].message.content` — the OpenAI equivalent
- `response.usage.input_tokens` / `output_tokens` — what you'll bill

Both SDKs return objects in production. In this lesson we use dicts that
match the same shape, so the indexing is identical: `response["content"]
[0]["text"]` instead of `response.content[0].text`. Same fields, two
notations.

The single most common AI bug here: writing `response["text"]` or
`response.text` directly. There is no top-level `text` field. The text
is always nested inside a content block.

Run the editor. Two reads from the same response: the reply, then the
token count.
