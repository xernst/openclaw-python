---
xp: 2
estSeconds: 110
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

You have already seen `@something` written above a function dozens of
times in real Python code, even if you haven't written one yourself:

```python
@app.get("/users")          # FastAPI / Flask routing
@retry(3)                   # tenacity, retrying
@cache                      # functools.cache
@dataclass                  # dataclasses
@pytest.fixture             # pytest
@tool                       # LangChain
@app.task                   # Celery
@property                   # Python builtin
```

Every one of those is a **decorator**: a function that takes a function
and returns a (usually-wrapped) function. The `@` sign is just sugar
that hides the rebinding.

## The mental model: `@` is rebinding

This shape:

```python
@loud
def add(a, b):
    return a + b
```

…is *exactly* equivalent to this shape:

```python
def add(a, b):
    return a + b
add = loud(add)
```

That's the whole trick. Python defines `add` normally, then immediately
reassigns the name `add` to whatever `loud(add)` returns. From this
point on, anyone calling `add(2, 3)` is actually calling whatever `loud`
gave back — usually a wrapper that does some extra work and then forwards
the call to the original.

The `@` saves you from typing that rebinding line. That's its only
contribution. Everything else is just the closure pattern from the
previous read, with one extra layer.

## A worked example

The editor on the right has the canonical "logging decorator":

```python
def loud(fn):
    def wrapper(*args, **kwargs):
        print("calling:", fn.__name__)
        return fn(*args, **kwargs)
    return wrapper

@loud
def add(a, b):
    return a + b

print(add(2, 3))
```

Trace what happens, line by line:

1. `loud` is defined. It takes `fn` and returns a new `wrapper`
   function that *closes over* `fn`. (Closure pattern.)
2. `add` is defined normally — a plain `a + b` function.
3. `@loud` runs `add = loud(add)`. The original `add` is passed in as
   `fn`. `loud` returns the `wrapper` — and the name `add` is now
   pointing at the wrapper, not the original.
4. `add(2, 3)` is now really `wrapper(2, 3)`. Inside, `*args` is
   `(2, 3)`. `print("calling:", fn.__name__)` runs first — `fn` here
   is the original (closed-over) `add`, and its `__name__` is `"add"`.
   Then `fn(*args, **kwargs)` calls the original `add(2, 3)` and
   returns `5`.

Output:

```
calling: add
5
```

The decorator added behavior (the print) without changing the body of
`add`. That's the whole point: separation of *what the function does*
from *what's added on top of every call*.

## Why `*args, **kwargs` is in every wrapper

The wrapper has to forward whatever arguments the caller passed. You
don't know in advance what shape the decorated function takes —
`add(a, b)` has two args, `read_user(id)` has one, some other function
might have keyword arguments. `*args, **kwargs` is the catch-all:
*"take whatever you got and forward it untouched."*

If you wrote `def wrapper(a, b):` instead, the decorator would only work
on functions with exactly that signature. `*args, **kwargs` makes it
work on anything.

## Decorators with arguments

You'll also see decorators that take their *own* arguments, like
`@retry(3)` or `@app.get("/users")`. Those are just one more layer of
closure — a function that returns a decorator:

```python
def retry(n):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            for _ in range(n):
                try: return fn(*args, **kwargs)
                except Exception: pass
        return wrapper
    return decorator

@retry(3)
def fetch(url):
    ...
```

`retry(3)` runs first, returning the inner `decorator`. *Then* `@`
applies that decorator to `fetch`. Three nested functions, three layers
of closure. Look intimidating; read the same way every time.

## Where AI specifically gets this wrong

Three patterns to flag in code Cursor writes:

1. **Forgetting to return the wrapper.** `def loud(fn): def wrapper():
   ...` with no `return wrapper` at the end. Decorating sets the name
   to `None`. The next call to the function dies with `TypeError:
   'NoneType' object is not callable`.

2. **Forgetting `*args, **kwargs`.** AI writes `def wrapper():` and
   the decorated function silently loses all its parameters. Calling
   it raises `TypeError: wrapper() takes 0 positional arguments but 2
   were given`.

3. **Losing the function's name and signature.** After `add = loud(add)`,
   `add.__name__` is `"wrapper"`, not `"add"`. Tracebacks become
   confusing. The fix is `from functools import wraps` and decorate
   the wrapper with `@wraps(fn)`. AI sometimes leaves this off — the
   code works, but debugging gets harder.

Run the editor. The wrapper runs first (printing the call), then it
calls the original `add`. The output reflects both: `calling: add`,
then `5`.
