---
xp: 1
estSeconds: 130
concept: stop-reasons
code: |
  # five turns from a session, with stop_reason values.
  turns = [
      {"n": 1, "stop_reason": "tool_use"},
      {"n": 2, "stop_reason": "tool_use"},
      {"n": 3, "stop_reason": "tool_use"},
      {"n": 4, "stop_reason": "max_tokens"},
      {"n": 5, "stop_reason": "end_turn"},
  ]

  finished_clean = sum(1 for t in turns if t["stop_reason"] == "end_turn")
  bailed_out    = sum(1 for t in turns if t["stop_reason"] == "max_tokens")

  print(f"clean: {finished_clean}")
  print(f"bailed: {bailed_out}")
runnable: true
---

# Stop reasons tell you why the agent stopped — and that's everything

When you scan a trace, the single field that tells you the most per
character is `stop_reason`. It's a one-word verdict on what happened at
the end of each turn. Run the editor on the right and look at the five
turns. The last one finished cleanly. The one before it didn't.

Every major agent framework speaks roughly the same four stop reasons.
The exact strings vary (`end_turn` vs `stop`, `tool_use` vs
`function_call`), but the meanings line up.

## The four stop reasons that matter

### `end_turn` (a.k.a. `stop`)

The model finished its thought and is done. Final answer is in the last
text content of that turn. **This is the only stop reason that means
"trust the answer."**

### `tool_use` (a.k.a. `function_call`, `tool_calls`)

The model wants to call a tool. There's a `tool_use` block in the
content. *The agent loop runs the tool, captures the result, and
continues.* If your loop sees this stop reason and stops anyway, that's
your bug — the loop terminated before the agent finished.

### `max_tokens`

The model hit the per-turn token cap mid-sentence. The output is
truncated, often mid-word, sometimes mid-tool-call. **Almost always a
silent failure** — the partial output looks plausible but is not what
the model would have produced if it had room. When you see this, raise
`max_tokens` or shorten the prompt and rerun.

### `pause_turn` / `refusal` / `model_context_window_exceeded`

Less common, but worth recognizing. `pause_turn` means the server-side
sampling loop hit its iteration cap while running built-in tools (web
search, code execution, web fetch) — resend the response back as input
to continue. `refusal` means the model declined to answer (safety,
policy, etc.). `model_context_window_exceeded` means the response would
have run past the model's context window before hitting `max_tokens` —
partial output is valid, you just can't extend further.

> **Note:** these are `stop_reason` values that come back inside a
> successful response. If the request itself failed — network down,
> rate limit, malformed JSON — you get an HTTP error and a Python
> exception, **not** a `stop_reason`. Different layer, different debug.

## What this means in practice

When you're scanning a trace dump and looking for what went wrong, do
this once:

```py
for turn in trace["turns"]:
    if turn["stop_reason"] != "end_turn" and turn["stop_reason"] != "tool_use":
        print(f"turn {turn['n']}: {turn['stop_reason']}")
```

Any turn that prints from that loop is suspect. `end_turn` and
`tool_use` are the *normal* shapes. Everything else is a signal.

## The trap with `tool_use` chains

A common bug: an agent calls tools four turns in a row, all
`tool_use`, and on turn 5 finally produces an `end_turn`. The whole
chain is *one logical answer.* If you only look at turn 5, you'll think
the model did all the reasoning in one shot — but the *actual* work was
done across the tool calls.

When you debug, read the entire `tool_use` chain together as one unit.
The final `end_turn` is just the model summarizing what the tools
already told it.

## Where AI specifically gets traces wrong

Two patterns to watch for in agent code AI writes you:

1. **Treating every turn as final.** Cursor sometimes generates loop
   code that returns the first text content it sees, ignoring whether
   the stop reason was `tool_use`. That code looks like it works on
   simple prompts and silently breaks on anything tool-driven.
2. **Not logging `stop_reason` at all.** AI scaffolds an agent and
   prints the final `text` only. Then when something goes wrong in
   prod, the only signal you have is "the answer was bad." Log every
   stop reason. It costs nothing and saves hours.
