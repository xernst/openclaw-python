## Reading what AI just wrote you

You ask Cursor to add an authentication endpoint to your FastAPI app. Cursor writes 60 lines of Python that includes a class definition. SQLAlchemy ORM model, Pydantic schema, FastAPI dependency, custom exception class — modern AI-generated code is full of classes, even when you didn't ask for one.

You don't need to design classes from scratch. You don't need to learn inheritance hierarchies, abstract base classes, or metaclasses. You need to *read* one without flinching and tell whether it's correct. That's this chapter.

## The mental model: a class is a custom type

Every value in Python has a type — `int`, `str`, `list`, `dict`. A class lets you define your *own* type. *I have a User. A User has a name, an email, and a method to format itself for display.* That's a class.

```python
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

    def display(self):
        return f"{self.name} <{self.email}>"
```

Three things to read here:

- `__init__` — the constructor. Runs when you do `User("alice", "a@x.com")`. The `self` parameter is automatic; you don't pass it.
- `self.name = name` — stores the argument as an *attribute* of the instance. Each User has its own `name`.
- `def display(self):` — a *method*. A function attached to the class. You call it as `user.display()`, not `User.display(user)` (Python passes `user` as `self` automatically).

That's enough to read 90% of the classes Cursor will ship into your project. The fancy stuff — inheritance, properties, dunders, descriptors — is a chapter or two further on. This chapter holds the line at *reading* not *designing*.

## What this chapter covers in three lessons

**Lesson 1: Reading a class.** Pulling apart a real Cursor-generated class line by line: which lines define attributes, which lines define methods, what `__init__` does, what `self` means. Includes a SQLAlchemy-style model and a Pydantic-style schema as examples.

**Lesson 2: Instance versus class attributes.** A subtle but high-impact distinction: `class Counter: count = 0` (one shared `count` across all instances — a class attribute) versus `class Counter: def __init__(self): self.count = 0` (each instance has its own — an instance attribute). AI mixes these up. Lesson covers the bug pattern and the fix.

**Lesson 3: Dataclasses.** Modern Python's "I just want a struct" answer. `@dataclass` generates `__init__`, `__repr__`, `__eq__` for you. AI ships dataclasses constantly because they're concise. Reading them well is the high-leverage Python skill of 2026.

## What AI specifically gets wrong about classes

Three patterns:

1. **Mutable class attributes.** `class Cart: items = []` is a single list shared across every Cart instance. Add an item to one cart, every cart has it. AI ships this constantly because the syntax is shorter than the right version (`def __init__(self): self.items = []`). Lesson 2 fixes it.

2. **Forgetting `self`.** When AI writes a method, the signature should be `def foo(self, x):`. Cursor sometimes writes `def foo(x):` and the class breaks. Lesson 1 covers spotting it.

3. **Subclassing for code reuse instead of composition.** AI sometimes builds inheritance chains where the right answer is just calling a function. Reading inheritance correctly is harder than reading a function call. We touch on when to suspect inheritance is the wrong tool.

## What you'll be able to do at the end

Three lessons, ~27 steps. By the end you'll be able to:

- Read any class definition and tell what it does, what its instances look like, and whether it has bugs.
- Distinguish instance attributes from class attributes (and avoid the mutable-class-attr trap).
- Read a `@dataclass` fluently — they're 30% of modern Python.
- Spot the three top "AI shipped this wrong" class patterns.

This chapter doesn't make you a class designer. It makes you a class reader, which is what 95% of the daily AI-builder work needs. Chapter 14 (structured output) uses Pydantic's `BaseModel`, which is structurally a class. Chapter 22 (capstone) reads a few lightweight class definitions. Get this chapter solid and the rest of the curriculum's class-shaped code reads obvious.

Press *Start chapter* below.
