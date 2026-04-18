# Chapter 17 — Inheritance & Dunders

## 17.1 Inheritance

A subclass gets everything from its parent and can override or extend:

```python
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self) -> str:
        return "..."

class Dog(Animal):
    def speak(self) -> str:
        return "woof"

class Cat(Animal):
    def speak(self) -> str:
        return "meow"

for a in [Dog("Rex"), Cat("Whiskers")]:
    print(a.name, a.speak())
```

## 17.2 `super()` — call the parent

```python
class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)         # runs Animal.__init__
        self.breed = breed
```

`super()` is the idiomatic way to call the parent's version of any method.

## 17.3 Don't inherit for code reuse alone

A common mistake: inherit to "share code." Prefer **composition**:

```python
# BAD-ish: Subclass just to share logging
class LoggingFoo(Foo): ...

# BETTER: compose
class Foo:
    def __init__(self, logger): self.log = logger
```

Rule: inherit when the subclass **IS-A** parent (Dog IS-A Animal). Don't inherit when one thing just **HAS-A** the other (User HAS-A Logger).

## 17.4 Abstract base classes (light touch)

```python
from abc import ABC, abstractmethod
class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r ** 2
```

Can't instantiate `Shape` directly — Python enforces that subclasses implement every `@abstractmethod`.

## 17.5 Multiple inheritance & MRO (know it exists)

Python allows multiple inheritance. The **MRO** (Method Resolution Order) defines lookup. In practice, use **mixins** sparingly and only for orthogonal concerns (like `LoggingMixin`). If you're reaching for "diamond inheritance," stop and compose.

```python
class A: ...
class B(A): ...
class C(A): ...
class D(B, C): ...
print(D.__mro__)   # linearization order
```

## 17.6 Dunder ("magic") methods — the cheat sheet

Dunders make your objects integrate with Python's built-in behaviors.

### Object representation

```python
__repr__   # developer-facing
__str__    # user-facing (print)
```

### Equality and hashing

```python
def __eq__(self, other):
    return isinstance(other, Point) and self.x == other.x and self.y == other.y

def __hash__(self):
    return hash((self.x, self.y))
```

If you define `__eq__`, you must also define `__hash__` (or set `__hash__ = None` to mark unhashable).

### Comparison

```python
def __lt__(self, other): return self.score < other.score
```

Decorate with `@functools.total_ordering` to get `<=, >, >=` for free when you implement `__eq__` and `__lt__`.

### Numeric ops

```python
def __add__(self, other): return Vec(self.x+other.x, self.y+other.y)
def __mul__(self, k): return Vec(self.x*k, self.y*k)
```

### Container protocol

```python
def __len__(self): return len(self.items)
def __getitem__(self, i): return self.items[i]
def __contains__(self, x): return x in self.items
def __iter__(self): return iter(self.items)
```

Implement `__len__` and `__iter__` and most of Python treats your object like a sequence.

### Context managers

```python
def __enter__(self): ...
def __exit__(self, exc_type, exc, tb): ...
```

Used by `with`. (We mostly use `contextlib.contextmanager` in ch 18.)

### Callable objects

```python
def __call__(self, *args): ...
```

Lets you write `obj(args)` as if it were a function.

## Vibe-Coding Corner

- **Internalize:** `super()`, `__init__` override pattern, `__repr__`, `__eq__`+`__hash__` (rarely needed — most data classes auto-generate), ABCs for "plugin" contracts.
- **Skim:** MRO mechanics, metaclasses, descriptors, `__slots__`.
- **AI gets wrong:** defines `__eq__` without `__hash__`; subclasses to share code (should compose); forgets `super().__init__(...)`.
