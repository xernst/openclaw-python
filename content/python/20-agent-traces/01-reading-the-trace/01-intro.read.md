---
xp: 1
estSeconds: 110
concept: agent-trace-anatomy
code: |
  # one turn from a real agent trace, simplified.
  turn = {
      "turn": 3,
      "messages": [
          {"role": "user", "content": "list my open PRs"},
          {"role": "assistant", "content": [
              {"type": "tool_use", "id": "tu_01", "name": "list_prs",
               "input": {"state": "open"}},
          ]},
          {"role": "user", "content": [
              {"type": "tool_result", "tool_use_id": "tu_01",
               "content": "[]"},
          ]},
          {"role": "assistant", "content": [
              {"type": "text", "text": "you have no open PRs."},
          ]},
      ],
      "stop_reason": "end_turn",
  }

  print(f"turn {turn['turn']} | stop: {turn['stop_reason']}")
  print(f"messages: {len(turn['messages'])}")
runnable: true
---

# The trace is the only thing that doesn't lie

An agent failed in production at 2am. The user got a wrong answer. The
logs say the script returned cleanly. What happened?

This is the question that *only the trace* can answer. Not the final
output. Not the chat the user saw. The trace — the full record of every
turn, every tool call, every tool result, every stop reason. Every
agent framework worth using emits a structured trace, and reading them
fluently is the difference between *fixing the bug in five minutes* and
*shrugging and re-running it.*

Run the editor on the right. That's one turn from a real trace, in the
shape every modern agent framework speaks (Anthropic's Messages API,
OpenAI's Responses API, every LangChain or LangGraph adapter you'll
ever see — they all serialize to roughly this shape).

## The four things in every turn

1. **The user message** that started the turn.
2. **The assistant message** — either text, or a tool call, or both.
3. **The tool result** — the structured response from whatever the tool
   ran (an API call, a shell command, a database query).
4. **The stop reason** — *why* the assistant stopped generating. This
   is the most important field for debugging.

Every agent loop is just this pattern, repeated until the model decides
it's done.

## Reading a trace right-to-left

When you're debugging, read the trace from the *end* backwards. Most
failures look like this:

- The final answer is wrong or missing.
- The last assistant message was either short, off-topic, or never
  came.
- One turn back, a tool result is empty, malformed, or contains an
  error.
- One turn before that, the assistant called the tool with the wrong
  arguments.

That's the chain. Fix the wrong tool call and the rest unblocks. The
trace makes this visible; without it you'd be guessing.

## The two kinds of failure you'll see most

**Failure 1: wrong tool arguments.** The model called the right tool
but passed the wrong shape. The result came back empty or with a
validation error, the model didn't recover, and you got an unhelpful
final answer. We'll fix one of these later.

**Failure 2: the agent looped.** The model called the same tool with
the same arguments three turns in a row, ran out of patience or
budget, and stopped. The fix is almost always at the *first* repeated
call — the model didn't understand the result and kept asking again.

## What's in this lesson

Eight more steps. By the end you'll be able to look at a JSON trace
dump from any agent framework — Claude, OpenAI, Bedrock, vendor-locked
internal tools — and answer three questions:

1. Did the agent finish on purpose, or did it bail?
2. Where did it actually go wrong?
3. What's the smallest fix that would have unblocked it?

That's trace literacy.
