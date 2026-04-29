"""Chapter 3 — Strings."""

name = "Ava"
city = "Portland"

# f-string basics
print(f"{name} lives in {city}.")
print(f"{name.upper()} in {city.lower()}\!")

# Numeric formatting
price = 19.954
print(f"Price: ${price:.2f}")            # 2 decimals
print(f"Big:   {1234567:,}")             # thousands sep
print(f"Pct:   {0.873:.1%}")             # 87.3%
print(f"Pad:   '{42:05d}'")              # '00042'
print(f"Align: '{name:>10}|{name:<10}|{name:^10}'")

# Debug form
x = 42
print(f"{x = }")   # x = 42

# Methods return NEW strings (strings are immutable)
greeting = "   Hello\!   "
print(repr(greeting.strip()))
print(repr(greeting))      # unchanged

# Slicing
phrase = "learn python well"
print(phrase[:5])          # 'learn'
print(phrase[-4:])          # 'well'
print(phrase[::-1])         # reversed
print(phrase[::2])          # every other char

# Containment
print("py" in phrase)

# split / join
csv = "red,green,blue"
parts = csv.split(",")
print(parts)
print(" | ".join(parts))

# Raw strings
print(r"C:\Users\Ava")

# Escape sequences
print("tab:\tnewline:\nend")
