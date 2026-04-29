---
xp: 1
estSeconds: 95
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

When AI generates code for anything that has *attributes that travel
together* — `User`, `Order`, `ChatSession`, `Embedding`, `Agent`,
`PromptTemplate`, `APIResponse` — what it's giving you is a **class**.

A class is a small template that bundles a chunk of data with the
functions that operate on that data. Once you have a class, you can
create as many copies as you need (each one with its own data) and call
the same functions on every copy.

You will rarely write classes from scratch in your day job, especially
early on. But you will read them in *every* real Python codebase: ORM
models in `Django` or `SQLAlchemy`, API schemas in `pydantic`, custom
exceptions, agent state in `LangChain`, and the response objects from
nearly every SDK (`openai`, `anthropic`, `requests`).

If you can't read a class definition, you can't read most of the
production Python that AI is going to write you.

## The mental model: a class is a cookie cutter

The class definition is the cutter. Each instance is a cookie. The
cutter shapes every cookie the same way, but each cookie is a separate
piece of data.

```python
class User:           # the cutter — the template
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"hi, {self.name}"

u1 = User("maya")     # cookie 1 — its own name
u2 = User("marcus")   # cookie 2 — its own name
```

After those two lines run, you have *two completely separate* `User`
objects in memory. They share the same template (both have a `.name`
and a `.greet()`), but the actual data on each one is independent.

## The three pieces to recognize

When you see a class in AI code, scan for these three shapes:

1. **`class Name:`** — declares the template. By convention, class names
   are `CapitalCamelCase` (`User`, not `user`).
2. **`def __init__(self, ...)`** — the *constructor*. Runs once
   automatically every time you write `User(...)`. Its job is to set up
   the per-instance data on `self`.
3. **`self.something = ...`** — assigns an attribute on this specific
   instance. Anywhere later, you can read it back via
   `instance.something`.

There's a fourth piece — *methods*, which are functions defined inside
the class — but for now, just notice they all start with `self` as their
first parameter.

## A worked example

The editor on the right has the canonical four-line class:

```python
class User:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"hi, {self.name}"

u = User("maya")
print(u.greet())
```

Trace what happens when Python runs this:

1. **`class User:`** registers the template. Nothing else happens yet.
   No instance has been created.
2. **`u = User("maya")`** creates a new, empty instance, then calls
   `__init__(self, "maya")` on it. Inside `__init__`, `self.name =
   name` stores `"maya"` on the new instance. Then Python returns the
   instance and binds it to `u`.
3. **`u.greet()`** calls the `greet` method *with `u` as `self`*. Inside
   the method, `self.name` reads `"maya"` off the instance. The method
   returns `"hi, maya"`. The `print` displays it.

Output:

```
hi, maya
```

Imagine a second line: `u2 = User("marcus")`. Now there are two
instances. `u.greet()` returns `"hi, maya"`. `u2.greet()` returns
`"hi, marcus"`. Same template, different per-instance data — that's the
whole point of classes.

## Where AI specifically gets this wrong

Three patterns to flag in code Cursor writes:

1. **Using a class when a dict would do.** AI sometimes wraps three
   fields and no behavior in a class. If there are no methods and the
   data is just key/value pairs, a `dict` or a `dataclass` is usually
   simpler. Watch for empty classes that exist only to hold data.

2. **Forgetting `self` on a method.** Cursor occasionally writes
   `def greet():` inside a class, then calls `instance.greet()` and gets
   a confusing `TypeError: greet() takes 0 positional arguments but 1
   was given`. The fix is `def greet(self):` — the next read explains
   why.

3. **Mutating shared state.** AI sometimes writes a class attribute (a
   value defined at class level, outside `__init__`) that's a list or
   dict. Every instance ends up sharing the same one, and changes leak
   across instances. We cover this trap two chapters from now — for
   now, just note that *real* per-instance data lives on `self`.

Run the editor. `User("maya")` calls `__init__`, which stashes the name
on the new instance. `u.greet()` reads it back.
