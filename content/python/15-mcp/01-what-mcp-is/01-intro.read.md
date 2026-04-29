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

Three pieces, only:

1. **MCP server** — a process that exposes tools and data. Examples:
   the GitHub MCP server (PRs, issues), the Postgres MCP server
   (queries), the filesystem MCP server (read files).
2. **MCP client** — usually the AI app: Claude Desktop, Claude Code,
   Cursor, Continue. The client connects to one or more servers.
3. **The protocol** — a small JSON-RPC spec. The client asks the server
   `tools/list` to discover what's available, then `tools/call` to run
   one with arguments.

That's it. Same shape every time. Any new MCP server you write or
install gets picked up by every MCP-aware client automatically.

## What it looks like in practice

When you run `claude mcp add github`, Claude Code spawns the GitHub MCP
server as a subprocess and asks it `tools/list`. The server returns
something like:

```json
{
  "tools": [
    {"name": "list_prs", "description": "List open PRs in a repo", ...},
    {"name": "get_issue", "description": "Fetch one issue by number", ...}
  ]
}
```

Now when you ask Claude *"summarize the open PRs on my repo,"* Claude
sees `list_prs` in its toolbox and calls it. The server runs the actual
GitHub API call, returns the result, and Claude reads the result like
any other piece of context.

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
