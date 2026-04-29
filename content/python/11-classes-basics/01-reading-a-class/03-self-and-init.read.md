---
xp: 2
estSeconds: 60
concept: self-parameter
code: |
  class Pet:
      def __init__(self, name, kind):
          self.name = name
          self.kind = kind

      def describe(self):
          return f"{self.name} is a {self.kind}"

  rex = Pet("rex", "dog")
  whiskers = Pet("whiskers", "cat")
  print(rex.describe())
  print(whiskers.describe())
---

# `self` is just the instance

The thing that confuses everyone the first time: every method in a class
takes `self` as its first argument, but you never pass it yourself.

When you write `rex.describe()`, Python silently calls `Pet.describe(rex)`.
The dot does the work. `self` inside the method is whichever instance you
called it on.

That's why two `Pet` instances can have different names without colliding:
`self.name` reads from *this* instance, not from the class. Each `Pet(...)`
gets its own `self`.

Run the editor. Two pets, two `describe()` calls, two different outputs.
The class definition doesn't change between calls — only `self` does.
