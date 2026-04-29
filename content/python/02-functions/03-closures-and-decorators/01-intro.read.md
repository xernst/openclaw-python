---
xp: 1
estSeconds: 100
concept: closure-introduction
code: |
  def make_greeter(prefix):
      def greet(name):
          return f"{prefix}, {name}"
      return greet

  hi = make_greeter("hi")
  hello = make_greeter("hello")

  print(hi("maya"))
  print(hello("marcus"))
runnable: true
---

# A closure is a function that remembers

The first time you read a FastAPI route handler, or a `@retry(3)`
wrapper around an API call, or a LangChain tool that binds itself to a
config — there's a shape inside that code that looks like a function
defined *inside* another function, and the inner one being returned to
the outside world.

That shape is a **closure**, and once you can see it, half of what AI
writes for production code suddenly makes sense.

## The mental model

A closure is a function carrying around a snapshot of the variables
that were in scope when it was defined.

In Python, a function defined inside another function can see the
*outer* function's local variables. Normally that's not interesting —
the outer function returns and its locals disappear. But if the inner
function gets *returned* (or stored somewhere that outlives the outer
call), it keeps a reference to those locals. They don't disappear,
because the inner function is still pointing at them.

```python
def make_greeter(prefix):       # prefix is a local of make_greeter
    def greet(name):
        return f"{prefix}, {name}"   # greet "captures" prefix
    return greet                # greet escapes — and prefix escapes with it
```

The inner function `greet` "closes over" the variable `prefix`. That's
literally where the word *closure* comes from. The function carries the
captured variable with it, like a backpack.

## A worked example

The editor on the right makes two greeters from the same factory:

```python
def make_greeter(prefix):
    def greet(name):
        return f"{prefix}, {name}"
    return greet

hi = make_greeter("hi")
hello = make_greeter("hello")

print(hi("maya"))      # "hi, maya"
print(hello("marcus")) # "hello, marcus"
```

Two things to notice:

1. **`make_greeter` already returned** by the time we call `hi(...)`.
   Its frame is gone. But the `prefix` variable lives on, because the
   `greet` function it produced is still holding a reference to it.
2. **The two greeters have separate captured prefixes.** `hi` captured
   `"hi"`. `hello` captured `"hello"`. They don't share state — each
   call to `make_greeter` produced its own private `prefix`. This is
   why closures are useful for *configuration*: you can produce many
   functions from one factory, each pre-loaded with its own settings.

## Why this shape shows up everywhere in AI code

Every framework that lets you "register a function with some config"
uses a closure under the hood. A few you'll see Cursor produce:

```python
# FastAPI — the inner function is captured with its dependencies
@app.get("/users/{id}")
def read_user(id: int):
    return db.get_user(id)

# Retry wrapper — captures max_attempts
def make_retry(max_attempts):
    def wrapper(fn):
        def call(*args, **kw):
            for _ in range(max_attempts):
                try: return fn(*args, **kw)
                except Exception: pass
        return call
    return wrapper

# LangChain tool binding — captures the model and config
def make_tool(model, config):
    def run(input):
        return model.invoke(input, config=config)
    return run
```

Same pattern every time. An outer function takes the *configuration*.
An inner function uses that config to do the *work*. The outer returns
the inner. The config is captured.

## Where AI specifically gets this wrong

Two patterns to flag in code Cursor writes:

1. **Late binding in a loop.** This bites everyone exactly once:
   ```python
   funcs = []
   for i in range(3):
       funcs.append(lambda: i)
   print([f() for f in funcs])     # [2, 2, 2], not [0, 1, 2]
   ```
   Each lambda captures the *variable* `i`, not its value at the moment
   of capture. By the time you call them, the loop has finished and
   `i` is `2`. The fix is `lambda i=i: i` — pin the value via a default
   argument. AI gets this wrong about half the time when the loop body
   is doing something complex.

2. **Mutating captured state by accident.** A closure can read outer
   variables freely, but writing to them needs `nonlocal` or you'll get
   a fresh local instead. We cover this in the next read.

Run the editor. Two greeters, two different prefixes, neither leaks into
the other.
