---
xp: 1
estSeconds: 120
concept: agent-architecture
code: |
  # the agent we're building, in pseudocode-as-Python comments.
  AGENT = """
  1. read the user's prompt
  2. send it to the LLM with the tool definitions
  3. if the LLM returns text → print and exit
  4. if the LLM returns a tool_use → run the tool, append result, goto 2
  5. log every turn to agent.jsonl
  """
  print(AGENT)
runnable: true
---

# What you're about to build

Twelve steps. By the end you will have a working agent — a small Python
script that takes a user prompt, talks to a (stubbed) LLM, runs tools
when the LLM asks, loops until the LLM is satisfied, and logs every
turn to disk. It uses every concept from the chapters before it.

Run the editor on the right. That's the agent in five lines of plain
English. The rest of this lesson is just turning each line into Python
that actually runs.

## The five things every agent does

1. **Receive a prompt.** The user types something at the CLI. In
   production, this could come from a Slack message, a webhook, or
   another script.
2. **Send it to an LLM along with the available tools.** This is the
   call to `messages.create` (Anthropic) or `responses.create`
   (OpenAI). You include a list of *tool definitions* — `read_file`,
   `write_file`, `run_shell` — that the model can invoke.
3. **Read the response.** The LLM returns either:
   - **Text** ("here's the answer") — agent done.
   - **A tool_use block** ("I want you to run `read_file` with
     `path=app/main.py`") — agent runs the tool and continues.
4. **Run the tool.** Find the named tool in your local tool registry,
   call it with the arguments, get a result. Append the result to the
   message history.
5. **Loop.** Send the updated history back to the LLM. Repeat until the
   LLM stops asking for tools.

That's it. *The whole pattern.* Production agents add safeguards
(timeouts, max-turns, sandboxing, retries), but the core is this loop.

## Why this is the capstone

Three reasons every concept from earlier in the course matters here:

- **Variables, types, dicts (ch01-03):** every message and tool call
  is a dict. Reading one wrong is the bug.
- **Functions (ch02):** the tools are just Python functions with a
  schema attached.
- **Conditionals (ch05):** the *"is this stop_reason `tool_use` or
  `end_turn`?"* branch is the heart of the loop.
- **Error handling (ch09):** the tool call might fail. The agent must
  not crash; it must report the failure back to the LLM so the model
  can recover.
- **Files and IO (ch10):** every turn gets logged to a `.jsonl` file
  for later replay and debugging.
- **HTTP, LLM APIs, MCP, agent loops (ch12-16):** the wire format we'll
  use is the one those chapters laid out.

## What's stubbed and why

This lesson runs in Pyodide. There are no network calls. So:

- The LLM call is stubbed by `fake_llm(messages, tools)`. It returns
  hardcoded responses that pretend to be a real model.
- The tools (`read_file`, `write_file`) are stubbed too — they read
  from and write to a Python dict that simulates a tiny filesystem.

The *agent loop itself is real.* If you swap `fake_llm` for a real
Anthropic client and the file stubs for `pathlib`, the script works
unchanged. That's deliberate — the loop is the lesson.

## The mental model that ties it together

The agent is just a `while` loop with three branches:

```
while True:
    response = llm(messages, tools)
    if response is text:
        print(response); break
    if response is tool_use:
        result = run_tool(response.name, response.input)
        messages.append(tool_use)
        messages.append(result)
        continue
    if response is something else:
        log_and_bail(); break
```

Three conditions. Two paths through the body. One break out. If you
can read this loop, you can read every agent framework ever written —
LangChain, LlamaIndex, Mastra, Bedrock Agents, your own. They all wrap
this same loop in different fancy clothes.

## What you'll have at the end

A 60-line file that:
- Takes a hardcoded prompt.
- Calls a stubbed LLM with a stubbed tool registry.
- Runs the loop, exits when done.
- Logs every turn as JSON to a list (or in real life, to disk).
- Prints the final answer.

You'll be able to extend it: add a new tool, swap in a real LLM, add
retries, add a max-turns guard. That's exactly how production agents
get built.
