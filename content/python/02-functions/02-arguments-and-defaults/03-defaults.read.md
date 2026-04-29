---
xp: 1
estSeconds: 110
concept: default-arguments
code: |
  def greet(name, greeting="hi"):
      return f"{greeting}, {name}"

  print(greet("alex"))
  print(greet("alex", "yo"))
  print(greet("alex", greeting="howdy"))
---

# Default values — how AI builds "knobs" into a function

Here's a thing that's about to happen all year: you'll ask Cursor for
a function that *creates a record*, *sends a notification*, or *runs a
job*. It comes back with twelve parameters. Most of them have an `=`
sign and a value already filled in. Eleven you'll never touch. One
matters this week.

That's a function with **default arguments**. The defaults are the
"sensible behavior unless you say otherwise" knobs. AI uses them
constantly — sometimes for good (sane defaults you can override) and
sometimes badly (mutable defaults, which we'll get to).

## The mental model

A parameter with a default has *two states*: the caller either passes
a value, or they don't. If they don't, Python uses the default.

```python
def greet(name, greeting="hi"):
    return f"{greeting}, {name}"
```

`name` is **required** — no default, you must pass it. `greeting` is
**optional** — pass it if you want, otherwise Python uses `"hi"`.

The editor on the right calls `greet` three ways:

```python
greet("alex")                    # → "hi, alex"
greet("alex", "yo")              # → "yo, alex"
greet("alex", greeting="howdy")  # → "howdy, alex"
```

Same function. Three different outputs. The defaults are *what
parameters fall back to when the caller stays quiet*.

## Why this is everywhere in AI code

Cursor writes default-heavy signatures because they're how you make
the same function work for the 80% case and the 20% case without
forking it. Every API client, request builder, retry helper, formatter
— they all show up like:

```python
def fetch(url, *, timeout=30, retries=3, headers=None, verify=True):
    ...
```

When you're reading that, the defaults *also* tell you what the
function's normal behavior is. `retries=3` says "by default, this
retries three times." That's a piece of behavior documented right in
the signature.

## The rule that bites everyone

**Defaulted parameters must come after non-defaulted ones.** This is
illegal:

```python
def greet(greeting="hi", name):   # SyntaxError
    ...
```

Python needs the optional ones at the end so it knows when positional
arguments stop being required. If you ever try to add a default in the
middle of an existing parameter list, Python will refuse — you have to
move it to the end or default everything to its right too.

## Where AI specifically gets defaults wrong

The single most famous Python footgun, and Cursor still falls into it:
**mutable default arguments.**

```python
def add_tag(item, tags=[]):
    tags.append(item)
    return tags
```

This looks fine. It is not. The list `[]` is created **once**, when
the function is defined, and then *the same list* is reused for every
call that doesn't pass `tags`. Calls accumulate state across each
other:

```python
add_tag("first")    # → ["first"]
add_tag("second")   # → ["first", "second"]   <- where did "first" come from?!
```

The fix is the convention you'll see in good Python code: use `None`
as the default and create the real default inside the function.

```python
def add_tag(item, tags=None):
    if tags is None:
        tags = []
    tags.append(item)
    return tags
```

Mutable defaults — lists, dicts, sets — should always be `None` in
the signature. When you see `tags=[]` or `headers={}` in AI-generated
code, flag it. That's a bug pattern Cursor still ships in 2026, and
you should be the one who catches it.

Run the editor. Three calls, three outputs, one definition.
