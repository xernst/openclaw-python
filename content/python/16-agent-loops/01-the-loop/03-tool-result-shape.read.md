---
xp: 2
estSeconds: 80
concept: tool-result-message-shape
code: |
  # the conversation so far — what the agent loop has accumulated.
  # note how the assistant's tool_use becomes the user's tool_result
  # in the very next turn.

  messages = [
      {"role": "user", "content": "What's the weather in Tokyo?"},
      {
          "role": "assistant",
          "content": [
              {"type": "text", "text": "Let me check."},
              {
                  "type": "tool_use",
                  "id": "toolu_01",
                  "name": "get_weather",
                  "input": {"city": "Tokyo"},
              },
          ],
      },
      {
          "role": "user",
          "content": [
              {
                  "type": "tool_result",
                  "tool_use_id": "toolu_01",
                  "content": "72F, partly cloudy",
              }
          ],
      },
  ]

  for turn in messages:
      print(turn["role"])
---

# The `tool_result` reply has to match the `tool_use` it answers

Once the model returns a `tool_use` block, your loop runs the actual
tool, then sends the answer back as a *new user turn* — with a
`tool_result` block inside.

```python
{
    "role": "user",
    "content": [
        {
            "type": "tool_result",
            "tool_use_id": "toolu_01",      # must equal the tool_use id
            "content": "72F, partly cloudy",
        }
    ],
}
```

Three things to lock in:

1. **The role flips back to `user`.** Even though *you* are responding
   to the model, the protocol says your turn is the user turn. The
   model never directly emits its own tool results.
2. **`tool_use_id` is a hard link.** It must exactly equal the `id`
   from the tool_use block. If you call the model again with a missing
   or wrong id, the API returns 400.
3. **Multiple tool calls in parallel are common.** The model can emit
   *several* tool_use blocks in one assistant turn (e.g. "read these
   three files"). Your reply must include one tool_result per
   tool_use_id, in any order.

## What the model sees on the next round

The model now has the full transcript: the user question, its own
tool_use, and your tool_result. With that context, it usually returns a
plain text response with `stop_reason == "end_turn"` — *"It's 72°F and
partly cloudy in Tokyo."*

That's the round trip. One iteration of the agent loop.

Run the editor. We print the role of each turn so you can see the
`user → assistant → user` (with tool_result) shape.
