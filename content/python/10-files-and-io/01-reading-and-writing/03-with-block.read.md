---
xp: 2
estSeconds: 100
concept: with-statement-cleanup
code: |
  with open("/tmp/users.txt", "w") as f:
      f.write("maya\n")
      f.write("marcus\n")

  with open("/tmp/users.txt") as f:
      for line in f:
          print(line.strip())
---

# `with` — the line AI sometimes leaves out

There are two ways to open a file in Python. The long way:

```python
f = open("/tmp/data.txt")
contents = f.read()
f.close()
```

…and the right way:

```python
with open("/tmp/data.txt") as f:
    contents = f.read()
```

Both produce the same result on the happy path. The difference is what
happens when something goes wrong between `open` and `close`.

## The mental model: `with` is a guarantee

The long-form version is a manual contract. *You* promise to call
`f.close()` after you're done. If anything raises an exception between
the `open` and the `close` — a `KeyError` while parsing the contents, a
network call inside the loop that times out, a typo on a method name —
the `close()` line *never runs*. The OS keeps the file handle pinned.

A pinned file handle on its own seems harmless. Run that code in a loop
that processes ten thousand files, and on the thousandth iteration your
script crashes with `OSError: Too many open files`. Now you have to
debug a problem that has nothing to do with the line that actually fails
— the symptom is on iteration 1000, the leak started on iteration 1.

The `with` block makes that impossible:

```python
with open(path) as f:
    risky_thing(f)   # if this raises…
# …the file is still closed before the exception propagates
```

Python guarantees that the file gets closed the instant the indent ends,
*regardless of how* you leave the block. Normal completion, return
statement, raised exception — all paths run the cleanup.

## The technical name (you'll see it in tracebacks)

`with` is a **context manager**. Anything that has `__enter__` and
`__exit__` methods can sit on the right side of `with`. Files are the
most common, but you'll also see:

```python
with lock:                                  # threading.Lock
    shared_state.update(thing)

with sqlite3.connect("db.sqlite") as conn:  # database connection
    cursor = conn.cursor()

with open("a") as a, open("b") as b:        # multiple at once
    ...
```

Same shape, same guarantee — the resource is acquired at the top,
released at the bottom, no matter what happens in between.

## A worked example

The editor on the right writes a two-line file, then reads it back line
by line:

```python
with open("/tmp/users.txt", "w") as f:
    f.write("maya\n")
    f.write("marcus\n")

with open("/tmp/users.txt") as f:
    for line in f:
        print(line.strip())
```

Walk through it:

1. First `with` opens the file in write mode. Two `f.write` calls add
   `maya\n` and `marcus\n`. The block ends, the file closes.
2. Second `with` opens the same file for reading.
3. **`for line in f:`** is the line worth memorizing. A file object is
   *iterable*, and iterating it yields one line at a time, in order,
   *including the trailing `\n`*.
4. **`line.strip()`** removes the trailing newline (and any leading
   whitespace) before printing. Without `strip()`, every printed line
   would have an extra blank line beneath it because `print` adds its
   *own* `\n`.

Output:

```
maya
marcus
```

The for-loop pattern is more memory-friendly than `f.read()` for big
files. `f.read()` loads the whole thing into RAM. `for line in f` reads
one line at a time, which lets you process gigabyte-sized log files on a
laptop with 8 GB of RAM.

## Where AI specifically gets this wrong

Three patterns to flag in code Cursor writes:

1. **Bare `open()` without `with`.** Cursor occasionally generates
   `f = open(path); contents = f.read(); f.close()`. The block-form is
   safer in every situation. Replace it.

2. **Forgetting `.strip()` when iterating lines.** `for line in f: print
   (line)` produces the right text but with double-spacing. The fix is
   `print(line.strip())` or `print(line, end="")`.

3. **Reading a giant file with `.read()` or `.readlines()`.** Both load
   the entire file into memory. On a 5GB log, that's a crash. AI writes
   `.readlines()` reflexively because it's "Pythonic"; for big files,
   the line-iterator form is correct.

Run the editor. Two users get written, then read back, line by line, both
files closed by `with`.
