---
xp: 2
estSeconds: 130
concept: default-factory-and-frozen
code: |
  from dataclasses import dataclass, field

  @dataclass
  class Cart:
      owner: str
      items: list = field(default_factory=list)

  alex = Cart("alex")
  sam = Cart("sam")
  alex.items.append("apple")
  sam.items.append("bread")

  print(alex)
  print(sam)

  @dataclass(frozen=True)
  class Coord:
      x: int
      y: int

  origin = Coord(0, 0)
  print(origin)
  try:
      origin.x = 5
  except Exception as err:
      print(f"blocked: {type(err).__name__}")
---

# `default_factory` and `frozen=True` — the two flags AI uses constantly

The intro covered the basic dataclass. Two more shapes you'll see in
real AI code, both of which solve real problems.

## `default_factory` — the right way to default to an empty list

Try this:

```python
@dataclass
class Cart:
    items: list = []
```

Python raises a `ValueError` at class-definition time:

```
ValueError: mutable default <class 'list'> for field items is not allowed
```

This is the "shared mutable" footgun from the previous lesson.
Dataclasses refuse to let you make that mistake — if every `Cart()`
shared the same `items` list, you'd hate your life.

The fix is `field(default_factory=...)`. You import `field` from the
same module and pass a *callable* that gets called to produce a
fresh default each time:

```python
from dataclasses import dataclass, field

@dataclass
class Cart:
    owner: str
    items: list = field(default_factory=list)
```

`list` (the type itself, no parens) is callable — calling it
returns a new empty list. Every `Cart()` call produces its own.
This is the shape AI ships when it remembers — and you'll see it
constantly in any class that holds a list, dict, or set.

For a non-empty default, pass a lambda:

```python
items: list = field(default_factory=lambda: ["welcome"])
```

For a dict:

```python
config: dict = field(default_factory=dict)
```

Anywhere you'd reach for `[]`, `{}`, or `set()` as a dataclass
default, the right shape is `field(default_factory=...)`.

## `frozen=True` — make the dataclass immutable

By default, dataclass fields are mutable — `user.age = 30`
reassigns the attribute and Python is fine with it. Sometimes you
want the opposite: a value object that, once constructed, can never
change. `frozen=True` does that:

```python
@dataclass(frozen=True)
class Coord:
    x: int
    y: int

origin = Coord(0, 0)
origin.x = 5    # raises FrozenInstanceError
```

Two things this buys you. **Bug prevention** — code that should
never be modifying these objects can't, by accident. **Hashability**
— frozen dataclasses are hashable, which means you can use them as
dict keys or put them in sets. Mutable dataclasses can't.

When AI writes a dataclass for "a value that represents a point in
time / a coordinate / an identifier / a config snapshot", reach for
`frozen=True`. When the class is genuinely a workspace that gets
mutated (a cart, a buffer, a queue), leave it mutable.

## A worked example

The editor on the right has both flags in action:

```python
from dataclasses import dataclass, field

@dataclass
class Cart:
    owner: str
    items: list = field(default_factory=list)

alex = Cart("alex")
sam = Cart("sam")
alex.items.append("apple")
sam.items.append("bread")

print(alex)   # Cart(owner='alex', items=['apple'])
print(sam)    # Cart(owner='sam', items=['bread'])
```

Each cart gets its own list. The `default_factory=list` runs *per
instance*, generating a fresh empty list each time.

```python
@dataclass(frozen=True)
class Coord:
    x: int
    y: int

origin = Coord(0, 0)
origin.x = 5    # blocked
```

The assignment fails with a `FrozenInstanceError`, which the example
catches and prints. You can't accidentally mutate a frozen
dataclass.

## Where AI specifically gets this wrong

Two patterns to flag.

**One: `items: list = []` — the literal-mutable-default shape.**
This raises at class-definition time, but Cursor writes it anyway,
sees the error, and sometimes "fixes" it by removing the default
entirely (forcing the caller to pass an empty list every time —
ugly). The right fix is `field(default_factory=list)`. Always.

**Two: forgetting `frozen=True` on identifier-like dataclasses.**
If you read a `UserId`, `OrderId`, `Coord`, `RequestKey`, or any
"this is a value, not a workspace" dataclass that *doesn't* have
`frozen=True`, that's a soft bug — code can mutate the value out
from under you. Add the flag.

Run the editor. Two carts with separate lists, one frozen
coordinate that refuses to be mutated.
