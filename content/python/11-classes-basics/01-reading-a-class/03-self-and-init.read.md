---
xp: 2
estSeconds: 110
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

The thing that confuses every Python newcomer exactly once: every method
in a class takes `self` as its first argument, but **you never pass it
yourself** when you call the method.

```python
def describe(self):           # the method declares self as its first arg
    return f"{self.name} ..."

rex.describe()                # but you call it with zero arguments
```

That asymmetry — declared with one parameter, called with zero — is the
piece that breaks the math model in your head. Once you see what's
actually happening, it stops being weird.

## What the dot is doing

`rex.describe()` is *secretly* `Pet.describe(rex)`.

The dot operator does two things at once: it looks up the `describe`
method on the class, and it silently passes `rex` as the first argument.
You see one argument list at the call site (the `()`), but Python
constructs two: the implicit `self`, and whatever else you wrote inside
the parentheses.

This is true for every method on every class:

```python
rex.describe()        # → Pet.describe(rex)
rex.feed("kibble")    # → Pet.feed(rex, "kibble")
rex.greet(other_pet)  # → Pet.greet(rex, other_pet)
```

In each one, the instance to the left of the dot becomes the `self`
parameter inside the method. The other arguments in the parentheses fill
in after.

## Why two instances don't collide

This is what makes classes useful. Look at the editor on the right:

```python
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
```

Run it. Output:

```
rex is a dog
whiskers is a cat
```

Same `describe` method. Same body of code. Two completely different
return values — because `self.name` and `self.kind` read from the
*specific instance* the method was called on, not from a global or from
the class itself.

In the first call, `self` is `rex`, so `self.name` is `"rex"` and
`self.kind` is `"dog"`. In the second call, `self` is `whiskers`, so
`self.name` is `"whiskers"` and `self.kind` is `"cat"`. The class
definition doesn't change between calls. Only `self` does.

## Why `__init__` matters

`__init__` is just a method. The two underscores on each side mark it as
a *dunder* (double-underscore) method, which is Python's signal that
"this method is called automatically by some part of the language."

For `__init__`, the trigger is *construction*. The instant you write
`Pet("rex", "dog")`:

1. Python creates a brand-new, empty `Pet` instance.
2. Python calls `Pet.__init__(new_instance, "rex", "dog")`.
3. Inside `__init__`, the assignments `self.name = name` and
   `self.kind = kind` attach the per-instance data.
4. Python returns the now-populated instance.

You never see steps 1, 2, or 4. From your seat, `Pet("rex", "dog")`
just produces a fully-set-up `Pet`. The constructor is the moment
where instance data gets attached.

## Where AI specifically gets this wrong

Three patterns to flag in code Cursor writes:

1. **Forgetting `self` on a method definition.** `def describe():` (no
   `self`) inside a class. Calling `rex.describe()` then dies with
   `TypeError: describe() takes 0 positional arguments but 1 was
   given`. The "1" is the silently-passed `rex`. The fix is `def
   describe(self):`.

2. **Forgetting `self.` on the assignment.** `def __init__(self,
   name): name = name` does *nothing useful* — it assigns the
   parameter to itself, never touching the instance. The fix is
   `self.name = name`. Reading the instance back later returns the
   class's default (or `AttributeError`) instead of the value the
   caller passed.

3. **Calling a method as `Pet.describe()` without an instance.** This
   raises `TypeError: describe() missing 1 required positional argument:
   'self'`. The fix is to call it on an instance — `rex.describe()` —
   so the dot supplies `self`.

Run the editor. Two pets, two `describe()` calls, two different outputs.
The class definition doesn't change between calls — only `self` does.
