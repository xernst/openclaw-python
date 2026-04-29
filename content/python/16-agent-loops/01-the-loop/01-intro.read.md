---
xp: 1
estSeconds: 95
concept: agent-loop-overview
code: |
  # one round-trip in an agent loop, hardcoded.
  # the model returned a tool_use block instead of stopping.
  response = {
      "role": "assistant",
      "stop_reason": "tool_use",
      "content": [
          {"type": "text", "text": "Let me check the weather."},
          {
              "type": "tool_use",
              "id": "toolu_01",
              "name": "get_weather",
              "input": {"city": "Tokyo"},
          },
      ],
  }

  # is the model done, or do we owe it a tool result?
  if response["stop_reason"] == "tool_use":
      # find the tool_use block in content
      for block in response["content"]:
          if block["type"] == "tool_use":
              print(f"call {block['name']} with {block['input']}")
              print(f"tool_use_id = {block['id']}")
runnable: true
---

# An agent is a `while` loop with three rules

The word "agent" sounds magical. The implementation is anything but.
Claude Code, Cursor, every coding agent you've used — they all run the
same five-step loop. Once you see it, you'll never be intimidated by
the term again.

```
1. Send messages + tool definitions to the model.
2. Read the response.
3. If stop_reason == "end_turn": print the text and STOP.
4. If stop_reason == "tool_use": run the requested tool, append the
   tool_result to messages, GOTO 1.
5. (Bound the loop with a max iteration count to prevent runaways.)
```

That's the agent loop. The model decides what to do; your code wires
it to the world.

## The three blocks you'll see in `content`

After the model runs, `response.content` is a list of blocks. The two
that matter for agents:

- `{"type": "text", "text": "..."}` — natural language for the user
- `{"type": "tool_use", "id": "...", "name": "...", "input": {...}}` —
  the model is asking you to run a tool

When you respond back to the model, you send a `user` turn with a
matching `tool_result` block:

```python
{
    "role": "user",
    "content": [
        {
            "type": "tool_result",
            "tool_use_id": "toolu_01",      # MUST match the tool_use id
            "content": "72°F, sunny",
        }
    ],
}
```

The `tool_use_id` link is mandatory. The model needs to know *which*
tool call this result belongs to, because it may have made several in
parallel.

## The four stop reasons you actually care about

| `stop_reason` | What it means |
|---------------|---------------|
| `end_turn`    | Done. The model is finished. Exit the loop. |
| `tool_use`    | Run the requested tools and call again. |
| `max_tokens`  | The response was cut off. Increase budget or summarize. |
| `stop_sequence` | A custom stop string was hit (rarely used). |

If your loop doesn't check `stop_reason`, you have two bugs waiting:
ignoring `tool_use` (the agent stalls) and never exiting on `end_turn`
(infinite loop, dead API key).

## Where AI specifically gets this wrong

- **Treating any response as final.** Cursor's first agent attempt
  almost always misses the `tool_use` branch and returns whatever
  text was alongside the tool call as the "answer." Wrong answer.
- **Mismatched `tool_use_id`.** Hardcoding `"id": "1"` in the
  tool_result instead of echoing the model's actual id. The model
  rejects the next call.
- **No iteration cap.** A misbehaving agent that loops on the same
  tool call can drain a budget in minutes. Always cap at 8-16
  iterations.

> **Browser note:** real agent loops need network calls. We'll mimic
> the model with a hardcoded function that returns either `tool_use`
> or `end_turn` based on the conversation so far. Same loop, no wire.

Run the editor. We inspect a single `tool_use` response — what your
loop sees right before it has to run the requested tool.
