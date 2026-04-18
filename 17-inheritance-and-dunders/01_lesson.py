"""Chapter 17 — Inheritance + dunders."""
from functools import total_ordering
from abc import ABC, abstractmethod

class Animal:
    def __init__(self, name): self.name = name
    def speak(self) -> str: return "..."

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed
    def speak(self): return "woof"

class Cat(Animal):
    def speak(self): return "meow"

for a in [Dog("Rex","mutt"), Cat("Whiskers")]:
    print(a.name, a.speak())

# ABC
class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r**2

print(Circle(3).area())
# Shape()   # TypeError — abstract

# dunders for a value type
@total_ordering
class Score:
    def __init__(self, v): self.v = v
    def __repr__(self): return f"Score({self.v})"
    def __eq__(self, other): return isinstance(other, Score) and self.v == other.v
    def __hash__(self): return hash(self.v)
    def __lt__(self, other): return self.v < other.v

s1, s2, s3 = Score(80), Score(80), Score(95)
print(s1 == s2, s1 < s3, sorted([s3, s1, s2]))
print(hash(s1) == hash(s2))

# container-like object
class Bag:
    def __init__(self): self.items = []
    def add(self, x): self.items.append(x)
    def __len__(self): return len(self.items)
    def __iter__(self): return iter(self.items)
    def __contains__(self, x): return x in self.items

b = Bag(); b.add("apple"); b.add("banana")
print(len(b), "apple" in b, list(b))
