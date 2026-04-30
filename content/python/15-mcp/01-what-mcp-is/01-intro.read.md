---
xp: 1
estSeconds: 90
concept: mcp-overview
code: |
  # an MCP server advertises a list of tools. here's what
  # `tools/list` would return from a "weather" server, hardcoded.
  weather_server_tools = {
      "tools": [
          {
              "name": "get_current_temp",
              "description": "Get the current temperature in a city.",
              "inputSchema": {
                  "type": "object",
                  "properties": {
                      "city": {"type": "string"},
                      "units": {"type": "string", "enum": ["c", "f"]},
                  },
                  "required": ["city"],
              },
          }
      ]
  }

  for tool in weather_server_tools["tools"]:
      print(f"{tool['name']}: {tool['description']}")
runnable: true
---

# MCP is the USB-C port of AI agents

Before MCP, every "give Claude access to my database" or "let Cursor
read my Linear tickets" was a custom integration written from scratch.
Different auth, different schemas, different glue code per tool. It
didn't scale. The same agent had ten different ways to ask "what tools
can I use?"

**MCP — Model Context Protocol** — fixes that. It's a single open
protocol (announced by Anthropic, now adopted across the industry) that
lets *any* AI client talk to *any* tool provider, with one consistent
shape.

## The mental model

Three roles, three primitives.

**The roles** (this is the part most explainers blur):

1. **Host** — the AI application you actually use: Claude Desktop,
   Claude Code, Cursor, Continue.
2. **Client** — a connector inside the host. One client per server
   connection. The host can run several clients in parallel, talking
   to different servers.
3. **Server** — a process that exposes tools and data. Examples:
   the official filesystem MCP server (read files), the git MCP server
   (commit history), GitHub's official MCP server (PRs, issues).

**The primitives** (what a server can expose):

- **Tools** — functions the model can call (`get_current_temp`,
  `list_prs`). This lesson focuses here.
- **Resources** — data and files the model can read (a file path,
  a row from a database). Read-only context, surfaced on request.
- **Prompts** — reusable templates the host can offer to the user
  ("/summarize-pr", "/explain-this-stack-trace").

**The wire format** is JSON-RPC 2.0, over either stdio (subprocess
talking on stdin/stdout) or Streamable HTTP. The client asks the server
`tools/list` to discover what's available, then `tools/call` to run one
with arguments.

That's it. Same shape every time. Any new MCP server you write or
install gets picked up by every MCP-aware host automatically.

## What it looks like in practice

When you run `claude mcp add filesystem`, Claude Code spawns the
official filesystem MCP server as a subprocess and asks it
`tools/list`. The server returns something like:

```json
{
  "tools": [
    {"name": "read_file", "description": "Read a file from disk", ...},
    {"name": "list_directory", "description": "List directory contents", ...}
  ]
}
```

Now when you ask Claude *"what's in my README?"* Claude sees
`read_file` in its toolbox and calls it. The server runs the actual
filesystem read, returns the result, and Claude reads the result like
any other piece of context.

The same pattern works for any server: run GitHub's official MCP
server and Claude can read your PRs; run the git MCP server and
Claude can read your commit history. One protocol, every tool.

## Where AI specifically gets this wrong

- **Confusing client and server.** Cursor *is* an MCP client. Your
  Postgres connector *is* an MCP server. Reversing them in
  configuration breaks everything.
- **Missing the input schema.** Every tool advertises a JSON schema
  for its arguments. If your server doesn't, the model can't reliably
  call it — it's guessing. The schema is the contract.
- **Forgetting that tools return content blocks.** A `tools/call`
  response has the same `content` array shape as a regular Claude
  message. The result text lives at `result["content"][0]["text"]`.

> **Browser note:** we can't actually start an MCP server here, so
> we'll use a hardcoded version of `tools/list` and a Python function
> that mimics `tools/call`. The shapes are exactly what a real server
> would return.

Run the editor. We list the tools the (fake) weather server exposes.
