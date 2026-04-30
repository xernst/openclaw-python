## The protocol that ate the AI tooling world in eighteen months

In November 2024 Anthropic open-sourced something called the Model Context Protocol. It was a small JSON-RPC spec for letting AI applications talk to tool providers — read your filesystem, query your database, list your GitHub PRs, whatever. The kind of thing every agent maker had been hand-rolling since GPT-4 launched.

Eighteen months later, MCP is in Claude Desktop, Claude Code, Cursor, Continue, Zed, VS Code's GitHub Copilot, ChatGPT, Vercel's AI SDK, and a hundred third-party MCP servers ranging from official Anthropic releases to one-person passion projects. If you connect Cursor to your Linear workspace today, you're using MCP. If Claude Code reads your filesystem, that's MCP. If your agent calls a Postgres database, increasingly that's MCP too.

This chapter is what MCP actually is, the three roles and three primitives every MCP server speaks, and why it's the standard you can't avoid in 2026.

## Why this matters even if you never write an MCP server

You don't need to ship MCP servers to need this chapter. You need this chapter because every agent runtime you'll ever use is going to be an MCP host, every tool catalog you'll ever read is going to include MCP servers, and "what tools does this agent have access to" is going to be answered with "look at the MCP config" for the foreseeable future. PMs and ops folks who can read an MCP config and reason about which server exposes which tool will out-debug the ones who can't. It's the new "what does this curl command do."

## The mental model: hosts, clients, servers, primitives

Three roles:

- **Host** — the AI app you actually use: Claude Desktop, Claude Code, Cursor, Continue. The host runs the model and orchestrates everything.
- **Client** — a connector inside the host. The host runs one client per server connection. If you've connected Cursor to four MCP servers, that's four clients running in parallel inside Cursor's host process.
- **Server** — a process that exposes capabilities. The official filesystem server. The git server. GitHub's official MCP server. A custom Postgres server you wrote in an afternoon.

Three things a server can expose:

- **Tools** — functions the model can call. *List my open PRs. Read this file. Query this database.* Tools are the primary primitive; this lesson focuses here.
- **Resources** — data the model can read on request. Files. URLs. Database rows. Read-only context the host can pull in when the model asks.
- **Prompts** — reusable prompt templates the host offers to the user. The "/explain-this-stack-trace" slash command in your editor is often a prompt primitive.

Communication is JSON-RPC 2.0 over stdio (when the server is a subprocess) or Streamable HTTP (when the server is a remote service). Two methods do most of the work: `tools/list` (which the client calls on connect to discover what's available) and `tools/call` (which the client invokes when the model wants to run a specific tool).

That's the whole protocol surface for 95% of real agent work.

## Why MCP took over so fast

Two reasons. First, the hand-rolled "let Claude read my Linear" integrations from 2023 were hell. Different auth, different schemas, different glue code per tool, and no shared abstraction. MCP gave the industry a single shape, and the network effect kicked in: every server you write works with every host that speaks MCP, automatically.

Second, the spec was small enough to fit in a normal engineer's head. JSON-RPC plus three primitives plus a discovery flow is something you can read in an afternoon and start writing servers for. That's a different bar than the OpenAI plugin spec, which never broke out, or LangChain's tool abstraction, which is library-specific.

## What AI specifically gets wrong about MCP

Three patterns:

1. **Confusing client and server.** Your editor *is* the host. Your Postgres connector *is* the server. Reversing them in configuration breaks everything, and Cursor's autocomplete sometimes does it. Step 2 of this chapter is exactly this distinction.

2. **Forgetting the input schema on a tool definition.** Every MCP tool advertises a JSON Schema (`inputSchema`) for its arguments. If the schema's missing or sloppy, the model can't reliably call the tool — it's guessing. The schema *is* the model's user manual. Step 6 is fixing this.

3. **Treating tool results as plain strings.** A `tools/call` response wraps the result in a `content` array of typed blocks (text, image, etc.) — same shape as a Claude assistant message. AI sometimes ships code that does `result.text` instead of `result["content"][0]["text"]`. Crashes the moment a tool returns anything more interesting than a string. Step 7 fixes it.

## What you'll be able to do at the end

Nine steps. By the end you'll be able to:

- Read any MCP server's `tools/list` output and reason about what it exposes.
- Construct a `tools/call` request by hand against any MCP server's schema.
- Read a `tools/call` response (`content` array, `isError` flag, structured content) cleanly.
- Spot the three "AI ships this wrong" MCP patterns and fix them.
- Read the rest of an MCP server's surface — resources, prompts, sampling — well enough to evaluate whether a given third-party server is a good fit for your agent.

Chapter 16 (agent loops) builds the dispatch loop that calls these tools. Chapter 22 (capstone) wires both together into a working agent.

Press *Start chapter* below.
