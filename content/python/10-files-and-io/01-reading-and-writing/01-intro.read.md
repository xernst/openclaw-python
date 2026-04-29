---
xp: 1
estSeconds: 35
concept: file-io-introduction
code: |
  with open("/tmp/note.txt", "w") as f:
      f.write("hello from python\n")

  with open("/tmp/note.txt") as f:
      print(f.read())
runnable: true
---

# `open()` — the first thing AI does in any real script

Pull data from a CSV. Write a log. Cache an API response. Parse a config.
Every one of these starts with `open()`.

The shape AI reaches for almost every time:

```python
with open(path, mode) as f:
    f.read()    # or f.write(text), or f.readlines()
```

`mode` is one short string: `"r"` to read, `"w"` to write (and overwrite),
`"a"` to append. Default is read.

Run the editor. We write a file, then read it back. Pyodide gives us a
real virtual filesystem, so `/tmp/note.txt` works exactly like it would on
your machine.
