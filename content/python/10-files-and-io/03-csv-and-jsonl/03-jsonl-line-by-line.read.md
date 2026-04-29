---
xp: 2
estSeconds: 130
concept: jsonl-streaming
code: |
  import json
  from pathlib import Path

  data = [
      {"id": 1, "prompt": "summarize", "tokens": 240},
      {"id": 2, "prompt": "translate", "tokens": 180},
      {"id": 3, "prompt": "rewrite", "tokens": 95},
  ]

  path = Path("/tmp/log.jsonl")
  path.write_text("\n".join(json.dumps(d) for d in data) + "\n")

  with open(path) as f:
      for line in f:
          row = json.loads(line)
          print(row["id"], row["prompt"], row["tokens"])
---

# JSONL — the format AI training data ships in

CSV is fine until your rows have *nested* data. The moment a column
needs to be a list, a dict, or anything richer than a string, CSV
breaks. The replacement that's everywhere in modern AI work is
**JSONL**: one JSON object per line, separated by newlines. OpenAI's
fine-tuning format is JSONL. Anthropic's batch API is JSONL. Every
LLM eval framework writes JSONL. Read one, you've read them all.

## The mental model

A JSONL file looks like this:

```
{"id": 1, "prompt": "summarize", "tokens": 240}
{"id": 2, "prompt": "translate", "tokens": 180}
{"id": 3, "prompt": "rewrite", "tokens": 95}
```

Three lines, three independent JSON objects. *Not* a JSON array of
objects (no surrounding `[ ]`, no commas between lines). This is the
key shape: each line stands on its own.

Why that matters: you can read the file *one line at a time*. A 5GB
JSONL file streams through Python without ever holding the whole
thing in memory. A 5GB JSON array can't — `json.load(f)` would parse
the whole array at once. JSONL is the streaming-friendly cousin of
JSON.

## The shape AI expects you to write

Every JSONL reader in the world looks like this:

```python
import json

with open("data.jsonl") as f:
    for line in f:
        row = json.loads(line)
        # row is a dict, do something with it
```

Iterating a file handle yields one line at a time, including the
trailing `\n`. `json.loads` is forgiving about trailing whitespace,
so you don't need to `.strip()`. Each `row` is a dict you can index
by key.

Writing JSONL is the symmetric shape:

```python
import json

with open("data.jsonl", "w") as f:
    for row in records:
        f.write(json.dumps(row) + "\n")
```

`json.dumps` is the inverse of `json.loads` — dict in, JSON string
out. Append `"\n"` so each record gets its own line.

## A worked example

The editor on the right writes three JSONL records and reads them back:

```python
import json
from pathlib import Path

data = [
    {"id": 1, "prompt": "summarize", "tokens": 240},
    {"id": 2, "prompt": "translate", "tokens": 180},
    {"id": 3, "prompt": "rewrite", "tokens": 95},
]

path = Path("/tmp/log.jsonl")
path.write_text("\n".join(json.dumps(d) for d in data) + "\n")

with open(path) as f:
    for line in f:
        row = json.loads(line)
        print(row["id"], row["prompt"], row["tokens"])
```

The write step uses a `"\n".join(...)` trick to format the file
in one go: dump each dict, glue them with newlines, and append a
final `"\n"` so the last line is properly terminated.

The read step iterates lines, parses each, and prints three columns
of structured output:

```
1 summarize 240
2 translate 180
3 rewrite 95
```

## Where AI specifically gets this wrong

Three patterns to watch for in code Cursor writes you.

**One: confusing JSON and JSONL.** Cursor will sometimes write
`json.load(f)` against a JSONL file and get a `JSONDecodeError` on
line 1, character 0 of line 2. The error message is cryptic. The fix
is the line-by-line shape above. If a file ends in `.jsonl` (or even
just has multiple `}` lines), it's not one JSON document.

**Two: forgetting the trailing `\n`.** Some tools strip blank lines,
some don't. Some readers tolerate a missing final newline, some
don't. Always end JSONL files with `\n` — it's free safety. The
`"\n".join + "\n"` shape in the example handles it.

**Three: hand-rolling the parser.** When AI doesn't know the file is
JSONL, it sometimes writes `f.read().split("\n")` and tries to
`json.loads` each piece. That works *until* a value in the data
contains an embedded `\n` (which JSON allows in strings). Then your
hand-rolled splitter chops a record in half. Iterating the file
handle directly gives you actual lines, not "split-on-newline."
JSONL forbids embedded newlines inside values, so if you wrote the
file with `json.dumps`, line iteration is safe.

Run the editor. Three records in, three records out, all streamed.
