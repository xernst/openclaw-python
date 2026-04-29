---
xp: 1
estSeconds: 90
concept: print-debugging-introduction
code: |
  def total(items):
      print("debug: items =", items)
      result = 0
      for item in items:
          print("debug: adding", item)
          result += item
      print("debug: final =", result)
      return result

  print(total([5, 12, 3]))
runnable: true
---

# `print` is the first debugger you'll ever use

Here's a scene that's about to play out fifty times this year:

Cursor writes you a function. You run it. The output is wrong — not
crash-wrong, not traceback-wrong, just *wrong-number-on-the-screen*
wrong. The total is 47 when it should be 50. The list comes back empty
when it shouldn't. The score is `None` when something should be there.

There's no error to read. The code runs. It just lies.

This is where AI usually does something annoying. It guesses. It
suggests "maybe try `try/except` around it" or "let me rewrite the
function." Both of those make the symptom go away without ever pinning
down where the bug is. You end up with code that's mostly right,
silently wrong, and now wrapped in error-handling that makes the next
bug even harder to find.

There's a simpler move. Print.

## Why print beats every other tool when you're starting

Real debuggers — `pdb`, IDE breakpoints, the works — are great. They're
also a layer of indirection between you and the bug. When you're new,
that layer costs more than it saves. Print is direct: *show me the
value of this name, right here, right now, while the program runs.*

The pattern has three steps:

1. **Pick a name** that *should* hold a known value.
2. **Print it** with a label so you know which line wrote it.
3. **Run again.** Read the output. Compare what you saw to what you
   expected.

That's it. Bug almost always falls out of step 3 — the printed value
either matches your mental model (so the bug is later) or it doesn't
(so the bug is earlier). Either way, you've cut the search space in
half. Two more rounds and you've found it.

## What the editor on the right is doing

The function `total` adds up a list of numbers. Three prints trace it:

- The first shows what the function received as input.
- The second fires inside the loop, once per item.
- The third shows the final value before `return`.

Run it. The output is intentionally noisy — that's the whole point.
Each line tells you *what was true* at that moment. If something
breaks later, this is the trail you read backward to find where it
went wrong.

## Where AI specifically gets this wrong

Cursor's instinct, when a value comes out wrong, is to add five prints
sprinkled randomly through the function. You'll see prints inside
prints, nested f-strings, prints of variables that aren't even the
suspect. It's spray-and-pray.

The trick is restraint. You almost never need more than two prints to
find a bug. One at the input, one near the suspect line. If those two
don't crack it, *then* add a third. We'll drill that habit through the
rest of this lesson.
