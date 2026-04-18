"""Chapter 6 — Control flow."""

score = 73
if score >= 90: grade = "A"
elif score >= 80: grade = "B"
elif score >= 70: grade = "C"
elif score >= 60: grade = "D"
else: grade = "F"
print(f"{score} -> {grade}")

# Chained compare
x = 25
print(f"0 <= {x} <= 100? {0 <= x <= 100}")

# Short-circuit fallback
name = ""
display = name or "anonymous"
print("display:", display)

# Truthy shorthand
items = []
print("have items" if items else "empty")

# Ternary
parity = "even" if score % 2 == 0 else "odd"
print(parity)

# match with OR patterns and guards
code = 404
match code:
    case 200: print("OK")
    case 201: print("Created")
    case 301 | 302: print("Redirect")
    case 404: print("Not Found")
    case c if 500 <= c <= 599: print("Server error")
    case c if 400 <= c <= 499: print("Client error")
    case _: print("Unknown")

# match destructures tuples
point = (0, 5)
match point:
    case (0, 0): print("origin")
    case (0, y): print(f"on y-axis at {y}")
    case (x, 0): print(f"on x-axis at {x}")
    case (x, y): print(f"at ({x},{y})")
