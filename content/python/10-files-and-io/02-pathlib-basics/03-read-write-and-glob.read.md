---
xp: 2
estSeconds: 130
concept: pathlib-read-write-glob
code: |
  from pathlib import Path

  base = Path("/tmp/notes")
  base.mkdir(exist_ok=True)
  (base / "alpha.txt").write_text("first")
  (base / "beta.txt").write_text("second")
  (base / "gamma.md").write_text("third")

  for txt in sorted(base.glob("*.txt")):
      print(txt.name, "->", txt.read_text())
---

# read_text, write_text, glob — the three you'll use every day

The intro showed `read_text` and `write_text`. This step adds the
third call you'll meet on day one of any AI project: `glob`. Together
they cover the 80% case for "read some files, do something, write the
result."

## `read_text` and `write_text`

`p.read_text()` opens the file at `p`, reads the whole contents into a
string, closes the file. Encoding defaults to UTF-8, which is what
you want 99% of the time.

`p.write_text(content)` opens the file at `p` for writing, dumps the
string, closes the file. If the file exists, it gets *overwritten* —
no append, no warning. If the parent directory doesn't exist, the
call raises `FileNotFoundError`. (You can `p.parent.mkdir(parents=True,
exist_ok=True)` to ensure the directory first.)

There's also `read_bytes` and `write_bytes` for binary content (PDFs,
images, anything not text). Same shape, different return type.

## `glob` — find files matching a pattern

`p.glob(pattern)` returns an iterator of paths inside the directory
`p` whose names match `pattern`. The pattern syntax is the one your
shell uses:

- `*` matches any sequence of characters in a *single* path segment
- `?` matches a single character
- `**` matches any number of directories (recursive)
- `[abc]` matches one character from the set

Common cases:

```python
base.glob("*.csv")        # all CSVs directly inside `base`
base.glob("*/*.csv")      # CSVs one level deep
base.glob("**/*.csv")     # CSVs anywhere underneath, recursive
```

`glob` returns an iterator, not a list. You usually want to wrap it in
`sorted(...)` or `list(...)` if the order matters or you'll iterate
twice. `sorted` gives you alphabetical order by full path, which is
deterministic and almost always what you want for a file listing.

## A worked example

The editor on the right writes three files into `/tmp/notes`, two
`.txt` and one `.md`, then globs only the text ones:

```python
from pathlib import Path

base = Path("/tmp/notes")
base.mkdir(exist_ok=True)
(base / "alpha.txt").write_text("first")
(base / "beta.txt").write_text("second")
(base / "gamma.md").write_text("third")

for txt in sorted(base.glob("*.txt")):
    print(txt.name, "->", txt.read_text())
```

Output:

```
alpha.txt -> first
beta.txt -> second
```

The `.md` file is filtered out because the pattern `*.txt` only
matches `.txt` extensions. `sorted` makes sure `alpha` comes before
`beta` regardless of insertion order. `txt.name` strips the directory,
giving just the filename.

This six-line shape — *make a directory, write a few files, glob and
read each one* — is what AI generates dozens of times in any data
pipeline, log processor, or scratch script.

## Where AI specifically gets this wrong

Two patterns worth flagging.

**One: forgetting `mkdir(exist_ok=True)`.** Cursor writes
`p.write_text(...)` against a path whose parent directory doesn't
exist yet, and the call blows up with `FileNotFoundError`. The fix is
one line — `p.parent.mkdir(parents=True, exist_ok=True)` before the
write. AI sometimes skips this and only adds it after the first crash.

**Two: globbing without `sorted`.** The order of `glob` results is
filesystem-defined, which means it's deterministic on one machine and
randomly different on another. If your script *does anything* based
on file order (concatenation, batching, IDs), wrap the glob in
`sorted(...)` or you'll ship a bug that only shows up in production.

Run the editor. Notice the `.md` file gets created but never read —
the pattern `*.txt` filters it out cleanly.
