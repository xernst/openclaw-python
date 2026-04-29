---
xp: 2
estSeconds: 60
concept: breakpoint-overview
code: |
  # we can't drop into an interactive debugger in the browser, so the
  # editor below DOES NOT call breakpoint(). on a real machine, the
  # commented call below would pause execution and let you inspect.
  def total(items):
      result = 0
      for item in items:
          # breakpoint()   # <- on your machine, this would pause here
          result += item
      return result

  print(total([5, 12, 3]))
---

# `breakpoint()` is `print` with a real cockpit

`print` is fine for "what's the value here?". When you need to *poke
around* — inspect any variable, run a quick expression, walk forward
one line at a time — Python ships a one-line built-in:

```python
breakpoint()
```

Drop that line wherever you want execution to pause. On a normal Python
machine, you land in `pdb`, the built-in debugger. From there:

- `p variable` prints a value
- `n` runs the next line
- `c` continues until the next `breakpoint()` (or the end)
- `q` quits

It's how senior engineers actually debug. AI sometimes drops a
`breakpoint()` for you mid-script — leave it in, run it, and pdb opens.

> **Browser note:** Pyodide can't open an interactive `pdb` session, so
> we don't run `breakpoint()` in this editor. The commented line in the
> code shows where it would go on your machine.
