## The single skill that separates "I use Cursor" from "I ship with Cursor"

There's a moment that happens to every PM, marketer, and ops person who starts shipping AI features. The agent works for two weeks. Then one Tuesday at 2am, your on-call gets paged because a customer got a wrong answer, and the only thing you have is the chat that the user saw. The model said something. The model was wrong. You don't know why. Your engineer asks "what does the trace say" and you don't know what they mean.

That moment is what this chapter is about.

The trace is the structured record of every turn the agent took — every prompt, every tool call, every tool result, every stop reason, every retry. Every modern agent framework emits one. Anthropic, OpenAI, LangChain, LangGraph, Cursor, Claude Code, Vercel AI SDK — they all serialize to roughly the same shape, because the shape is the agent loop made visible.

If you can read a trace, you can debug an agent in five minutes. If you can't, you re-run it and hope. The difference is enormous and most non-engineers never cross it.

## What "reading a trace" actually means

Traces look intimidating the first time you see one. JSON, deeply nested, hundreds of lines. The trick is they're shallower than they look. There are exactly four things in every turn:

1. **The user message** that started the turn.
2. **The assistant message** — either text, or a tool call, or both.
3. **The tool result** — the structured response from whatever the tool ran.
4. **The stop reason** — *why* the assistant stopped generating. This is the most diagnostic field in the entire trace.

That's it. Once you see those four fields, the rest of the trace is just repetition. Five turns, ten turns, a hundred turns — same four fields, repeated.

You read traces *backwards*. The final answer is wrong. The last assistant message was off-topic, short, or never came. One turn back, a tool result is empty or malformed. One turn before that, the assistant called the tool with wrong arguments. That's the chain. Find the wrong tool call and the rest unblocks. Five minutes.

## The two stop reasons you'll see most

Agent loops run on stop reasons. They're one-word verdicts that tell you what happened. The two normal ones are `end_turn` (the model finished and is handing back the answer) and `tool_use` (the model wants to call a tool). Anything else — `max_tokens`, `pause_turn`, `refusal`, `model_context_window_exceeded` — is a signal worth pausing on.

When you scan a trace looking for what went wrong, the fastest filter you can apply is: *show me every turn whose stop reason isn't `end_turn` or `tool_use`*. The result is the suspect list. In about 90% of agent failures the culprit is in there.

## Why this chapter exists

When a Cursor or Claude Code agent fails, the trace tells you the answer in plain text. Not in metaphor, not in vibes, not in the chat the user saw — in actual JSON fields you can grep. PMs who learn to read traces stop being dependent on engineers for AI debugging. They start filing useful bug reports. They start shipping AI features that work because they understand when they don't.

Codecademy doesn't teach this. boot.dev doesn't teach this. Real Python doesn't have a chapter on this. The reason is that as recently as eighteen months ago, this skill barely existed outside research labs. Now it's the daily reality of every PM who ships with Cursor.

## What you'll be able to do at the end

Nine steps. By the end you'll be able to look at any agent trace — Anthropic, OpenAI, LangChain, your in-house framework — and answer three questions in under thirty seconds: *which turn failed, what tool went wrong, and where in the chain to fix it*. You'll know the seven canonical stop reasons and what each one means. You'll have written a trace summarizer that distills 200 lines of JSON into "turn 3 failed: bad tool argument shape."

That summarizer alone is the kind of script you'd reach for in a real on-call rotation. You'll have it by step 8.

## What chapter 20 builds on

Read chapters 13 (LLM APIs) and 16 (agent loops) first if you skipped them — this chapter assumes you know the messages pattern and the request → tool → respond cycle. If you've used Cursor or Claude Code for more than a week, you already have the intuition; the formal vocabulary will lock in fast.

After this chapter, chapter 21 (eval-driven AI development) becomes immediate — once you can read a trace, you can write the assertion that catches the failure before it ships. That's the whole arc of the wedge: *read what AI did → catch what it got wrong → ship the next agent with confidence*.

Press *Start chapter* below.
