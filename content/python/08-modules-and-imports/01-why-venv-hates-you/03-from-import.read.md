---
xp: 1
estSeconds: 50
concept: from-import-vs-import
code: |
  from random import choice

  pets = ["luna", "moose", "biscuit"]
  print(choice(pets))
---

# `from x import y` pulls one name out

Two ways to use the same module, both legal, slightly different feel:

```python
import random
random.choice(pets)        # full path, every time

from random import choice
choice(pets)               # just the name
```

The first one is louder — every call says where the function came from.
The second one is shorter but you lose that signal. AI mixes both styles
in the same file all the time, which makes its code hard to read.

A practical rule: if the file is short, `from x import y` is fine. If it's
long or uses many modules, `import x` keeps the source obvious.

Hit **Run** on the right. `choice(pets)` picks one of the three at random.
Run it a few times — different result each trip.
