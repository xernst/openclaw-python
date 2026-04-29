# Chapter 12 — Scope, `*args`, `**kwargs`, Lambdas

## 12.1 Scope — where a name is visible (LEGB)

Python searches for a name in this order:

- **L**ocal — inside the current function
- **E**nclosing — outer function in a nested setup
- **G**lobal — module level
- **B**uilt-in — `print`, `len`, etc.

```python
MAX_RETRIES = 3       # global

def fetch():
    attempt = 0       # local
    while attempt < MAX_RETRIES:
        attempt += 1
```

To *assign* to a global from inside a function, use `global`:

```python
count = 0
def inc():
    global count
    count += 1
```

`global` is usually a smell — pass state around explicitly instead. `nonlocal` is the analog for an enclosing (non-global) scope, used in closures.

## 12.2 Closures

A function defined inside another function captures the outer scope:

```python
def make_counter():
    n = 0
    def inc():
        nonlocal n
        n += 1
        return n
    return inc

c = make_counter()
print(c(), c(), c())   # 1 2 3
```

Closures are the foundation of decorators (ch 18).

## 12.3 `*args` — variable positional args

Collects extras into a tuple:

```python
def broadcast(topic, *messages):
    for m in messages:
        print(topic, m)

broadcast("Main", "hi", "ready", "ship")
```

## 12.4 `**kwargs` — variable keyword args

Collects extras into a dict:

```python
def log_event(kind, **fields):
    print(kind, fields)

log_event("click", user="ava", page="/home")
```

## 12.5 Full parameter signature (order matters)

```python
def f(pos_required, pos_default="x", *args, kw_only, kw_default="y", **kwargs):
    ...
```

Real code rarely uses all of these. Use `*args`/`**kwargs` deliberately, not preemptively.

## 12.6 Unpacking in function calls

```python
nums = [1, 2, 3]
print(*nums)                     # print(1, 2, 3)

opts = {"sep":"-", "end":"\!"}
print("a","b","c", **opts)
```

`*` unpacks a list/tuple into positional args; `**` unpacks a dict into keyword args. Super handy for forwarding arguments:

```python
def wrapper(*args, **kwargs):
    return inner(*args, **kwargs)
```

## 12.7 Lambdas — tiny anonymous functions

```python
square = lambda x: x * x
```

You'll rarely *name* a lambda — just pass one to `sorted`, `max`, `min`, `filter`, `map`, or `key=`:

```python
people = [{"name":"Bea","age":40},{"name":"Ava","age":22}]
people.sort(key=lambda p: p["age"])
```

A lambda can only be a single expression. If it grows, promote to `def`.

## 12.8 `map` and `filter` — often worse than a comprehension

```python
doubled = list(map(lambda n: n*2, nums))
evens   = list(filter(lambda n: n % 2 == 0, nums))

# Usually clearer:
doubled = [n*2 for n in nums]
evens   = [n for n in nums if n % 2 == 0]
```

Use `map` only when passing an already-named function: `list(map(int, strings))`.

## Vibe-Coding Corner

- **Internalize:** LEGB, `*args`/`**kwargs`, unpacking with `*`/`**`, lambdas for `key=`.
- **Skim:** `global`, `nonlocal` (unless you're writing decorators — ch 18).
- **AI gets wrong:** forgets `nonlocal` in closures; writes complicated `reduce(lambda a,b: ..., )` when a for-loop is clearer.
