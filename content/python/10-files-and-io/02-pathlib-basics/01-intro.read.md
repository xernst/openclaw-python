---
xp: 1
estSeconds: 110
concept: pathlib-introduction
code: |
  from pathlib import Path

  log = Path("/tmp/run.log")
  log.write_text("started\n")
  log.write_text(log.read_text() + "finished\n")

  print(log.read_text())
  print("exists?", log.exists())
  print("name:", log.name)
runnable: true
---

# `Path` — the object that replaces a thousand string operations

Reading AI-generated Python, you'll see two completely different ways
of working with files. The old one looks like this:

```python
import os
log_path = os.path.join("data", "logs", "today.log")
if os.path.exists(log_path):
    with open(log_path) as f:
        text = f.read()
```

Five function calls, three string-joining steps, and you still have to
remember which OS-specific separator to worry about. AI ships this
shape constantly because it's been on the internet since 2007.

The new way looks like this:

```python
from pathlib import Path
log_path = Path("data") / "logs" / "today.log"
if log_path.exists():
    text = log_path.read_text()
```

Same job. Half the lines. No string mashing. The `/` operator joins
path segments correctly on every platform. `.exists()` is a method on
the path object, not a function in another module. `.read_text()`
opens, reads, and closes the file in one call.

## The mental model

A `Path` object is a *value that represents a filesystem location*. It
doesn't matter whether the file exists yet — `Path("anything")` is
always a valid object. What you do with it next is what matters:

- **Build** new paths: `p / "subdir" / "file.txt"`
- **Inspect** without touching disk: `p.name`, `p.suffix`, `p.parent`
- **Check** the filesystem: `p.exists()`, `p.is_file()`, `p.is_dir()`
- **Read/write**: `p.read_text()`, `p.write_text("...")`,
  `p.read_bytes()`
- **List children**: `p.iterdir()`, `p.glob("*.csv")`

Every one of those is a method on the object. There is no separate
`os.path.something` function to remember. The object knows what it
can do.

## A worked example

The editor on the right uses `Path` end to end:

```python
from pathlib import Path

log = Path("/tmp/run.log")
log.write_text("started\n")
log.write_text(log.read_text() + "finished\n")

print(log.read_text())
print("exists?", log.exists())
print("name:", log.name)
```

Line by line:

1. Build a `Path` object pointing at `/tmp/run.log`. The file doesn't
   have to exist yet.
2. `write_text` creates the file (or overwrites it) with the string
   `"started\n"`.
3. `write_text` again — but this time the new content is the *current*
   text plus `"finished\n"`. The file ends up with two lines. (You'd
   normally use `"a"` mode for true appending, but this composition
   shows that `read_text` and `write_text` work together cleanly.)
4. Print the final contents — `started\nfinished\n`.
5. `.exists()` returns `True` now that we've written it.
6. `.name` returns just the filename component, `"run.log"`.

No `open(...)`. No `with` block. No `f.write(...)`. Three method
calls do what `open` + `with` + `f.read` + `f.close` did.

## Where AI specifically gets this wrong

Three patterns to flag in code Cursor writes you.

**One: `os.path.join(...)`.** Anytime you see `os.path.join("a",
"b")`, that's a `Path("a") / "b"` waiting to happen. The pathlib
version is shorter, type-checked, and platform-correct. AI defaults
to `os.path.join` because most of its training data is older than
pathlib being stable. Replace it.

**One-and-a-half: `os.path.exists(p)`.** Becomes `p.exists()`. Same
behavior, no extra import.

**Two: building paths with `+` or f-strings.** `path + "/" + name` is
broken on Windows and ugly everywhere. `Path(path) / name` is one
character shorter and works on every platform. Look for `f"{folder}/
{file}"` constructions in AI code — every one of those is a
candidate for the `/` operator on a `Path`.

**Three: `open(...)` for tiny reads.** When AI writes a four-line
`with open(p) as f: text = f.read()` block to read one config file,
it's `Path(p).read_text()` in disguise. The `with` block matters when
you're streaming or reading line by line — but for "load the whole
thing into a string," `read_text` is the move.

Run the editor. The Pyodide environment exposes a virtual `/tmp`, so
the file genuinely gets written and read inside the browser.
