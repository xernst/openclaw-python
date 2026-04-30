## When AI's code crashes mid-flight

AI loves a happy path. The model writes the function, the script runs once on the test data, everything looks great. You ship it. The first time the file isn't there, the API returns 503, the JSON has an extra field, or the user passes an empty string — the program blows up.

`try/except` is how you keep the program alive long enough to log what went wrong, retry sensibly, or surface a useful error to the user instead of a stack trace.

This chapter is reading and writing error handling well — including spotting the most-shipped AI mistake of all: catching every exception silently and pretending nothing happened.

## The mental model: a guard rail, not a blanket

`try/except` is a guard rail. You wrap a specific operation that *can* fail, you catch the *specific* exception you know how to handle, and you do something useful with it.

```python
try:
    response = httpx.get(url, timeout=5)
    response.raise_for_status()
except httpx.TimeoutException:
    log("API timeout, retrying in 30s")
    sleep(30)
    # retry...
except httpx.HTTPStatusError as e:
    log(f"API returned {e.response.status_code}")
    raise
```

Read that as: *try this network call. If it times out, I know what to do — log and retry. If the server returned a bad status, I know what to do — log and re-raise so the caller sees it. Anything else, I don't know how to handle, so let it bubble up.*

That last part is the key. **You catch the exceptions you know how to handle, and you let the rest bubble up.** The wrong move — and the one AI ships fluently — is `try: ... except: pass`, which catches *every* exception, *including the ones you didn't anticipate*, and silently drops them. Bugs become invisible. Two weeks later your prod is corrupting data and no error log mentions it.

## What this chapter covers in three lessons

**Lesson 1: `try/except` basics.** The shape, the order of clauses (specific exceptions first, broad ones last), the `else` and `finally` blocks, and the AI-pattern of catching `Exception` (too broad) when the right answer is `FileNotFoundError` (specific).

**Lesson 2: Catching specific errors.** The standard exception hierarchy (`Exception` → `OSError` → `FileNotFoundError`, etc.), and the rule of thumb: catch the most-specific exception you can name. Includes the bug Cursor produces when it catches `Exception` and accidentally swallows `KeyboardInterrupt` (the user's Ctrl-C).

**Lesson 3: Raising and custom exceptions.** When to `raise` (never silently swallow; always either handle or re-raise), how to define custom exception classes for your project, and the AI-pattern of raising `Exception("something went wrong")` (generic) instead of `ValueError("price must be positive")` (specific and actionable).

## What AI specifically gets wrong about error handling

Three patterns:

1. **`except: pass` everywhere.** The flagship bug. Lesson 1 step 7 fixes one. Recognize it on sight: catching everything and dropping it on the floor is almost never what you want.

2. **Catching too broad.** AI writes `except Exception` when `except FileNotFoundError` is the right answer. The broad catch hides bugs. Lesson 2 covers it.

3. **Raising bare `Exception`.** When you do raise, the message and class matter. `raise ValueError("price must be > 0, got -3")` is debuggable. `raise Exception("error")` is not. Lesson 3 has a fix step for this.

## What you'll be able to do at the end

Three lessons, ~27 steps. By the end you'll be able to:

- Read any `try/except` block and tell whether it's helpful or a silent-failure trap.
- Write error handling that catches what you can fix and lets everything else bubble up.
- Recognize the three top "AI shipped this wrong" error-handling patterns in code review.
- Define a custom exception class when your project benefits from one.

Chapters 10 (files and I/O), 12 (HTTP and APIs), and the entire wedge ch13-22 do real I/O — file reads, network calls, API requests. Real I/O fails. This chapter is the discipline for handling those failures without making the program a black hole.

Press *Start chapter* below.
