---
xp: 1
estSeconds: 110
concept: instance-vs-class-attributes
code: |
  class Dog:
      species = "canis familiaris"

      def __init__(self, name):
          self.name = name

  rex = Dog("rex")
  whiskers = Dog("whiskers")

  print(rex.name, "is a", rex.species)
  print(whiskers.name, "is a", whiskers.species)
  print("class-level:", Dog.species)
---

# Two kinds of attributes — and AI mixes them up at least once

When you read a class Cursor wrote you, every variable inside it
falls into one of two buckets. Knowing which bucket you're looking at
is the difference between code that does what you expect and code
that has every instance of a class quietly sharing the same list.

The two buckets:

- **Instance attributes** — assigned with `self.something = ...` inside
  a method (almost always `__init__`). One copy per instance. Each
  `Dog` you create gets its own `name`.
- **Class attributes** — assigned at the *top of the class body*, with
  no `self.`. One copy total, shared by every instance. Every `Dog`
  ever created sees the same `species`.

Most of the bugs in AI-generated class code come from putting
something in the wrong bucket — most often, putting an instance value
(like a list of items, a counter, a config dict) on the class by
accident.

## The mental model

The class body is executed *once*, when Python first defines the
class. Anything assigned at that level lives on the class itself:

```python
class Dog:
    species = "canis familiaris"   # class attribute — assigned once
```

`__init__` runs *every time* you create a new instance. Anything
assigned via `self.` lives on that specific instance:

```python
    def __init__(self, name):
        self.name = name           # instance attribute — one per dog
```

When you write `rex.species`, Python first looks at `rex` itself for
a `species` attribute. There isn't one (we only set `name` per
instance). So Python falls back to the class — `Dog.species` — and
finds `"canis familiaris"`. That fallback is what makes class
attributes feel like instance attributes when you read them. The
trap, you'll see in two steps, is that *writing* doesn't follow the
same rule.

## A worked example

The editor on the right defines a tiny `Dog` class with one of each
bucket:

```python
class Dog:
    species = "canis familiaris"

    def __init__(self, name):
        self.name = name
```

Two instances:

```python
rex = Dog("rex")
whiskers = Dog("whiskers")
```

Each has its own `name` — they're not shared. But both *see* the
same `species`, because there's only one — it lives on the class:

```
rex is a canis familiaris
whiskers is a canis familiaris
class-level: canis familiaris
```

You can also read the class attribute directly off the class itself
(`Dog.species`), which sometimes makes the two buckets clearer when
you're debugging.

## Where AI specifically gets this wrong

The single biggest pattern: **AI puts mutable instance state on the
class by accident.** It looks like this:

```python
class Cart:
    items = []          # bug — same list shared by every cart!

    def add(self, item):
        self.items.append(item)
```

`items` is at the class level, so there's *one list* shared by every
`Cart` ever created. Add to one cart, every other cart sees the new
item too. We'll prove this in the next steps and learn the fix.

The rule of thumb when you read AI code: **if the value is a list,
dict, or set sitting at the top of a class body, that's almost
always a bug.** Strings, ints, and bools at the top are usually
fine — they're constants like the `species` example. But mutable
containers belong inside `__init__` with `self.` so each instance
gets its own.

Run the editor. Two dogs, two distinct names, one shared species —
exactly the right shape for these kinds of values.
