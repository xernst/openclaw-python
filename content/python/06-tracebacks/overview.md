## Cursor wrote this and it crashed — now what?

You ask Cursor to add a feature. Cursor writes 40 lines of confident-looking Python. You hit Run. The terminal explodes into a wall of text. Lines and lines of file paths, line numbers, function names, indented arrows. The actual error message is buried at the bottom in red.

Most non-engineers panic at this. They scroll up looking for the "real" error and don't find it. They paste the whole thing back to Cursor and ask it to fix. Sometimes that works, more often the model thrashes on it for three turns and produces a different broken version.

The trick is that the wall of text isn't a wall of text. It's a structured report. Once you can read the structure, debugging Python crashes is the easiest thing you'll do all week. This chapter teaches you to read it.

## The mental model: reading bottom-up

A Python traceback is a stack of function calls, ordered top-to-bottom, with the actual crash at the very bottom. **Read it bottom-up.**

```
Traceback (most recent call last):
  File "app.py", line 42, in <module>
    main()
  File "app.py", line 38, in main
    process_users(users)
  File "app.py", line 22, in process_users
    user_id = user["id"]
KeyError: 'id'
```

The bottom line — `KeyError: 'id'` — is *what went wrong*. The lines above it are the chain of calls that led there. Read bottom-up: "I tried to look up the key `'id'`, on a dict, in `process_users`, line 22. I got there because `main` called `process_users` on line 38. I got there because something called `main` on line 42 of `app.py`."

That's the entire trick. Bottom is the bug. Going up tells you how the program got to the bug. Most non-engineers read tracebacks top-down (because that's how you read everything else) and feel lost in the middle. Reading bottom-up is the unlock.

## What this chapter covers in three lessons

**Lesson 1: Reading the stack.** What every line in a traceback means, the bottom-up reading order, and how to extract the three things that matter: the error type, the error message, and the line where it crashed. Lesson includes "given this traceback, what's the bug" exercises.

**Lesson 2: The five error classes that cover 95%.** `NameError`, `TypeError`, `KeyError`, `AttributeError`, `IndexError`. What each one means, what causes it, and the AI-pattern that produces each. By the end of this lesson you'll diagnose the bug from the error class alone, before you even read the message.

**Lesson 3: Print-debugging and `breakpoint()`.** When the traceback isn't enough — the script doesn't crash, it just produces wrong output. The `print` strategy that finds the bug in three iterations, and Python's built-in `breakpoint()` for when the script gets too gnarly to print.

## What AI specifically gets wrong about debugging

Three patterns Cursor reliably ships:

1. **Catching exceptions that should bubble up.** AI loves `try: ... except: pass` because it makes the immediate error go away. The error then resurfaces three steps later with a misleading message. The fix is to let the exception bubble and read the traceback. Lesson 1 covers it.

2. **Reading the traceback wrong.** Cursor sometimes pastes a traceback into a prompt and reads it top-down — gets confused about which function is the source of the error vs which is the caller. Then it "fixes" the wrong function. Lesson 2 has examples.

3. **Logging instead of debugging.** AI sometimes scatters `logger.info(...)` calls everywhere instead of using `print` or `breakpoint` for active debugging. The logs accumulate, the bug stays. Lesson 3 covers when to log vs when to debug interactively.

## What you'll be able to do at the end

Three lessons, ~26 steps. By the end you'll be able to:

- Read any Python traceback bottom-up and identify in 30 seconds: what error type, what line, what caused it.
- Recognize the five error classes that cover 95% of crashes (`NameError`, `TypeError`, `KeyError`, `AttributeError`, `IndexError`) and predict the bug from the class alone.
- Run a print-debugging session that finds a wrong-output bug in three iterations.
- Spot the three top "AI shipped wrong debugging" patterns.

This chapter is the difference between a PM who debugs alongside their engineer and a PM who hands every error over for someone else to fix. Once you can read tracebacks, every chapter from here gets easier — chapters 9 (error handling) and 22 (capstone) lean on this hard.

Press *Start chapter* below.
