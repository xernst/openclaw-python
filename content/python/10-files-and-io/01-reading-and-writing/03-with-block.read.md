---
xp: 2
estSeconds: 50
concept: with-statement-cleanup
code: |
  # the with-block closes the file for you when the block ends —
  # even if the code inside raises an exception.
  with open("/tmp/users.txt", "w") as f:
      f.write("maya\n")
      f.write("marcus\n")

  with open("/tmp/users.txt") as f:
      for line in f:
          print(line.strip())
---

# `with` — the line AI sometimes leaves out

You can open a file the long way:

```python
f = open("/tmp/data.txt")
contents = f.read()
f.close()
```

But if anything between `open` and `close` raises, the file stays open and
the OS holds the handle. On a long-running script, that leaks.

The `with` statement guarantees the file is closed when the block exits —
exception or no. AI usually writes it correctly. The bug shows up when
someone copies a snippet without the `with` and pastes it into a function.

Run the editor. Two `with` blocks: one writes, one reads line by line.
Notice `for line in f:` — files are iterables.
