"""Chapter 2 — Variables & Types."""

# The five scalars
name = "Ava"            # str
age = 24                # int
rating = 4.8            # float
is_active = True        # bool
nickname = None         # NoneType

print(name, age, rating, is_active, nickname)
print(type(name), type(age), type(rating), type(is_active), type(nickname))

# isinstance respects inheritance
print(isinstance(True, int))  # True — bool IS-A int

# Reassignment
age = age + 1
print("next birthday:", age)

# Multiple assignment
x, y, z = 1, 2, 3
print(x, y, z)

# Swap without a temp
x, y = y, x
print("swapped:", x, y)

# Unpacking with *
first, *rest = [10, 20, 30, 40]
print(first, rest)

# Underscores in literals for readability
population = 8_100_000_000
print(population * 2)

# Constants by convention
MAX_RETRIES = 3
API_BASE_URL = "https://api.example.com"
print(MAX_RETRIES, API_BASE_URL)

# is None is the idiom
decision = None
if decision is None:
    print("not decided yet")
