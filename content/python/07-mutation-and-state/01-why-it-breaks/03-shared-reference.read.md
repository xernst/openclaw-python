---
xp: 1
estSeconds: 45
concept: shared-list-reference
code: |
  a = [1, 2, 3]
  b = a

  b.append(4)

  print("a:", a)
  print("b:", b)
---

# `b = a` doesn't copy. It just gives the same list a second name.

Run the code on the right. After `b.append(4)`, *both* `a` and `b` print
`[1, 2, 3, 4]`. They're the same list. `b = a` didn't copy — it gave the
existing list a second name.

This is the *exact* bug Cursor ships when you ask it to "make a backup
before modifying." It writes `backup = original`, then changes `original`,
and is shocked when "the backup also changed."

To actually copy a list:

```python
b = a[:]        # slice copy
b = list(a)     # constructor copy
b = a.copy()    # method copy
```

All three create a new list. After any of them, `b.append(4)` only changes
`b`, not `a`.
