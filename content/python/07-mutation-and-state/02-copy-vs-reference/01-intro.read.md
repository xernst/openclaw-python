---
xp: 1
estSeconds: 45
concept: shallow-copy-recap
code: |
  original = [1, 2, 3]

  # three real ways to copy a list
  a = original[:]
  b = list(original)
  c = original.copy()

  a.append(99)

  print("original:", original)
  print("a:", a)
runnable: true
---

# A copy is a new container with the same items

Last lesson: `b = a` doesn't copy — it shares. To actually get a separate
list, you need one of three things: a slice (`a[:]`), the `list()`
constructor, or the `.copy()` method. All three produce a new list.

Run the code on the right.

After `a.append(99)`, only `a` changes. `original` stays `[1, 2, 3]`.

This is called a **shallow copy** — a new outer container, but the items
inside are shared. For a flat list of numbers or strings, that's fine.

It stops being fine the moment the items themselves are *also* containers —
nested lists, dicts inside lists, lists inside dicts. We'll see that bug
in two steps.
