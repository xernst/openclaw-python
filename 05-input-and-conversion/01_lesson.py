"""
Chapter 5 — Input & Type Conversion.
Run from a terminal (not the VS Code Debug Console) so input() works cleanly.
"""

# String input
name = input("Your name? ")
print(f"Hello, {name}\!")

# Numeric input, cast to int
age = int(input("Age (whole number)? "))
print(f"In 10 years: {age + 10}")

# Numeric input, cast to float
height_m = float(input("Height in meters? "))
print(f"That's {height_m * 100:.1f} cm.")

# Explicit casts
print(int("42"))
print(float("3.14"))
print(str(99))
print(bool(""), bool("x"), bool(0), bool(1))
print(bool("False"))   # True — surprising
print(list("abc"))
print(tuple(range(4)))

# Two numbers on one line
a, b = map(int, input("Enter two integers separated by a space: ").split())
print("sum:", a + b)
