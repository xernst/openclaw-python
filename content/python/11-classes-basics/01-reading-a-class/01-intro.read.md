---
xp: 1
estSeconds: 35
concept: class-introduction
code: |
  class User:
      def __init__(self, name):
          self.name = name

      def greet(self):
          return f"hi, {self.name}"

  u = User("maya")
  print(u.greet())
runnable: true
---

# A class is a template

When AI generates `User`, `Order`, `ChatSession`, `Embedding`, what it's
giving you is a **class** — a small template that bundles some data with
the functions that operate on that data.

You'll rarely write classes from scratch. But you'll read them in every
real codebase: ORM models, API schemas, agent state, custom errors.

The three pieces you need to recognize:

- `class Name:` — declares the template.
- `def __init__(self, ...)` — runs once per new instance, sets up data.
- `self.something` — the per-instance data; the `self` is the instance itself.

Run the editor. `User("maya")` calls `__init__`, which stashes the name on
the new instance. `u.greet()` reads it back.
