---
xp: 1
estSeconds: 100
concept: import-aliases
code: |
  import math as m
  from datetime import datetime as dt

  print(m.sqrt(81))
  print(dt.now().year)
runnable: true
---

# `as` lets you rename an import on the spot

When AI writes data-science code, machine-learning code, or anything
involving `pandas` or `numpy`, the imports look like a foreign
language at first:

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import tensorflow as tf
from datetime import datetime as dt
```

That little `as something` after each module name is **alias syntax**.
It's the most common form of import in any AI-generated file that
touches data, and it's worth understanding both *what* it does and
*why* the conventions are so strict.

## What `as` actually does

```python
import math as m
```

This says: *load the `math` module, but inside this file, refer to
it as `m` instead of `math`*. The library itself is unchanged.
You're just picking a shorter local name.

After the import:

- `m.sqrt(16)` works — same as `math.sqrt(16)` would have.
- `math.sqrt(16)` does **not** work — the name `math` was never
  bound. `m` is the only handle this file has.

The renaming applies *only to this file*. Other files in the same
project that do `import math` still see `math`. It's a per-file
local nickname, not a global rename.

## A worked example with two aliases

The editor on the right has a single-rename and a double-rename:

```python
import math as m
from datetime import datetime as dt

print(m.sqrt(81))
print(dt.now().year)
```

Read each:

- **`import math as m`** — load the `math` module, call it `m` in
  this file. Now `m.sqrt(81)` evaluates the `sqrt` function and
  prints `9.0`.
- **`from datetime import datetime as dt`** — go to the `datetime`
  module, pull out the `datetime` class, and call it `dt` in this
  file. Now `dt.now()` calls the class method `now`, which returns
  the current time, and `.year` reads the year off it.

The double-rename in line 2 is the canonical Python idiom for
working with dates. The class is *also* called `datetime` (same as
its module), so writing `dt` instead avoids the visual confusion of
`datetime.datetime.now()`.

## Why the convention is so strong in data code

In `numpy`, `pandas`, and `matplotlib` code, the alias is
near-universal:

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
```

`np`, `pd`, `plt` aren't *required* — they're just convention. But
the convention is so strong that an AI-generated file using
`numpy.array(...)` or `pandas.DataFrame(...)` actually looks *wrong*.
Every tutorial, every Stack Overflow answer, every Kaggle notebook
uses the short forms.

The benefit: code calling `np.array(...)` and `np.zeros(...)` and
`np.dot(...)` reads as a series of `np` operations. Spelling out
`numpy` every time would add visual noise without adding meaning.

## When you should *not* use aliases

Aliases are not free — they hide where things came from. Use them
when:

- The convention is well-established (`np`, `pd`, `plt`, `tf`).
- The full name is genuinely unwieldy and used many times.
- You need to avoid a name collision (two libraries with the same
  exported name).

Avoid them when:

- The full name is already short. `import os as o` is silly.
- You're only using the imported thing once or twice. The brevity
  isn't worth the extra mental decode for the reader.
- The alias would be cryptic. `import requests as r` saves three
  characters and adds confusion.

## Where AI specifically gets aliases wrong

Two patterns to flag in code Cursor writes:

1. **Inventing nonstandard aliases.** Cursor sometimes writes
   `import pandas as pds` or `import numpy as numpy_` for no reason.
   If you see an alias that isn't `np`, `pd`, `plt`, `tf`, or `dt`,
   ask whether it's pulling its weight or just adding noise.

2. **Aliasing modules that don't need it.** `import sys as s` is
   technically legal and almost always wrong — `sys` is already
   short. The alias just costs the reader a moment of "wait, what
   was `s`?" each time it appears.

Run the editor. `m.sqrt(81)` prints `9.0`. `dt.now().year` prints the
current year, fetched via the renamed `datetime` class.
