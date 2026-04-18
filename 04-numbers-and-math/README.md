# Chapter 4 — Numbers & Math

## 4.1 Two numeric types you'll use constantly

- `int` — whole numbers, unlimited size. `5`, `-100`, `10_000_000`.
- `float` — decimals. IEEE-754 double precision. `3.14`, `-0.001`, `2.0`.

(There's also `complex` with `j` — rarely needed.)

Underscores are legal in numeric literals and purely for readability:

```python
population = 8_100_000_000   # same as 8100000000
```

## 4.2 Arithmetic operators

| Op | Meaning | Example | Result |
|----|---------|---------|--------|
| `+` | add | `3 + 2` | 5 |
| `-` | subtract | `3 - 2` | 1 |
| `*` | multiply | `3 * 2` | 6 |
| `/` | **true** division (always float) | `7 / 2` | 3.5 |
| `//` | **floor** division | `7 // 2` | 3 |
| `%` | modulus (remainder) | `7 % 2` | 1 |
| `**` | exponent | `2 ** 10` | 1024 |

Note:
- `/` always returns `float`, even if exact (`10 / 2 == 5.0`).
- `//` rounds **toward negative infinity**: `-7 // 2 == -4`, not `-3`.
- `%` follows the same rule so `a == (a // b) * b + (a % b)` always holds.

## 4.3 Order of operations (PEMDAS)

```python
2 + 3 * 4      # 14
(2 + 3) * 4    # 20
2 ** 3 ** 2    # 512  (right-associative: 2 ** (3 ** 2))
```

When in doubt, add parens. Parens are free, readability isn't.

## 4.4 Augmented assignment

Update-in-place shortcuts:

```python
n = 10
n += 5    # n = n + 5
n -= 2
n *= 3
n //= 2
n **= 2
```

## 4.5 The `math` module

Python's standard library has `math` for the rest:

```python
import math
math.sqrt(16)           # 4.0
math.pi                  # 3.141592653589793
math.tau                 # 2*pi
math.e
math.floor(2.9)          # 2
math.ceil(2.1)           # 3
math.trunc(-2.7)         # -2  (chops toward 0, differs from floor on negatives)
math.log(100, 10)        # 2.0
math.log2(1024)          # 10.0
math.exp(1)              # e
math.inf; -math.inf; math.nan
math.isnan(math.nan)     # True
math.gcd(12, 18)         # 6
```

For rounding, Python's built-in `round()` uses **banker's rounding** (half-to-even):

```python
round(2.5)    # 2  (not 3\!)
round(3.5)    # 4
round(1.245, 2)   # may not be 1.25 due to float repr
```

Use `math.floor/ceil` when you need deterministic direction.

## 4.6 Float imprecision — the trap everyone hits

```python
0.1 + 0.2    # 0.30000000000000004
```

That's not a Python bug — it's IEEE-754 binary floating point. `0.1` can't be represented exactly in binary, same as `1/3` can't be written exactly in decimal.

**Rule of thumb:** never use `==` to compare floats. Use:

```python
math.isclose(a, b, rel_tol=1e-9, abs_tol=0.0)
```

## 4.7 `Decimal` for money

When exact decimal math matters (money, invoices, percentages), use `decimal`:

```python
from decimal import Decimal
Decimal("0.1") + Decimal("0.2")    # Decimal('0.3')
```

Pass **strings** to `Decimal`, not floats — `Decimal(0.1)` captures the binary float's inaccuracy.

## 4.8 `Fraction` when you need rationals

```python
from fractions import Fraction
Fraction(1, 3) + Fraction(1, 6)    # Fraction(1, 2)
```

Rarely needed, but exists.

## Vibe-Coding Corner

- **Internalize:** `/` vs `//` vs `%`, `**`, augmented assignment, the `math` module, float imprecision.
- **Skim:** `Fraction`, `complex`, `decimal` contexts/precision tuning.
- **AI gets wrong:** uses `round(x, 2)` for money (use `Decimal`); uses `==` on floats; forgets `//` returns int, `/` returns float.
