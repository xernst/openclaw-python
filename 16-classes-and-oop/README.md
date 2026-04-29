# Chapter 16 — Classes & OOP

A **class** is a blueprint for creating objects. An **object** is a specific instance with its own data. Classes let you bundle data + behavior that belong together.

You won't write classes in *every* script. But for domain objects — a `Participant`, a `Posting`, a `Note`, a `Pet` — classes pay off. Chapter 19 (dataclasses) is often an even better fit.

## 16.1 The basics

```python
class Dog:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

    def bark(self) -> str:
        return f"{self.name} says woof\!"

k = Dog("Rex", 4)
print(k.name, k.age)
print(k.bark())
```

- `__init__` is the **constructor** — it runs when you create an instance.
- `self` is the instance; it's passed automatically when you call `instance.method(...)`.
- `k.name` is an **instance attribute** — each instance has its own.

## 16.2 Instance vs class attributes

```python
class Dog:
    species = "Canis familiaris"     # class attribute (shared)

    def __init__(self, name):
        self.name = name              # instance attribute (per-instance)

print(Dog.species)                     # 'Canis familiaris'
a = Dog("Rex"); b = Dog("Duke")
print(a.species, b.species)            # same value
```

**Trap:** don't use mutable class attributes — they're shared\!

```python
class Bad:
    items = []                         # WRONG — shared across instances
    def add(self, x): self.items.append(x)

a = Bad(); b = Bad()
a.add("x"); print(b.items)             # ['x'] — surprise
```

Fix: initialize in `__init__`:

```python
def __init__(self):
    self.items = []
```

## 16.3 Methods, class methods, static methods

```python
class Participant:
    count = 0

    def __init__(self, name):
        self.name = name
        Participant.count += 1

    def greet(self) -> str:             # instance method
        return f"Hi {self.name}"

    @classmethod
    def total(cls) -> int:              # class method — receives the class
        return cls.count

    @staticmethod
    def normalize(name: str) -> str:    # static method — no self/cls
        return name.strip().title()
```

Use `@classmethod` for alternative constructors (`from_dict`, `from_row`) and `@staticmethod` for utilities that logically belong to the class but don't need state.

## 16.4 Properties — controlled attribute access

```python
class Account:
    def __init__(self, balance=0):
        self._balance = balance        # leading underscore = "private by convention"

    @property
    def balance(self) -> int:
        return self._balance

    @balance.setter
    def balance(self, value: int) -> None:
        if value < 0:
            raise ValueError("balance can't be negative")
        self._balance = value

a = Account()
a.balance = 100     # calls the setter
# a.balance = -1    # raises
```

`@property` lets a method masquerade as an attribute — great for validation and computed values.

## 16.5 `__str__` and `__repr__`

Two special methods control how your object shows up:

```python
class Pet:
    def __init__(self, name, species):
        self.name = name; self.species = species
    def __repr__(self):   # developer-facing
        return f"Pet(name={self.name\!r}, species={self.species\!r})"
    def __str__(self):    # user-facing
        return f"{self.name} the {self.species}"

p = Pet("Rex","dog")
print(p)         # Rex the dog    (__str__)
print(repr(p))   # Pet(name='Rex', species='dog')   (__repr__)
```

Always define `__repr__`. It's what appears in debuggers, REPLs, and error messages.

## 16.6 "Private" by convention

Python has no true private attributes. Conventions:
- `_name` — "internal, don't touch from outside."
- `__name` — **name mangling** (rewritten to `_ClassName__name`). Rarely necessary.

## 16.7 When to use a class vs a dict vs a dataclass

| Shape | Best fit |
|-------|----------|
| Simple bag of fields | `@dataclass` (ch 19) |
| Data + custom methods | class |
| Short-lived config | `dict` |
| Strict typed data with validation | `pydantic.BaseModel` (later) |

Rule: start with a `dict`. Promote to `@dataclass` when you need types. Promote to a full class when you need methods and invariants.

## Vibe-Coding Corner

- **Internalize:** `__init__`, `self`, instance vs class attribute (mutable trap), `@classmethod`, `@staticmethod`, `@property`, `__repr__`.
- **Skim:** `__slots__`, metaclasses, descriptors.
- **AI gets wrong:** uses a mutable class attribute as default state; forgets `__repr__`; uses `__private` mangling when a single leading `_` would do.
