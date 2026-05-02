## Wire it all together — a working CLI agent in 12 steps

You've made it through 21 chapters. You can read what AI wrote, catch what it got wrong, and direct it deliberately. You know the messages pattern, the agent loop, MCP, structured output, eval-driven development, secrets hygiene, prompting craft, and the full vocabulary of agent traces.

Time to assemble it. This capstone is one chapter, twelve steps, and at the end you'll have a working command-line AI agent — runs in Pyodide in your browser, calls fake tools that mimic real ones, loops on stop reasons, logs every turn, ships a clean exit when it's done. About a hundred lines of Python, end-to-end.

## Why the capstone matters more than the polish

You can read about agents for a year and still not really *get* them. The first time you build one, the patterns lock in. The first time *your* loop hits the `tool_use` branch and you watch your code dispatch to the right tool and feed the result back into the model — that's the moment the abstraction becomes intuition. From there, every framework you'll ever touch reads obvious.

That's the goal of this chapter. Not to ship something you'd put in production — production agents have observability, retries, distributed state, eval guardrails, prompt versioning. To ship something that proves you understand what's underneath.

## What the capstone agent does

A small CLI tool. The user types a question. The agent has access to two tools (a fake `read_file` and a fake `write_file` that operate on an in-memory dict, since we're in a browser). The agent loops:

1. Send the user's question to the model with the tool definitions.
2. If the model returns `stop_reason: "tool_use"`, parse the tool call, dispatch to the matching Python function, append the result to the message history, loop.
3. If the model returns `stop_reason: "end_turn"`, take the final text and print it.
4. Cap at five turns to avoid runaway loops.

Read that paragraph again. That's the entire agent. The hundred lines of code in step 11 are an expansion of that paragraph plus error handling plus a max-turns guard.

## What you build, broken into 12 steps

- Steps 1-3: read the existing tool-loop pattern and understand the message-history append rules.
- Step 4: predict the agent's output for a given input, before you've written any code.
- Step 5: fill in the stop-condition check.
- Steps 6-7: fix two AI-shipped bugs in the dispatch path.
- Step 8: read the logging pattern that makes the agent debuggable.
- Step 9: write the tool runner — the function that maps tool names to Python callables.
- Step 10: fix the loop-exit condition.
- Step 11: write the full agent.
- Step 12: checkpoint — the agent runs end-to-end on a real test case and prints the right answer.

## What AI specifically gets wrong building agents

The capstone bakes in the three top patterns from the wedge:

1. **The two-message append.** Cursor reliably appends only the tool_result and forgets the assistant's tool_use block. Result: the model on the next turn has no memory of asking for the tool. It asks again. Tool loop. Step 7 of this chapter is fixing exactly this.

2. **Wrong loop-exit condition.** AI writes `while True: ... break` or `while turn < 100`, missing the natural exit on `stop_reason == "end_turn"`. Result: the loop either never exits or exits one turn too early. Step 10 fixes it.

3. **Tool dispatch by string equality with no fallback.** AI writes `if tool_name == "read_file": ...` and forgets the unknown-tool case. The first time the model hallucinates a tool name, the agent silently does nothing and returns no answer. Step 6 is the fix.

These are the three bugs that ship most often into AI-generated agent code. By the end of step 12 you'll have written each of them wrong, fixed each of them right, and seen the difference in output.

## What you'll be able to do at the end

Twelve steps. By the end you'll have:

- Written a working AI agent loop in Python from memory.
- Logged every turn (input, tool calls, outputs, stop reasons) with enough detail to debug a failure.
- Spotted the three top "AI ships agent code wrong" patterns at sight.
- Built mental scaffolding for every framework you'll touch — LangGraph, the Vercel AI SDK, Claude's Agent SDK, OpenAI's Assistants API, every house-built agent runtime. They're all dressed-up versions of what you wrote here.

Pyloft ends here. You're not an AI engineer after this — that takes more chapters than fit in 22, and more production reps than a course can teach. But you're past the ceiling that was blocking you. You can read agent traces, catch agent bugs, and ship features without flinching. That's what this whole school was for.

Press *Start chapter* below.
