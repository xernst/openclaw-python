---
xp: 1
estSeconds: 110
concept: prompt-structure
code: |
  # this is a Python dict, but read it like a prompt template.
  prompt_parts = {
      "context": "I'm editing app/api/orders.py. It uses fastapi and a postgres pool.",
      "goal": "Add a GET /orders/{id} endpoint that returns one order.",
      "constraints": "Use the existing get_pool() helper. Return 404 if missing.",
      "format": "Show me the diff only. No explanation.",
  }

  for part, value in prompt_parts.items():
      print(f"{part}: {value}")
runnable: true
---

# The prompt is the spec

Watch what happens when you ask Cursor *"add an orders endpoint"* with
nothing else. It picks a router file at random. It invents a database
helper that doesn't exist. It adds three error cases you didn't ask for
and skips the one that matters. You spend twenty minutes reading code
that fights your codebase.

Now watch what happens when you ask the same question with four
sentences of structure. Cursor lands a diff in one shot. You read it,
maybe tweak two lines, and ship.

The difference is not the model. The difference is the prompt. The
scaffold I lean on has four parts — context, goal, constraints, format.
It's not a canonical framework from Anthropic or Cursor; it's the
shape that, in practice, fixes the most one-shot prompts. Run the
editor on the right and read it out loud.

## Part 1: context

*What file am I in. What stack. What constraints exist already.*

```
I'm editing app/api/orders.py. It uses fastapi and a postgres pool.
```

This is the part most people skip, and it's the part that does the most
work. Without it, the model is guessing what kind of project you're in,
and a guess takes ten generated tokens to wrong-foot you for the rest
of the session.

In Cursor, Agent mode pulls workspace and open-file context
automatically (other modes are mode-dependent — `@`-reference
explicitly when in doubt). In Claude Code, what's in the conversation
IS context.
Either way, **make the relevant file or pattern visible before you ask
the question.** Paste a snippet, open the file, or add it with `@`.

## Part 2: goal

*The single concrete thing I want.*

```
Add a GET /orders/{id} endpoint that returns one order.
```

One sentence. One outcome. If you find yourself writing "and also" or
"while we're at it," stop. That's two prompts pretending to be one.
Send them separately. The model handles one well-scoped task per turn
much better than two half-scoped ones.

## Part 3: constraints

*What you must use. What you must not do. What edge cases matter.*

```
Use the existing get_pool() helper. Return 404 if missing.
```

This is where you save yourself the rewrite. Every constraint you state
up front is a wrong path the model never goes down. "Don't add new
dependencies." "Match the style of the existing endpoints." "No
try/except for happy-path errors — let them bubble." Each line is a
fence.

## Part 4: format

*How I want the answer back.*

```
Show me the diff only. No explanation.
```

This is the most overlooked part. AI tools default to *explaining* what
they did, which is helpful when you're learning and noise when you're
shipping. Tell it: "diff only," "code only," "list of file paths," "two
sentences max." The format constraint is free token savings on every
turn.

## What the four parts do together

When you read AI-generated code that's wrong, almost every time you can
trace the wrongness back to a missing piece:

- **Wrong stack assumed?** Missing context.
- **Did six things you didn't ask for?** Missing goal scope.
- **Used a banned library?** Missing constraint.
- **Wall of unwanted commentary?** Missing format.

Get all four in. The model has nothing to invent.

## What this lesson covers

Eight more steps. By the end you'll be able to look at a vague prompt
and rewrite it on the spot, you'll know when a long-running session has
gone toxic, and you'll have one tool — the *show me your plan first*
prefix — that turns every prompt into a checkable two-step.
