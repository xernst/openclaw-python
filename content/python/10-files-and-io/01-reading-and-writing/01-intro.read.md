---
xp: 1
estSeconds: 90
concept: file-io-introduction
code: |
  with open("/tmp/note.txt", "w") as f:
      f.write("hello from python\n")

  with open("/tmp/note.txt") as f:
      print(f.read())
runnable: true
---

# `open()` — the first thing AI does in any real script

Pull rows from a CSV. Write a log line. Cache an API response. Parse a
config file. Save the user's notes to disk. Read the prompt template.
Every one of these starts with the same call: `open()`.

That's why imports lead the file, but `open()` leads the *real work*. If
you can't read the shape of a file open, you can't read what almost any
non-trivial AI-generated script is doing in its first few lines.

## The mental model

Treat a file like a phone call. There are exactly three moves:

1. **Pick up.** `open(path, mode)` connects your program to a file on
   disk. The OS hands back a *file object* — a Python value that
   represents that connection.
2. **Talk.** While the connection is open, you can call methods on the
   file object: `f.read()`, `f.write(...)`, `f.readlines()`, or iterate
   line-by-line.
3. **Hang up.** When you're done, the connection has to be closed.
   Otherwise the operating system keeps the handle pinned, and on a
   long-running script those handles pile up until the OS refuses to
   open new ones.

Python wraps all three steps in one shape, the **`with` block**:

```python
with open(path, mode) as f:
    # do stuff with f
# file is closed here, automatically
```

The `with` line opens the file and binds it to `f`. The indented body is
where you read or write. The instant the indent ends, Python closes the
file for you — even if the body raised an exception.

## The mode argument is one short string

The second argument to `open()` controls what kind of access you want.
The four you'll see Cursor reach for, all the time:

- **`"r"`** — read. The file must already exist. Default if you pass no
  mode.
- **`"w"`** — write. Creates the file if it doesn't exist, *truncates*
  (empties) it if it does. Use this carefully — it's how AI accidentally
  deletes your data.
- **`"a"`** — append. Creates the file if needed, but *adds to the end*
  rather than overwriting. This is what you want for logs.
- **`"rb"` / `"wb"`** — read/write *binary*. For images, audio, PDFs —
  any file that isn't text.

## A worked example

The editor on the right has the canonical write-then-read pair:

```python
with open("/tmp/note.txt", "w") as f:
    f.write("hello from python\n")

with open("/tmp/note.txt") as f:
    print(f.read())
```

Read line by line:

1. `open("/tmp/note.txt", "w")` opens the file in write mode, creating
   it. Bind it to `f`.
2. `f.write(...)` writes the string. The `\n` is a literal newline — most
   text formats want one at the end of every line.
3. The `with` block ends, Python closes the file.
4. We open the same path with no mode (defaults to `"r"`) and bind to a
   new `f`.
5. `f.read()` returns the file's entire contents as one string. Print it.

Output:

```
hello from python
```

Pyodide (the in-browser Python this course runs on) gives us a real
virtual filesystem, so `/tmp/note.txt` behaves exactly the way it would
on your laptop — same `open`, same `with`, same modes.

## Where AI specifically gets this wrong

Three patterns to flag in code Cursor writes:

1. **Using `"w"` when you meant `"a"`.** "Save the user's notes to
   `notes.txt`" gets written as `open(path, "w")`. Every time the user
   adds a note, the previous notes get *erased*. Always check the mode
   when AI writes a file the user expects to grow.

2. **Forgetting the `with` block.** Bare `open()` plus `.read()` plus
   `.close()` works most of the time and leaks file handles when an
   exception slips between open and close. The fix is to wrap it in
   `with`. We cover this in the next read.

3. **Hard-coded paths that won't exist on the user's machine.** AI loves
   `/tmp/data.csv` and `~/Desktop/notes.txt`. Real apps should use the
   `pathlib.Path` module or accept the path as a configurable argument,
   not bake it into a string literal.

Run the editor. We write `hello from python` to disk, then read it back
and print it. Two `with` blocks, two file handles, both cleanly closed.
