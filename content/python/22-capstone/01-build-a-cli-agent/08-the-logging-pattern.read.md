---
xp: 1
estSeconds: 110
concept: jsonl-logging
code: |
  import json

  # collected log lines (in real life, written to agent.jsonl)
  log_lines = []

  def log_turn(turn_num, kind, payload):
      entry = {"turn": turn_num, "kind": kind, "payload": payload}
      log_lines.append(json.dumps(entry))

  log_turn(1, "user_prompt", {"text": "what's on my todo list?"})
  log_turn(1, "tool_use", {"name": "read_file", "input": {"path": "todo.txt"}})
  log_turn(1, "tool_result", {"text": "write tests"})
  log_turn(2, "final_text", {"text": "your todos: write tests"})

  for line in log_lines:
      print(line)
runnable: true
---

# Log everything, in `.jsonl`, every turn

When the agent fails in production at 2am — and it will — the logs are
the only evidence you have. There's no way to reproduce the run; the
LLM's output is non-deterministic. The trace is the truth.

The format that matters: **JSON Lines**, file extension `.jsonl`. One
JSON object per line. No outer array, no commas, no surrounding `[ ]`.
That's the whole format.

```
{"turn": 1, "kind": "user_prompt", "payload": {...}}
{"turn": 1, "kind": "tool_use", "payload": {...}}
{"turn": 1, "kind": "tool_result", "payload": {...}}
{"turn": 2, "kind": "final_text", "payload": {...}}
```

Run the editor on the right. The output is four JSONL lines — the
exact shape you'd find in a production `agent.jsonl` file. Each line
parses with `json.loads(line)` independently. You can `tail -f` it,
`grep` it, pipe it through `jq`, replay it offline. JSON arrays can't
do any of that — you'd have to load the whole file before you could
parse the first object.

## What to log per turn

Five kinds of entries cover almost every case:

1. **`user_prompt`** — the original input.
2. **`llm_call`** — the request you sent (messages + tools).
   Optional, but priceless when debugging.
3. **`tool_use`** — what the LLM asked for.
4. **`tool_result`** — what the tool actually returned (truncate
   if huge).
5. **`final_text`** — the LLM's last answer.

Plus one universal field on every line: a `turn` number. Lets you
group log entries by turn when you read them later.

## What NOT to log

This is the part that becomes a problem if you skip it:

- **Secrets.** API keys, passwords, OAuth tokens. Filter them
  *before* you write to disk. Logs leak.
- **Personal data the user didn't intend to share.** Email contents,
  uploaded files, chat history beyond what the user explicitly sent.
  Production logs end up in incident replays, on-call screens, and
  vendor dashboards. Treat them as semi-public.
- **The model's full internal reasoning.** With models that emit
  thinking tokens, the thoughts can be enormous. Log a hash or a
  truncated version unless you have a real reason to keep the full
  trace.

## The logging pattern in 4 lines

The whole thing is just:

```py
import json
def log_turn(turn, kind, payload):
    with open("agent.jsonl", "a") as f:
        f.write(json.dumps({"turn": turn, "kind": kind, "payload": payload}) + "\n")
```

Append mode (`"a"`). One `json.dumps` per call. Trailing newline. Done.
That's the production-grade logger. You'll see this exact pattern in
real agent codebases, dressed up with timestamps and process IDs but
otherwise identical.

In Pyodide we can't write to disk, so we'll use a list-of-strings
stand-in (`log_lines.append(json.dumps(...))`). Same data, different
sink. Swap the list for `open("agent.jsonl", "a")` at home and the
agent writes real logs.

## Where AI specifically gets logging wrong

Two patterns to watch for in agent code Cursor writes:

1. **`json.dump` instead of `json.dumps` plus newline.** `json.dump`
   writes directly to a file handle without a newline, so multiple
   calls produce *one giant string* instead of one line per turn. The
   file looks fine in a text editor and is unparseable to every
   downstream tool.
2. **Binary serializers for log persistence.** Cursor sometimes
   reaches for binary serialization formats for "structured" data.
   Stick with JSONL. It's human-readable, language-agnostic, and safe
   to load — three things that matter when you're tailing logs at 2am.
