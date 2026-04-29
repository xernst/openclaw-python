---
xp: 1
estSeconds: 60
concept: multi-import-and-star
code: |
  # multi-import: pull several names from one module in one line
  from math import pi, sqrt, floor

  print(pi)
  print(sqrt(81))
  print(floor(3.7))
---

# Two more shapes you'll see, one to avoid

**Multi-import** — comma-separated names in a single `from` line:

```python
from math import pi, sqrt, floor
```

Pulls three names out of `math` in one statement. Equivalent to three
separate `from math import ...` lines. Run the code on the right to see it.

**Star import** — `from x import *`:

```python
from math import *   # don't do this
```

This pulls *every* name from `math` into your file's namespace. AI does
this sometimes and it's almost always wrong. Two reasons:

1. **You can't tell where a name came from.** Reading `pi` later, you
   don't know if it's `math.pi` or some local variable. Star imports
   destroy that signal.
2. **Name collisions silently overwrite.** If two modules both export
   `Path`, the second `import *` wipes out the first one.

Rule: never `import *`. Either name what you want (`from x import a, b`)
or import the module and use the dot path (`import x; x.a`).
