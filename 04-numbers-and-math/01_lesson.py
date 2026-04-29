"""Chapter 4 — Numbers & Math."""
import math

print(7 / 2)        # 3.5
print(7 // 2)       # 3
print(-7 // 2)      # -4  (floor, not truncate)
print(7 % 2)        # 1
print(2 ** 10)      # 1024
print(2 ** 0.5)     # sqrt(2) ~= 1.414

# Order of operations
print(2 + 3 * 4)       # 14
print((2 + 3) * 4)     # 20
print(2 ** 3 ** 2)     # 512  right-associative

# Underscores
print(1_000_000 * 2)

# Augmented
n = 10
n += 5
n *= 2
print("n:", n)

# math module
print("sqrt(2):", math.sqrt(2))
print("pi:", math.pi, "tau:", math.tau)
print("floor/ceil/trunc:", math.floor(-2.7), math.ceil(-2.7), math.trunc(-2.7))
print("log10(1000):", math.log10(1000))
print("gcd(12,18):", math.gcd(12, 18))

# round uses banker's rounding
print("round(2.5):", round(2.5))   # 2, not 3
print("round(3.5):", round(3.5))   # 4

# Float imprecision
print(0.1 + 0.2)
print(math.isclose(0.1 + 0.2, 0.3))   # True

# Decimal for money
from decimal import Decimal
print(Decimal("0.1") + Decimal("0.2"))  # 0.3 exactly
