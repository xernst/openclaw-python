---
xp: 1
estSeconds: 45
concept: enumerate-introduction
code: |
  names = ["maya", "marcus", "riley"]

  for i, name in enumerate(names):
      print(i, name)
runnable: true
---

# `enumerate` — when AI needs the index too

Half the loops AI writes need both the value *and* its position: *the
third item*, *line 12 of the file*, *step 4 of the workflow*.

Beginners (and a surprising amount of AI-generated code) reach for
`for i in range(len(names)):` and then `names[i]` inside. That works,
but it's the C-flavored version. Python has a one-line built-in:

```python
for i, value in enumerate(items):
    ...
```

`enumerate` hands you both. By default, `i` starts at `0`. Pass
`enumerate(items, start=1)` if you want it to start at `1` (for human
display).

Run the editor. Three names, indexed `0`, `1`, `2`. No `range(len(...))`
needed.
