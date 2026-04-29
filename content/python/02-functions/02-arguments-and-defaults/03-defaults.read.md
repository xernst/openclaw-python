---
xp: 1
estSeconds: 45
concept: default-arguments
code: |
  def greet(name, greeting="hi"):
      return f"{greeting}, {name}"

  print(greet("alex"))
  print(greet("alex", "yo"))
  print(greet("alex", greeting="howdy"))
---

# Default values let callers skip arguments

A parameter with a default — `greeting="hi"` — is optional. If the caller
doesn't pass it, Python uses the default. If they do, theirs wins.

This is how AI almost always writes config-style functions:

- `greet("alex")` — no second argument, uses `"hi"`
- `greet("alex", "yo")` — passes `"yo"` positionally, overrides the default
- `greet("alex", greeting="howdy")` — same thing, but named for clarity

Run it. Three calls, three different outputs, one function definition.

The rule that bites people: **defaulted parameters must come after
non-defaulted ones**. `def greet(greeting="hi", name)` is a syntax error.
Python needs to know what's optional before it sees what's required.
