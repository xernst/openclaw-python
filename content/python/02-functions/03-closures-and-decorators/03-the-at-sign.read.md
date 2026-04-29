---
xp: 2
estSeconds: 60
concept: decorator-syntax
code: |
  def loud(fn):
      def wrapper(*args, **kwargs):
          print("calling:", fn.__name__)
          return fn(*args, **kwargs)
      return wrapper

  @loud
  def add(a, b):
      return a + b

  print(add(2, 3))
---

# `@something` — the decorator shortcut

Every time you've seen `@app.get("/users")`, `@retry(3)`, or `@cache`,
you've seen a **decorator**. It's a function that takes a function and
returns a (usually wrapped) function.

The `@loud` line above is shorthand for:

```python
add = loud(add)
```

That's it. The `@` saves you from typing the rebinding line. AI uses
decorators heavily for logging, retries, auth checks, caching, and route
registration.

Run the editor. The `wrapper` runs first (printing the call), then it
calls the original `add`. The output reflects both: `calling: add`, then
`5`.
