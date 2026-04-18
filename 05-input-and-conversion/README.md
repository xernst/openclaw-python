# Chapter 5 — Input & Type Conversion

Programs get interactive with two tools:

1. `input(prompt)` — reads a line the user types. **Always returns a `str`.**
2. Conversion functions — `int()`, `float()`, `bool()`, `str()`, `list()`, `tuple()` — turn one type into another.

## 5.1 Basic input

```python
name = input("What's your name? ")
print(f"Hi, {name}\!")
```

## 5.2 Converting a numeric input

`input()` always gives back a string — even `"42"`. To do math, cast:

```python
age_str = input("Age? ")
age = int(age_str)            # raises ValueError if not an integer string
print(f"Next year: {age + 1}")
```

Compact form (common):

```python
age = int(input("Age? "))
```

## 5.3 Conversion functions

| Call | Returns |
|------|---------|
| `int("42")` | `42` |
| `int("42.9")` | **ValueError** — `int()` only parses integer strings |
| `int(42.9)` | `42` (truncates toward zero, does NOT round) |
| `float("42.9")` | `42.9` |
| `float("1e3")` | `1000.0` |
| `str(3.14)` | `"3.14"` |
| `bool(0)` | `False` |
| `bool(0.0)` | `False` |
| `bool("")` | `False` |
| `bool("False")` | `True` — non-empty string is truthy |
| `bool([])` | `False` |
| `bool([0])` | `True` |
| `list("abc")` | `['a', 'b', 'c']` |
| `tuple("abc")` | `('a', 'b', 'c')` |

## 5.4 Falsy values

These all evaluate to `False` in a boolean context:

```
False, None, 0, 0.0, "", [], {}, (), set()
```

Everything else is **truthy**.

Common idiom: "do this if the user gave me something":

```python
name = input("Name: ")
if name:          # empty string is falsy
    print(f"hi {name}")
else:
    print("anonymous")
```

## 5.5 Don't trust `bool("False")`

`bool("False")` is `True`. The string isn't empty. To parse a textual boolean, write it yourself:

```python
def parse_bool(s: str) -> bool:
    return s.strip().lower() in {"true", "yes", "y", "1"}
```

## 5.6 Multiple inputs on one line

```python
a, b = input("Two numbers: ").split()
a, b = int(a), int(b)
```

Or:

```python
a, b = map(int, input("Two numbers: ").split())
```

`map(int, ...)` applies `int` to each piece — clean for a row of numbers.

## 5.7 Safe input pattern (preview)

For now we assume valid input. In Chapter 15 you'll learn to catch `ValueError` with `try`/`except`:

```python
try:
    age = int(input("Age? "))
except ValueError:
    print("Please type a whole number.")
```

## Vibe-Coding Corner

- **Internalize:** `input()` returns `str`, all truthiness rules, `int()` vs `float()` vs `bool()`, the falsy list.
- **Skim:** locale-aware parsing, `eval(input())` — NEVER use; it runs whatever the user types.
- **AI gets wrong:** forgets to cast `input()` to a number; passes user input straight to `eval()` (security hole); uses `bool("False")` and expects False.
