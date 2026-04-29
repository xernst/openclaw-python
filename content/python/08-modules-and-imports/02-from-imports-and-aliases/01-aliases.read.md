---
xp: 1
estSeconds: 50
concept: import-aliases
code: |
  import math as m
  from datetime import datetime as dt

  print(m.sqrt(81))
  print(dt.now().year)
runnable: true
---

# `as` lets you rename an import on the spot

When AI generates data-science or web code, you'll see imports like this
constantly:

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime as dt
```

The `as` keyword renames the module (or the imported name) inside *this*
file only. The original library is unchanged — you're just picking a shorter
local name.

Run the code on the right.

- `import math as m` lets you write `m.sqrt(81)` instead of `math.sqrt(81)`
- `from datetime import datetime as dt` is a double-rename: pull `datetime`
  out of the `datetime` module, and call it `dt` here

Two reasons aliases exist:

1. **Short names for things you call often.** `np` reads cleaner than
   `numpy.array(...)`. The convention is so strong that `np`, `pd`, `plt`
   are basically standardized in AI-generated code.
2. **Avoiding name clashes.** If two libraries both have a `Path` class,
   you alias one of them to keep them apart.
