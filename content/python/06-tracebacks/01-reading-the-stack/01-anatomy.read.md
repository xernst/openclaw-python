---
xp: 1
estSeconds: 50
concept: traceback-anatomy
code: |
  def shout(word):
      return word.upper()

  shout(None)
runnable: true
---

# A traceback is a map. Read bottom-up.

When Python crashes, it prints a wall of text called a **traceback**. Most
non-coders panic at it. AI builders read it.

The structure is always the same:

```
Traceback (most recent call last):
  File "main.py", line 4, in <module>
    shout(None)
  File "main.py", line 2, in shout
    return word.upper()
AttributeError: 'NoneType' object has no attribute 'upper'
```

Three things to grab:

1. **The last line** is the actual error: type + message. `AttributeError`
   means *you tried to access a method on the wrong type*.
2. **The line right above it** is where it crashed: file + line number +
   the exact code.
3. **Everything above that** is the call stack — *who called who*. Usually
   you only care about the bottom two frames.

Hit **Run** on the right. Read the traceback bottom-up. The fix is on line 2,
but the bad input came from line 4.
