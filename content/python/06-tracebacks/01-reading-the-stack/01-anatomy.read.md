---
xp: 1
estSeconds: 100
concept: traceback-anatomy
code: |
  def shout(word):
      return word.upper()

  shout(None)
runnable: true
---

# A traceback is a map. Read bottom-up.

Here's what's about to happen, all the time, this year:

You ask Cursor for some code. It runs. It crashes. The screen
explodes with a wall of indented red text — file paths, function
names, line numbers, more file paths. Most non-coders take one look
at that wall and panic, then ask AI to "just fix it." That works
sometimes. It also produces "fixes" that hide the bug rather than
solving it.

The shortcut: **a traceback is a map of how Python got to the crash.**
Once you know the shape, you can find the bug in about ten seconds
without reading more than three lines.

## The anatomy of a traceback

The shape Python prints is *always the same*. Here's what `shout(None)`
gives you when you run the editor:

```
Traceback (most recent call last):
  File "main.py", line 4, in <module>
    shout(None)
  File "main.py", line 2, in shout
    return word.upper()
AttributeError: 'NoneType' object has no attribute 'upper'
```

Three layers, top to bottom:

1. **The header.** `Traceback (most recent call last):` — this just
   tells you that what follows is a traceback. The phrase "most
   recent call last" is the thing to remember: the *bottom* of the
   stack is where the crash actually happened.

2. **The stack frames.** Each pair of lines (`File ... line ...,
   in ...` followed by the source code on that line) is one *frame*
   — one function call that was in flight when the crash hit. They
   read top to bottom in the order calls were made: top is "where
   the program started," bottom is "where it actually crashed."

3. **The error line.** The very last line — `AttributeError: ...` —
   is the actual error: the *type* of error and a human-readable
   *message*.

## How to read it: bottom-up, three lines

For 90% of bugs, you only need three pieces of information, all near
the bottom of the traceback:

1. **The last line.** What kind of error is it, and what does the
   message say? `AttributeError: 'NoneType' object has no attribute
   'upper'` reads as: *you tried to call `.upper()` on something that
   was `None`*.
2. **The line right above it.** What was the actual code that
   crashed? Here, `return word.upper()` — that's the line where
   `.upper()` got called on `None`.
3. **The frame above *that*.** Who called the broken function with
   what argument? `shout(None)` on line 4 of `<module>` — that's
   where the bad value came in.

Now you have the full story: the bug is on line 2 (called `.upper()`
on `None`), but the *cause* is on line 4 (passed `None` to `shout`).
The fix could go in either place — guard the function, or stop
passing `None` to it.

## Where AI specifically helps and hurts here

When you paste a traceback into Cursor, it usually reads it correctly
and writes a real fix. The trap is when AI doesn't have the
traceback yet — when it's writing fresh code "blind." In that mode,
Cursor sometimes writes defensive code that swallows tracebacks,
like wrapping the function in a giant `try/except: pass` to "prevent
crashes." That's not a fix. That's hiding the map. We'll cover the
right and wrong ways to handle errors in the error-handling chapter.

## The reading habit to build

Every time you see a traceback, train yourself to do this in order:

1. Skip the header.
2. Read the last line. Identify the error type.
3. Read the line above it. Get the crashing code.
4. Read the frame above that. See who called in.

Stop there unless those three lines don't explain the bug. They
almost always do.

Run the editor. Watch the traceback come out. Read the last three
lines bottom-up. Find `None` in the call frame. That's the bug.
