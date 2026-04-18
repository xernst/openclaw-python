# Chapter 2 — Variables & Types

A **variable** is a *name that points at a value*. Python figures out the value's type.

```python
name = "Ava"         # str
age = 24             # int
height_m = 1.68      # float
is_student = True    # bool
nickname = None      # NoneType
```

## 2.1 Naming rules

- Letters, digits, underscores only. No spaces. Can't *start* with a digit.
- `snake_case` for variables and functions — per **PEP 8**.
- Names describe *what the value is*, not how it's stored. `user_count` > `x`.
- Don't shadow built-ins: `list`, `dict`, `type`, `id`, `sum`, `min`, `max`, `input`, `str`, `int` — avoid using those as variable names.

## 2.2 Reassignment

A variable can be pointed at something new. Python doesn't care about type changes:

```python
x = 10
x = "now I'm a string"
```

Technically legal. But in real code, don't flip types on the same name — it hurts readability. Chapter 19 (type hints) will help you keep a variable's type stable.

## 2.3 The five scalar types you'll live with

| Type | Example | Notes |
|------|---------|-------|
| `int` | `42`, `-7`, `10_000_000` | Unlimited size. Underscores allowed for readability. |
| `float` | `3.14`, `-0.001`, `2.0` | IEEE-754 double. Watch out for imprecision. |
| `str` | `"hello"`, `'hi'`, `"""..."""` | Immutable; chapter 3 is dedicated. |
| `bool` | `True`, `False` | Subtype of `int`. `True + True == 2`. |
| `NoneType` | `None` | Literally one value, used for "no value yet." |

## 2.4 Checking a type

```python
type(5)        # <class 'int'>
type(5.0)      # <class 'float'>
type("5")      # <class 'str'>
type(True)     # <class 'bool'>
type(None)     # <class 'NoneType'>

isinstance(5, int)          # True
isinstance(True, int)       # True — yes, bool is-a int
```

Prefer `isinstance(x, T)` over `type(x) == T` because `isinstance` respects inheritance.

## 2.5 Booleans are sneaky integers

Because `bool` inherits from `int`:

```python
True + True        # 2
False * 99         # 0
sum([True, True])  # 2
```

Fine for counting true values in a list. Don't rely on it for anything exotic.

## 2.6 `None` — the intentional nothing

`None` is different from `0`, `""`, or `False`. It means "no value assigned yet" or "deliberately nothing."

```python
winner = None
if winner is None:       # prefer `is None` to `== None`
    print("not decided")
```

Why `is None`? Because `None` is a singleton (there's only ever one `None` object in memory). `is` compares object identity, which is faster and the intended idiom. The linter will yell at you if you write `== None`.

## 2.7 Constants — by convention

Python has no real constants, but UPPER_SNAKE_CASE is the agreed-upon signal:

```python
MAX_RETRIES = 3
PI = 3.14159
API_BASE_URL = "https://api.example.com"
```

## 2.8 Multiple & unpacking assignment

```python
a, b, c = 1, 2, 3            # unpack
x, y = y, x                  # swap in one line — no temp variable
first, *rest = [10, 20, 30, 40]  # first=10, rest=[20,30,40]
```

`*rest` collects extras into a list. Chapters 8 and 12 dig deeper.

## 2.9 Objects, references, and identity (short version)

Under the hood every value is an **object** with an id, a type, and a value. Variables are names bound to objects.

```python
a = [1, 2, 3]
b = a              # b points at the SAME list
b.append(4)
print(a)           # [1, 2, 3, 4]  — surprise

c = a.copy()       # c points at a NEW list
```

You'll meet this gotcha again in Chapter 8 (Lists). File it away.

## Vibe-Coding Corner

- **Internalize:** snake_case naming, `None` vs `False` vs `0`, `is None` idiom, the five scalar types, `isinstance` vs `type()`.
- **Skim:** memory internals, the `id()` function, `sys.getrefcount`.
- **AI gets wrong:** sometimes names things `list`, `dict`, `type` (shadowing built-ins); sometimes uses `== None` instead of `is None`; occasionally mixes `int` and `str` through accidental reassignment.
