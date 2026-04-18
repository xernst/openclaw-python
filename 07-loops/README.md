# Chapter 7 — Loops

## 7.1 `for` — iterate over an iterable

```python
for fruit in ["apple", "banana", "cherry"]:
    print(fruit)
```

Iterable = "anything you can go through once": lists, tuples, strings, dicts, sets, files, `range()`, generators, etc.

## 7.2 `range()` — numeric loops

```python
range(5)          # 0..4
range(1, 6)       # 1..5
range(0, 10, 2)   # 0,2,4,6,8
range(10, 0, -1)  # 10..1
```

`range` is lazy — it doesn't build a list, it yields numbers on demand. Memory-friendly for huge ranges.

## 7.3 `while` — repeat while a condition holds

```python
tries = 0
while tries < 3:
    ...
    tries += 1
```

Use `while` when you don't know the iteration count up front (reading until a user quits, draining a queue). Otherwise prefer `for`.

## 7.4 `break` and `continue`

- `break` — exit the loop now.
- `continue` — skip to the next iteration.

```python
for n in range(10):
    if n == 7: break
    if n % 2 == 0: continue
    print(n)   # 1, 3, 5
```

## 7.5 `for/else` and `while/else` (quirky but useful)

The `else` block runs **only if the loop completed without `break`**:

```python
for x in items:
    if x < 0:
        print("negative found")
        break
else:
    print("all non-negative")
```

Useful for "search for the exception; if you never find it…" patterns.

## 7.6 `enumerate` and `zip`

Two patterns you'll use daily.

```python
names = ["Ava", "Bea", "Cai"]
for i, name in enumerate(names, start=1):
    print(i, name)

prices = [1.99, 4.50, 0.75]
for name, price in zip(names, prices):
    print(name, price)
```

`zip` stops at the shortest iterable. Use `itertools.zip_longest` if you want it to run till the longest.

## 7.7 Comprehensions — loops as expressions

Build a list (or dict or set) concisely:

```python
squares = [n * n for n in range(10)]
evens = [n for n in range(20) if n % 2 == 0]
pairs = [(i, n) for i, n in enumerate(names)]

# Dict comprehension
sq = {n: n * n for n in range(5)}

# Set comprehension
unique_lower = {ch.lower() for ch in "Hello"}
```

Rule: if your comprehension has more than one `if` or any `else` branch, make it a loop. Readability beats cleverness.

## 7.8 Nested loops

```python
for row in range(1, 4):
    for col in range(1, 4):
        print(row * col, end="\t")
    print()
```

Watch for O(n²) — fine for small data, painful for big.

## 7.9 Iterators under the hood (preview)

Every `for` loop does roughly:

```python
it = iter(iterable)
while True:
    try:
        x = next(it)
    except StopIteration:
        break
    # body
```

You'll write your own iterators in Chapter 18.

## Vibe-Coding Corner

- **Internalize:** `for` with `enumerate`/`zip`, `range`, simple list comprehensions, `break`/`continue`.
- **Skim:** `while/else` arcana, nested comprehensions beyond two levels, `itertools`.
- **AI gets wrong:** builds a list by `for`+`.append(...)` when a comprehension would be cleaner; or cramps a 3-level nested comprehension when a loop would read better.
