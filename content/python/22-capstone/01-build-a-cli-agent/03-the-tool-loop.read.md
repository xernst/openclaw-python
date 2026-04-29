---
xp: 1
estSeconds: 130
concept: agent-loop-mechanics
code: |
  # one full tool-use round-trip with hardcoded responses.

  def fake_llm(messages):
      # the model wants to call read_file once, then answer.
      if len(messages) == 1:
          return {
              "stop_reason": "tool_use",
              "content": [{
                  "type": "tool_use", "id": "tu_1",
                  "name": "read_file",
                  "input": {"path": "todo.txt"},
              }],
          }
      return {
          "stop_reason": "end_turn",
          "content": [{"type": "text", "text": "your todos: write tests"}],
      }

  def read_file(path):
      return "write tests"

  messages = [{"role": "user", "content": "what's on my todo list?"}]

  for turn in range(3):
      response = fake_llm(messages)
      if response["stop_reason"] == "end_turn":
          print(response["content"][0]["text"])
          break
      block = response["content"][0]
      result = read_file(block["input"]["path"])
      messages.append({"role": "assistant", "content": response["content"]})
      messages.append({"role": "user", "content": [
          {"type": "tool_result", "tool_use_id": block["id"], "content": result},
      ]})
runnable: true
---

# The loop, end to end

Run the editor on the right. The output should be exactly one line:

```
your todos: write tests
```

That single line came out of *two* calls to the (fake) LLM and *one*
tool execution. Look at the loop body and trace what happened:

- **Turn 0** — `messages` has the user's question. `fake_llm` returns
  a `tool_use` block asking for `read_file("todo.txt")`. We run the
  tool, get `"write tests"`, and append two messages: the assistant's
  tool_use block, and a tool_result message containing the file's
  contents.
- **Turn 1** — `messages` now has three entries. `fake_llm` sees the
  tool result and returns text. We print it and break.

That's *the entire pattern.* Now let's slow it down.

## The three things you append on every tool round-trip

This is the part everyone gets wrong the first time. When the LLM
returns a `tool_use`, your message history grows by *exactly two
messages*:

1. **The assistant message** containing the `tool_use` block. (This is
   the LLM saying *"I want to call X."*)
2. **A user message** with role `"user"` and a `tool_result` content
   block. (This is *your code* saying *"here's what X returned."*)

If you forget to append the assistant message, the next LLM call won't
know what tool it asked for, and it'll loop. If you forget to append
the tool_result, the LLM will think the tool was never run and ask
again. Both are very common bugs.

## Why the tool_result has role `"user"`

This trips up everyone. The tool result is *not* an assistant message
— it's wrapped in a *user* message. The mental model is: *the user is
the entity providing inputs to the model. Tool results are inputs.
Therefore tool_results live in user-role messages.*

Anthropic and OpenAI agree on this. Their formats differ in details,
but both wrap tool outputs in the role you'd think of as "input."

## The stop reasons you'll branch on

Three of the four stop reasons from chapter 20 matter here:

- `tool_use` → run the tool, append, loop.
- `end_turn` → take the final text, print, exit.
- `max_tokens` → log it, exit, alert. *Don't* keep looping; the output
  is truncated.

Anything else (`pause_turn`, `refusal`, `error`) is a programming
choice. Pragmatic default: log and exit. Production agents recover
selectively.

## The max-turns guard

Look at the `for turn in range(3)` line. That `3` is a *guardrail.* In
production it would be 10 or 20. Without it, a misbehaving model could
keep returning `tool_use` forever and your agent would chew through
your API budget in minutes. Always cap turns. Always.

## The shape of the message history

After two LLM calls and one tool call, `messages` looks like this:

```py
[
  {"role": "user",      "content": "what's on my todo list?"},
  {"role": "assistant", "content": [{"type": "tool_use", ...}]},
  {"role": "user",      "content": [{"type": "tool_result", ...}]},
]
```

Three messages. The whole conversation is a list of dicts. You can
serialize this list to JSON, read it back, replay it offline. That's
why agent debugging *is* trace reading — the trace is just the message
history with timestamps.

## Where AI specifically gets this wrong

The single most common bug in AI-generated agent code: forgetting to
append the assistant's `tool_use` block before sending the next call.
Cursor sometimes writes:

```py
result = run_tool(...)
messages.append({"role": "user", "content": [tool_result(...)]})
# bug: missed the assistant's tool_use message
```

The model on the next turn has no memory of asking for the tool. It
asks again. You get a tool loop. The fix is *one extra append.* Watch
for this pattern when you read agent code.
