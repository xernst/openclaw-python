---
xp: 2
estSeconds: 75
concept: mcp-tools-list-call
code: |
  # what `tools/list` returns from a hypothetical "tasks" MCP server.
  tools_list_response = {
      "tools": [
          {
              "name": "create_task",
              "description": "Create a new task with a title.",
              "inputSchema": {
                  "type": "object",
                  "properties": {"title": {"type": "string"}},
                  "required": ["title"],
              },
          },
          {
              "name": "list_tasks",
              "description": "List all open tasks.",
              "inputSchema": {"type": "object", "properties": {}},
          },
      ]
  }

  # what `tools/call` for create_task with {"title": "ship docs"} returns
  call_response = {
      "content": [
          {"type": "text", "text": "Created task #42: ship docs"}
      ],
      "isError": False,
  }

  # the model would now read call_response["content"][0]["text"]
  result_text = call_response["content"][0]["text"]
  print(result_text)
---

# The two methods you actually use: `tools/list` and `tools/call`

The MCP protocol has more verbs than these, but in 95% of real agent
work, only two matter:

### `tools/list`

The client calls this once on connect to discover what the server can
do. The response is `{"tools": [...]}`, where each tool has:

- `name` — what you call when you want to invoke it
- `description` — natural-language description Claude reads to pick
  the right tool
- `inputSchema` — JSON Schema for the arguments

The model never sees the server itself. It only sees the list of tools
the client forwards from `tools/list`. The description and schema *are*
the model's user manual for that tool.

### `tools/call`

When Claude decides to use `create_task`, the client makes a
`tools/call` request with:

```json
{"name": "create_task", "arguments": {"title": "ship docs"}}
```

The server runs whatever it runs — hits an API, queries a DB, writes a
file — and returns:

```json
{
  "content": [{"type": "text", "text": "Created task #42: ship docs"}],
  "isError": false
}
```

That `content` array is the **same shape** as a Claude assistant
message. That's not coincidence — it lets the model treat tool output
as just another piece of context, no parsing dance required.

## Why `isError` matters

When something goes wrong, the server still returns a normal response,
just with `"isError": true` and an error message in the text content.
This lets the model *recover* — it can read "permission denied" and try
a different approach. Crashing the connection would force the whole
agent loop to start over.

Run the editor. We render a fake `tools/call` response — the same shape
a real one would have.
