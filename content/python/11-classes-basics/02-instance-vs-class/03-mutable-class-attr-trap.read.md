---
xp: 2
estSeconds: 130
concept: mutable-class-attribute-bug
code: |
  class BadCart:
      items = []                        # one list shared by every cart

      def add(self, item):
          self.items.append(item)

  class GoodCart:
      def __init__(self):
          self.items = []               # one list per cart

      def add(self, item):
          self.items.append(item)

  a = BadCart(); a.add("apple")
  b = BadCart(); b.add("bread")
  print("BadCart a:", a.items)
  print("BadCart b:", b.items)

  x = GoodCart(); x.add("apple")
  y = GoodCart(); y.add("bread")
  print("GoodCart x:", x.items)
  print("GoodCart y:", y.items)
---

# The mutable-class-attribute trap

Now the bug AI ships at least once a quarter, and the fix that costs
four characters.

## The bug

Cursor reaches for class-level lists when it wants a "default value"
for an attribute. It looks innocent:

```python
class Cart:
    items = []

    def add(self, item):
        self.items.append(item)
```

This *seems* to say "every cart starts with an empty list of items."
What it actually says is "there is one `items` list, attached to the
class, and every cart points at it." Watch what happens:

```python
a = Cart(); a.add("apple")
b = Cart(); b.add("bread")

print(a.items)   # ['apple', 'bread']  <-- ?!
print(b.items)   # ['apple', 'bread']
```

Both carts see both items. Because `self.items.append(...)` doesn't
*assign* a new list to `self`; it mutates the existing list — the one
sitting on the class. Every instance is reading and writing through
to the same list.

This is the same shape as the "mutable default argument" bug in the
functions chapter. It bites every Python beginner exactly once,
right after AI generates a class for them.

## The fix

Move the assignment into `__init__`:

```python
class Cart:
    def __init__(self):
        self.items = []

    def add(self, item):
        self.items.append(item)
```

Now `__init__` runs *for each new cart*. Every `Cart()` call creates
a brand new empty list and binds it to that instance's `items`
attribute. Two carts, two independent lists.

```python
a = Cart(); a.add("apple")
b = Cart(); b.add("bread")

print(a.items)   # ['apple']
print(b.items)   # ['bread']
```

Four characters of extra code (`def __init__(self):`) and one
indent — that's the whole fix.

## Why "read works, write breaks" makes this so confusing

There's a subtlety that makes this bug hard to spot. *Reading* a
class attribute through an instance works fine:

```python
class Dog:
    species = "canis familiaris"

print(Dog().species)   # 'canis familiaris' — works
```

That's because Python looks at the instance first, doesn't find
`species`, falls back to the class, and returns it. The instance
appears to "have" the class attribute even though it doesn't really.

But *writing* breaks the symmetry. `self.species = "wolf"` on an
instance creates a *new instance attribute* that shadows the class
one — only on that instance. And `self.items.append(...)` doesn't
write to `self`; it mutates the class-level list in place.

The rule that emerges: **strings, ints, and bools at the class level
are fine** (they're effectively constants). **Lists, dicts, and sets
at the class level are almost always a bug** — instance state should
go in `__init__`.

## Where AI specifically gets this wrong

When you see this in code Cursor wrote:

```python
class Whatever:
    cache = {}
    items = []
    config = {"x": 1}

    def __init__(self, name):
        self.name = name
```

…flag it. Every one of those mutable class attributes is a shared
piece of global state pretending to be per-instance. Move them all
into `__init__`:

```python
class Whatever:
    def __init__(self, name):
        self.name = name
        self.cache = {}
        self.items = []
        self.config = {"x": 1}
```

Run the editor. The `BadCart` instances share their list and you'll
see `apple` and `bread` in *both*. The `GoodCart` instances each
have their own list — exactly what you'd want.
