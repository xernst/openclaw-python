"""
Chapter 1 — Getting Started.
Run me: `python3 01_lesson.py`
"""

# --- Basic printing ---
print("Hello from Python 3.")
print("You can print multiple things:", "like", "this.")

# --- Print evaluates expressions ---
print(2 + 2)
print("ha" * 3)
print(10 / 4, 10 // 4)   # true vs floor division

# --- print() keyword arguments ---
print("a", "b", "c", sep="-")            # a-b-c
print("no newline yet", end=" ")
print("<- same line as above")

# --- str() vs repr() ---
x = "42"
y = 42
print("str:", x, y)           # 42 42   — looks identical
print("repr:", repr(x), repr(y))  # '42' 42  — you can see the quotes

# --- Triple-quoted docstring in action (ignored at runtime) ---
"""
This string is evaluated and discarded.
You'll use triple quotes to document modules, functions, and classes.
"""

# --- Seeing errors ---
# Uncomment to watch a NameError:
# print(undefined_name)

# Uncomment to watch a SyntaxError (you'll need to re-comment to run the rest):
# print("oops)
