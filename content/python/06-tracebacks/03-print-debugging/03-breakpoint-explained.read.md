---
xp: 2
estSeconds: 100
concept: breakpoint-overview
code: |
  # we can't drop into an interactive debugger in the browser, so the
  # editor below DOES NOT call breakpoint(). on a real machine, the
  # commented call below would pause execution and let you inspect.
  def total(items):
      result = 0
      for item in items:
          # breakpoint()   # <- on your machine, this would pause here
          result += item
      return result

  print(total([5, 12, 3]))
---

# `breakpoint()` — `print` with a real cockpit

`print` is fine when you already know which variable you want to see.
You drop in a `print(x)`, you read it, you move on. But when you
*don't* know what to print yet — when the bug is somewhere in a
function and you want to *poke around* — adding more prints starts
to feel like firing into the dark.

That's where `breakpoint()` comes in. It's the single most useful
debugging tool in Python, it's a built-in (no install, no import),
and AI sometimes drops one into your code without telling you. You
should know what to do when you see it.

## What `breakpoint()` actually does

```python
def total(items):
    result = 0
    for item in items:
        breakpoint()   # <- execution pauses HERE
        result += item
    return result
```

When Python hits a `breakpoint()` call during a normal run, it
**stops** — execution freezes mid-function — and drops you into an
interactive console called `pdb`. From there, the program is
*paused* and waiting for your commands. You're inside the function,
with all the variables in scope, and you can inspect them or step
forward one line at a time.

This is what real engineers mean by "running it under the debugger."
And it's a one-line change to enable.

## The four pdb commands you actually need

When `pdb` opens, you'll see a `(Pdb)` prompt. Most of what you'll
ever type is one of these four commands:

| Command | What it does |
| --- | --- |
| `p variable` | Print the current value of a variable. Same as a print, but live. |
| `n` (next) | Run the next line of code, then pause again. Step *over* function calls. |
| `c` (continue) | Resume normal execution until the next `breakpoint()` or end. |
| `q` (quit) | Stop the program. |

That's the whole essential vocabulary. There's a lot more `pdb`
can do — `s` to step *into* a function call, `l` to list source
context, `up`/`down` to walk the call stack — but those four cover
95% of debugging.

## When to reach for `breakpoint()` instead of `print`

The rule of thumb:

- **`print`** is right when you have one suspect variable and want
  to know its value at one point in time.
- **`breakpoint()`** is right when you want to inspect *several*
  things at once, or you're not yet sure which variable is the
  culprit, or you want to step forward through the code one line at
  a time.

Both are valid. Both are first-line tools. AI defaults to `print`
because it's simpler, but you'll save a lot of time the first time
you reach for `breakpoint()` on a non-trivial bug.

## Why we can't run it in this lesson

Read the editor closely — the line says `# breakpoint()` (commented
out). That's intentional. This course runs Python inside your
browser via Pyodide, which doesn't support interactive `pdb`
sessions. There's no way for a paused console to talk back to you
through the browser.

So in this environment, `print` is your only option. On a real Python
install — `python script.py` from a terminal, or running inside VS
Code — the *uncommented* version pauses execution and gives you the
`pdb` prompt. Try it later this week on a script you wrote yourself.
The first time you use it on a real bug, you'll feel the difference.

## Where AI specifically uses `breakpoint()`

Two patterns to watch for in code Cursor writes you:

1. **AI drops a `breakpoint()` for you mid-debugging session.** Cursor
   sometimes adds `breakpoint()` to a function it's helping you
   debug, expecting you to run the script and inspect things yourself.
   Don't delete it. Run the script, type `p variable_name` for
   anything you want to check, then `q` to exit when done.

2. **AI forgets to remove `breakpoint()` before shipping.** A
   leftover `breakpoint()` in production code will *halt* the running
   program — including a web server. Always grep for `breakpoint()`
   before committing AI-generated code.
