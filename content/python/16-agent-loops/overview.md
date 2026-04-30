## The thirty lines that make every AI agent run

Open `langchain`. Open `langgraph`. Open `crewai`, `autogen`, `dspy`, the Vercel AI SDK, OpenAI's Assistants API. Underneath every framework's agent abstraction is the same thirty lines of Python. The frameworks dress it up — different class names, different config, different opinions about retries and memory — but the core loop is identical, and you can write it yourself in an afternoon.

This chapter is that afternoon.

## Why writing the loop yourself matters

Most AI engineering courses skip this step. They open with `agent = LangGraphAgent(...)` and you're never asked to think about what's inside. That works until you hit your first weird bug, and then the abstraction is a black box and your only debugging tool is "try a different framework." The PMs and ops folks who actually ship agents all eventually hit that wall. The ones who scale through it are the ones who know what's underneath.

Writing the loop once takes a few hours and changes how you read every framework after. `LangGraph`'s `StateGraph` reads obvious. The Vercel AI SDK's `streamText` reads obvious. Cursor's agent mode reads obvious. The frameworks add real value — retries, observability, memory, multi-agent coordination — but the core loop is something you should be able to write from memory.

## The loop in one paragraph

You start with a list of `messages`. You ask the model. The model returns a response with a `stop_reason`. If `stop_reason` is `end_turn`, you have the final answer — print and break. If `stop_reason` is `tool_use`, the model wants to call a tool. You run the tool, get the result, append two messages to the history (the assistant's tool-use block, then a user-role message wrapping the tool result), and ask the model again. Repeat until `end_turn`. Add a max-turns guard so a misbehaving model can't run forever and burn your API budget.

That's the whole loop. About thirty lines. You'll write it in step 8 of this chapter.

## Why `tool_use` and `end_turn` are the only branches that matter

A modern agent runtime distinguishes a handful of stop reasons. Most of them you'll see rarely or never. Two of them — `tool_use` and `end_turn` — are the entire game in production. Everything else is an exception path: the model hit `max_tokens` (output truncated), or `pause_turn` (server-side built-in tool loop hit its cap), or `refusal` (declined for safety reasons), or `model_context_window_exceeded`. You handle them; you don't loop through them.

If you read AI-generated agent code and the loop only branches on `tool_use` versus `end_turn`, that's *correct*. If you read a loop with five different branches each doing something subtle, that's almost always over-engineered.

## The bug that ships into AI-generated agent code

Cursor's most common agent-code mistake: forgetting to append the assistant's `tool_use` block before sending the next call. The model on the next turn has no memory of asking for the tool. It asks again. You get a tool loop. The fix is exactly one extra `messages.append(...)`.

You will see this bug. You'll see it in your own code, you'll see it in PRs, you'll see it in code Claude Code generates for you. Step 7 of this chapter is fixing it. Once you've fixed it once, you'll spot it on sight forever.

## What you'll be able to do at the end

Nine steps. By the end you'll have:

- Written a working agent loop in pure Python — model call, tool dispatch, message-history hygiene, max-turns guard.
- Read three different real-shape agent traces and identified the bug in each.
- Memorized which stop reasons matter (`tool_use`, `end_turn`) and which are exception paths.
- Internalized why `tool_result` blocks live inside *user-role* messages (this trips up everyone — chapter 16 step 3 explains).

After this chapter, you can read any agent framework's source and the abstractions stop feeling magic. They start feeling like dressed-up versions of the loop you wrote.

## What chapter 16 connects to

Chapter 13 (LLM APIs) and chapter 14 (structured output) give you the messages pattern this chapter assumes. Chapter 20 (reading agent traces) takes the loop you build here and shows you how to debug it from a trace dump. Chapter 22 (capstone) puts it all together into a real CLI agent.

If you read AI engineering posts on X and felt like everyone was using vocabulary you didn't quite have — `stop_reason`, `tool_use`, `tool_result`, agent loop — this is the chapter that gives it to you.

Press *Start chapter* below.
