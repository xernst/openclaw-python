# Chapter 11 — Functions

A function is a named, reusable block of logic. Once you write anything real, you live inside functions.

## 11.1 Defining and calling

```python
def score(title: str, salary: int) -> int:
    base = 50
    if "AI" in title: base += 20
    if salary >= 180_000: base += 15
    return base

print(score("AI Lead", 200_000))
```

Anatomy:
- `def` keyword
- function name in `snake_case`
- parameter list in `()`
- optional **return type hint** after `->` (Chapter 19 goes deep)
- indented body
- `return value` sends a value back — implicit return is `None`

## 11.2 Positional vs keyword arguments

```python
def send(topic, message, silent=False): ...

send("Main", "hi")                     # positional
send(topic="Main", message="hi")       # keyword
send("Main", "hi", silent=True)        # mix
```

Keyword args at call sites make code self-documenting. Force keyword-only with `*`:

```python
def send(*, topic, message, silent=False): ...
send(topic="Main", message="hi")       # callers MUST use keywords
```

Force positional-only with `/`:

```python
def greet(name, /, greeting="hi"): ...
greet("ava")           # ok
greet(name="ava")      # TypeError
```

Positional-only is rare; keyword-only is common and great for boolean flags.

## 11.3 Default parameters

```python
def fetch(url, timeout=10, retries=3): ...
```

**Gotcha:** never default to a mutable (`[]`, `{}`, `set()`). Python evaluates defaults once, so all calls share the same object:

```python
def bad(items=[]):            # WRONG — shared list
    items.append("x")
    return items

def good(items=None):         # fix
    if items is None:
        items = []
    items.append("x")
    return items
```

## 11.4 `*args` and `**kwargs` (preview — ch 12)

Variable-length arguments:

```python
def log(*args, **kwargs):
    print(args, kwargs)

log(1, 2, 3, level="INFO")
# (1,2,3) {'level':'INFO'}
```

## 11.5 Docstrings

First string in a function body is documentation. Tools, IDEs, and `help()` show it.

```python
def score(title, salary):
    """Return a 0-100 relevance score.

    Args:
        title:  The posting title.
        salary: Base salary in USD.
    Returns:
        Integer 0..100 — higher is better fit.
    """
```

Use triple quotes. Google style is common and readable; pick a style and stay consistent.

## 11.6 Returning multiple values (via tuple)

```python
def stats(nums):
    return min(nums), max(nums), sum(nums)/len(nums)

lo, hi, avg = stats([1,2,3])
```

## 11.7 Early returns — the "guard clause" pattern

Flatten deep `if`-nesting:

```python
def categorize(note):
    if not note:        return "inbox"
    if note.archived:   return "archive"
    if "project" in note.tags: return "projects"
    return "resources"
```

Cleaner than nested `if`/`elif`/`else`.

## 11.8 Pure vs side-effecting

A **pure** function uses only its inputs and returns a value. A side-effecting one reads/writes files, mutates shared state, prints, calls an API, etc.

Prefer pure functions when you can — easier to test and reason about. Chapter 24 (pytest) is much easier when your logic is pure.

## 11.9 Calling a function stores a reference

Functions are objects. You can pass them around, stick them in lists, use them as dict values.

```python
def add(a, b): return a + b
def mul(a, b): return a * b
ops = {"+": add, "*": mul}
ops["+"](2, 3)     # 5
```

This unlocks dispatch tables (ch 27) and higher-order functions.

## Vibe-Coding Corner

- **Internalize:** `def`/`return`, default args (and the mutable-default trap), keyword-only with `*`, docstrings, tuple returns, guard clauses.
- **Skim:** positional-only `/`, overloading via `typing.overload`.
- **AI gets wrong:** defaults `=[]`; forgets `return` and then wonders why the result is `None`; doesn't name boolean flags as keyword-only (leading to confusing call sites).
