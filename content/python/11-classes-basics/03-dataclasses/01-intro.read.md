---
xp: 1
estSeconds: 110
concept: dataclass-introduction
code: |
  from dataclasses import dataclass

  @dataclass
  class User:
      name: str
      age: int
      role: str = "viewer"

  u = User("maya", 29)
  print(u)
  print(u.name, u.age, u.role)
  print(u == User("maya", 29))
runnable: true
---

# `@dataclass` — when AI doesn't want to write `__init__` by hand

Spend ten minutes reading any modern Python codebase — FastAPI, an
LLM agent, a data pipeline, anything written after 2018 — and you'll
see this shape over and over:

```python
@dataclass
class User:
    name: str
    age: int
    role: str = "viewer"
```

That's a *dataclass*. Five lines that replace what used to be
fifteen. Cursor reaches for it on every "make a class to hold these
fields" task because it removes a lot of boilerplate that everybody
agreed was annoying. Reading AI code, you'll see this decorator on
maybe a third of the classes in any given file.

The job of this lesson: read a `@dataclass`, know exactly what it
generates for you, and spot the two ways AI still gets it wrong.

## What `@dataclass` actually does

A decorator is a function that wraps another thing and returns a
modified version. `@dataclass` is a function from the standard
library that, applied to a class, *generates three methods for you
automatically*:

1. `__init__` — the constructor. Takes one parameter per field, in
   declaration order, and assigns them to `self`. So `User("maya",
   29)` works without you writing `def __init__(self, name, age):`.
2. `__repr__` — what gets printed when you `print(user)`. Without
   the decorator you'd see `<User object at 0x10ab...>`. With it,
   you see `User(name='maya', age=29, role='viewer')`. That's a
   massive debugging quality-of-life win.
3. `__eq__` — what `==` does between two instances. Without it, two
   `User`s with the same fields are not equal because they're
   different objects. With it, equal *values* mean equal *users*.

Five lines of decorator-and-fields gets you all three. The same
class without `@dataclass` would be:

```python
class User:
    def __init__(self, name, age, role="viewer"):
        self.name = name
        self.age = age
        self.role = role

    def __repr__(self):
        return f"User(name={self.name!r}, age={self.age!r}, role={self.role!r})"

    def __eq__(self, other):
        if not isinstance(other, User):
            return NotImplemented
        return (self.name, self.age, self.role) == (other.name, other.age, other.role)
```

Fifteen lines, plus you've already had to remember `isinstance` and
`NotImplemented` and `!r`. The decorator wins.

## The mental model

A dataclass is *a class that exists to hold fields*. The fields are
declared at the top of the class body using **type annotations**:

```python
class User:
    name: str
    age: int
    role: str = "viewer"
```

`name: str` says "there's a field called `name`, expected type
`str`." Python doesn't *enforce* the type at runtime — you can pass
a number into `name` and Python won't complain. The annotation is
documentation that tools (type checkers, editors, the dataclass
machinery itself) read.

A field with `=` after it has a default. Same rule as functions:
defaulted fields come *after* required ones. `name` and `age` are
required; `role` is optional and falls back to `"viewer"`.

## A worked example

The editor on the right has the canonical dataclass:

```python
from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int
    role: str = "viewer"

u = User("maya", 29)
print(u)
print(u.name, u.age, u.role)
print(u == User("maya", 29))
```

Output:

```
User(name='maya', age=29, role='viewer')
maya 29 viewer
True
```

Three things you got for free: a constructor that took two
arguments and filled in the third from the default, a printable
representation that names every field, and equality based on field
values rather than object identity.

## Where AI specifically gets this wrong

Two patterns to flag in code Cursor writes you.

**One: writing `__init__` by hand when a dataclass would do.** If
you read a class whose `__init__` does nothing but `self.x = x` for
each parameter, that class should be a dataclass. AI sometimes
forgets the decorator exists and writes the long-hand version
because that's what most pre-2018 examples look like online.

**Two: putting mutable defaults directly on dataclass fields.**
`@dataclass` is *strict* about this and refuses to let you write
`items: list = []`. We'll cover the right shape (`field(default_factory=list)`)
in the next read step. AI has been known to write the broken shape
and then add a comment that says "TODO: figure out why this errors."
It's a fixable error, not a mystery.

Run the editor. Three lines of free behavior — `print`, `==`,
field access — all from a five-line declaration.
