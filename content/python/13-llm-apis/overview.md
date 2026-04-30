## Four lines of Python and you can talk to the smartest thing on earth

You've probably been using Cursor or Claude Code for months. The chat box, the inline diffs, the "explain this stack trace" magic. Underneath all of it is an HTTP call. A POST to `api.anthropic.com/v1/messages` or `api.openai.com/v1/responses` with a JSON body. The model thinks for a second or two and the response comes back as a JSON dict you read.

That's it. That's the whole API surface for 90% of what you'll ship this year. The chatbot, the summarizer, the email drafter, the agent: all of them are wrapping that one HTTP call.

This chapter is the four lines of Python that make that call, plus everything you need to know to read what comes back.

## Why this is the load-bearing wedge chapter

Every chapter from 14 onward — structured output, MCP, agent loops, eval-driven dev, the capstone — assumes you can call an LLM and read the response. If `client.messages.create(...)` and `response.content[0].text` aren't muscle memory by the end of this lesson, the rest of the wedge is harder than it should be.

So we slow down on the basics here. The four lines you'll write hundreds of times this year:

```python
import anthropic
client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "What is the capital of France?"}],
)
print(response.content[0].text)
```

That's the whole API surface for a single-turn call. Multi-turn is the same — you just append to the `messages` list. Tool use is the same — you add a `tools` parameter. Structured output is the same — you constrain the response shape. Every fancy feature is a delta on top of those four lines.

## The mental model: messages is a transcript

The single most-misread part of LLM APIs is `messages`. People treat it like a config object. It's not. It's a *transcript*. Each entry is one turn in the conversation, tagged with a role:

- `"user"` — what you (or your app, or a tool result) sent to the model.
- `"assistant"` — what the model said back.

To continue a conversation, append to the list. To start fresh, send a new list. The model has no memory between API calls — every request re-sends the entire transcript. Forgetting this is the single most common bug AI writes when it builds a chat feature.

## Why the response is a list of blocks

When you ask Claude something, the response object's `content` field is a list, not a string. That feels weird until you remember that the model can do more than one thing per turn. It can return text. It can call a tool. It can return text *and* call a tool. It can stream multi-part responses with thinking blocks, citations, document references. The list is how the API stays consistent across all of those.

For a plain text reply, `response.content[0].text` is the string you want. For a tool-call response, `response.content[0]` is a `tool_use` block with `name` and `input` fields. The shape changes, the access pattern stays.

OpenAI's response shape is different — `response.choices[0].message.content` for Chat Completions, `response.output_text` for Responses API. The vibe is the same, the field names aren't. Cursor reliably swaps them by accident. Knowing both saves you from "this works in my prod but not my staging" debugging sessions.

## What AI specifically gets wrong about this

Three patterns Cursor ships fluently and incorrectly:

1. **Forgetting `max_tokens`.** Anthropic requires it. OpenAI doesn't. AI ports OpenAI code to Anthropic and forgets to add it; the request 400s and the error message points at the wrong line. Step 6 of this chapter is fixing exactly this.

2. **Sending `messages` as a single dict instead of a list of dicts.** The shapes look similar at a glance and Cursor pattern-matches the wrong one. Step 5 is fixing this.

3. **Reading `response.content` as if it's a string.** It's not. It's a list. AI treats it as a string, things look fine in toy examples, breaks the moment the model returns a tool_use block. Steps 3 and 4 are about this.

These three mistakes account for somewhere around 60% of the broken LLM-call code Claude Code generates today. By the end of this chapter you'll spot them on sight.

## What you'll be able to do at the end

Nine steps. By the end you'll be able to:

- Write a single-turn LLM call from memory in Python, hitting either Anthropic or OpenAI.
- Read any response object and pull out the text, the tool call, or the stop reason.
- Spot the three top "AI shipped this wrong" patterns in API code and fix them.
- Hold a multi-turn conversation by appending to `messages` correctly.

The next chapter (structured output) takes this and adds schema constraints. Chapter 16 takes it and turns it into an agent loop. Chapter 22 takes everything and builds a working CLI agent end-to-end. This is the keystone — get it solid here and the rest of the wedge installs cleanly on top.

Press *Start chapter* below.
