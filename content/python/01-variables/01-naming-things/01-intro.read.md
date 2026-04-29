---
xp: 1
estSeconds: 60
concept: variable-introduction
code: |
  score = 7
  print(score)
runnable: true
---

# Variables — the names AI reaches for first

Here's what's about to happen, hundreds of times this year:

You'll ask Cursor to *track the user's score*, *store the API response*, or
*remember the last result*. Before it writes a function, before any logic,
the very first thing the AI does is invent a **variable** — a name that
holds a value. Every other line in the program then refers back to that
name. The whole script flows through these names.

So when you read AI-generated Python — and you will, all day long — most
of what you're reading is a constellation of named values being passed
around. If you can't read those names, you can't read the code.

## The mental model that actually works

Forget "container" and "memory location." Both are technically true and
neither is useful. The model that makes Python click is this: **labels
stuck on values.**

Right side first. Python evaluates whatever's on the right of the `=`.
Then it sticks a label — the name — on the result.

```py
score = 7
```

Read out loud: *the value seven, with a label called `score` stuck on it*.
Anywhere you later write `score`, Python looks at the label and finds the
seven.

## What that buys you when reading AI code

Three things you'll do every time you read code AI wrote you:

1. **Trace the flow.** When a function returns `score`, you trace back and
   ask, "what got `score` stuck on it?" Almost every AI bug reveals itself
   here — the label is right but the value behind it is wrong.
2. **Predict the type.** A name assigned a list comprehension is a list.
   A name assigned `response.json()` is a dict. Most "what is this thing?"
   questions resolve at the assignment line.
3. **Spot the rebind.** When the same name shows up twice on the left side
   of `=`, the second one **replaces** the first. We'll prove this in two
   steps.

## What's coming in this lesson

Eight short steps. By the end you'll be able to look at any AI-generated
Python file and answer two questions in under five seconds: *which names
are valid?* and *what value does each one currently point at?* That's
variable literacy, and the rest of the language stands on it.

The editor on the right already has two lines of Python. Hit **Run**.
