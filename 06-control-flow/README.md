# Chapter 6 — Control Flow

Programs make decisions. Control flow is how.

## 6.1 `if` / `elif` / `else`

```python
temp = 78
if temp >= 90:
    print("hot")
elif temp >= 70:
    print("nice")
else:
    print("cold")
```

**Indentation is syntax.** A `:` at the end of a line opens a block; the block is everything indented below by the same amount. Use 4 spaces (PEP 8). VS Code does it for you.

## 6.2 Comparison operators

| Op | Meaning |
|----|---------|
| `==` | value equal |
| `\!=` | not equal |
| `<`, `>`, `<=`, `>=` | numeric or lexical compare |
| `is`, `is not` | same object (identity) |
| `in`, `not in` | membership |

`==` checks value. `is` checks identity. You almost always want `==`. The exception: `x is None`.

Python allows **chained comparisons** — very Pythonic:

```python
0 <= x <= 100     # same as 0 <= x and x <= 100
a == b == c       # all three equal
```

## 6.3 Logical operators

```python
age >= 18 and income > 50_000
age < 13 or age > 65
not is_banned
```

**Short-circuit evaluation:** `and` stops at the first falsy value; `or` stops at the first truthy. This means you can write:

```python
name = user_input or "anonymous"     # fallback for empty string
items = items or []                  # default to empty list
```

## 6.4 Truthy-testing shorthand

```python
if name:           # same as `if name \!= ""`
    print(name)
```

Empty strings, empty lists, `0`, `None`, empty dicts — all falsy. Leaning on truthiness is idiomatic; don't write `if len(items) > 0:` — write `if items:`.

## 6.5 Ternary expression (one-line `if`)

```python
status = "adult" if age >= 18 else "minor"
```

Great for assignments. Bad for complex logic.

## 6.6 `match` / `case` — structural pattern matching (Python 3.10+)

```python
command = input("> ")
match command:
    case "quit" | "exit":
        print("bye")
    case "help":
        print("commands: quit, help, status")
    case _:
        print("unknown")
```

`case _:` is the catch-all. But `match` is way more than a switch — it can destructure:

```python
point = (3, 4)
match point:
    case (0, 0):
        print("origin")
    case (0, y):
        print(f"on y-axis at {y}")
    case (x, 0):
        print(f"on x-axis at {x}")
    case (x, y):
        print(f"at ({x},{y})")
```

And guard conditions with `if`:

```python
match code:
    case c if 500 <= c <= 599:
        print("server error")
    case c if 400 <= c <= 499:
        print("client error")
```

## 6.7 `pass` — do-nothing placeholder

When you need a block but not yet any code:

```python
def todo():
    pass   # fill in later
```

## Vibe-Coding Corner

- **Internalize:** `if`/`elif`/`else`, chained comparisons (`0 <= x <= 100`), short-circuit `and`/`or`, `match` basics.
- **Skim:** advanced `match` destructuring of dataclasses and nested patterns. (Useful later.)
- **AI gets wrong:** mixes `is` and `==` (especially `x is "string"` — NEVER do this); over-nests `if`s instead of early returns or `match`.
