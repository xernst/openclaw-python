## The first thing AI does in any real project

Read a CSV. Write a log. Parse a JSON dump. Walk a directory looking for `.py` files. Open `.env`. Append to a file. Move a file. Delete a stale cache.

The first thing AI does in any real project is touch a file. Not the database — that comes later. Not the API — that's chapter 12. Files. Local files, on disk, with paths, that you read or write byte by byte. Every script you'll ship this year touches files at some point, and the few patterns AI uses constantly are the few patterns you need fluent.

This chapter is those patterns plus the modern Python file-handling tools (`pathlib`) that have replaced the old `os.path` style AI sometimes still ships.

## The mental model: open, do something, close

Every file operation is the same shape:

```python
with open("data.csv", "r") as f:
    contents = f.read()
# file is closed here automatically
```

The `with` block opens the file, gives you a handle (`f`), and *guarantees* the file gets closed when the block ends — even if your code crashes in the middle. The opposite is `f = open("data.csv"); ... ; f.close()`, which AI sometimes still ships (training data) and which leaks file handles when something goes wrong before the close.

Modern Python uses `pathlib.Path` instead of strings for file paths:

```python
from pathlib import Path

p = Path("data") / "users.csv"
contents = p.read_text()
```

Two lines, no `open`/`close` boilerplate, cross-platform path joining (the `/` operator handles `\` on Windows for you). AI ships both styles; the `pathlib` one is shorter and harder to mess up.

## What this chapter covers in three lessons

**Lesson 1: Reading and writing.** `with open(...) as f`, `read`, `readlines`, `write`, the difference between text mode (`"r"`) and binary mode (`"rb"`), and the AI-bug of forgetting to specify `encoding="utf-8"` (which silently produces wrong characters on systems with a different default).

**Lesson 2: `pathlib` basics.** `Path()`, the `/` operator for joining, `read_text()` / `write_text()`, `exists()`, `glob()` for finding files by pattern, and the AI-pattern of mixing `os.path` (older) with `pathlib` (newer) in the same file.

**Lesson 3: CSV and JSONL.** The two structured-text formats AI ships into your project most: `csv.DictReader` for spreadsheets, JSONL (one JSON object per line) for logs and AI-generated datasets. Includes the bug Cursor ships when it iterates a CSV and forgets the header row.

## What AI specifically gets wrong about files

Three patterns:

1. **Forgetting `encoding="utf-8"`.** On Windows the default is `cp1252`. On a Mac it's `utf-8`. AI writes code that works locally and breaks in CI or in production for users with different locales. Lesson 1 has a fix step.

2. **Reading entire files into memory when streaming would work.** AI defaults to `f.read()` even on multi-gigabyte log files. Crashes. The right pattern is `for line in f:` which streams. Lesson 1 covers it.

3. **Mixing `os.path` and `pathlib`.** AI's training data has both. The same project ends up with half the file handling in old style and half in new. Not wrong, just messy and harder to read. Lesson 2 standardizes.

## What you'll be able to do at the end

Three lessons, ~27 steps. By the end you'll be able to:

- Read or write any text or binary file with the modern Python idiom.
- Use `pathlib` confidently for path joining, existence checks, and glob patterns.
- Parse a CSV or a JSONL file and pull values out of it.
- Spot the three top "AI shipped wrong file handling" patterns in code review.

Chapter 18 (secrets and env) reads `.env` files. Chapter 22 (capstone) reads from and writes to a config dict that mimics file I/O. Chapter 9 (error handling) is partially about handling the file-not-found case. This chapter is the foundation under all of them.

Press *Start chapter* below.
