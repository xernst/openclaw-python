---
xp: 1
estSeconds: 95
concept: from-import-vs-import
code: |
  from random import choice

  pets = ["luna", "moose", "biscuit"]
  print(choice(pets))
---

# `from x import y` — pull one name out, skip the prefix

Last lesson: `import math` makes the *whole module* available as
`math.thing`. This lesson: `from math import sqrt` reaches in and
pulls *just one name* out, so you can write `sqrt(16)` directly,
without the `math.` prefix.

Both styles exist for a reason, and AI uses both — sometimes in the
same file, which is its own readability problem. Knowing when each is
right will help you read AI code and clean it up when you're writing
your own.

## The two forms, side by side

```python
import random
random.choice(pets)        # full path every time

from random import choice
choice(pets)               # just the name, no prefix
```

Both end up calling the same `choice` function with the same
argument. The difference is *what name lives in your file's
namespace afterward*.

- After `import random`: the name `random` lives in your file. To
  reach `choice`, you walk through `random.choice`.
- After `from random import choice`: the name `choice` lives in your
  file. The module `random` itself is *not* available — you can use
  `choice` directly, but if you wanted `random.randint`, you'd need
  another import line.

## A worked example

The editor on the right uses the `from`-style import:

```python
from random import choice

pets = ["luna", "moose", "biscuit"]
print(choice(pets))
```

Run it a few times. Each run picks one of the three pets at random.
Notice that the call is just `choice(pets)` — no `random.` in front.
The `from` line pulled `choice` directly into the local namespace.

If you wanted to *also* use `random.randint(1, 10)` later, this
script can't do it — `random` itself isn't imported, only `choice`.
You'd need to add either `import random` or `from random import
choice, randint`.

## Which form to use when

This is one of those style questions where the right answer depends
on the file's size and how many things it pulls from each module.

**Use `import x`** when:
- The module name is short.
- You're going to use multiple things from the module.
- The reader benefits from seeing where each call came from
  (`os.path.join` reads as "from the os.path module, the join
  function" — that's signal you don't get from a bare `join`).

**Use `from x import y`** when:
- You only need one or two specific names.
- The module name is long and would clutter every call site.
- The thing you're importing has a name that's already
  unambiguous — `datetime`, `defaultdict`, `Path`.

## Where AI specifically mixes them in confusing ways

Two patterns to flag in code Cursor writes you:

1. **Mixing styles for the same module.** Cursor sometimes writes:
   ```python
   import os
   from os import path
   ```
   …and then uses both `os.makedirs(...)` and `path.join(...)` in the
   same file. That works, but the reader has to remember which name
   is the module and which is the function. The cleaner version is to
   pick one style per module and stick with it.

2. **Importing a class with the same name as its module.** When AI
   writes:
   ```python
   from datetime import datetime
   ```
   This is the canonical Python idiom — the module is `datetime`, the
   class is also `datetime`. Confusing on first read, conventional on
   second. After the import, `datetime` in your code is the *class*,
   not the module.

Run the editor. `choice(pets)` runs from the directly-imported name,
no prefix needed.
