---
xp: 1
estSeconds: 100
concept: multi-import-and-star
code: |
  # multi-import: pull several names from one module in one line
  from math import pi, sqrt, floor

  print(pi)
  print(sqrt(81))
  print(floor(3.7))
---

# Multi-imports — and the one shape never to use

Two more shapes you'll see in any real Python file. One is helpful and
common. The other is technically legal, occasionally used by AI, and
should make you twitch when you see it.

Both are about pulling *more than one* name from a module at once.

## Multi-import: comma-separated `from`

```python
from math import pi, sqrt, floor
```

This pulls three specific names out of the `math` module in one
statement. Functionally identical to:

```python
from math import pi
from math import sqrt
from math import floor
```

…just shorter. Cursor reaches for the multi-import form whenever
it's pulling several utilities from the same module:

```python
from typing import List, Dict, Optional, Tuple
from collections import defaultdict, Counter, OrderedDict
from datetime import datetime, timedelta, timezone
```

Run the editor. The single `from math import pi, sqrt, floor` line
makes all three names directly available, with no `math.` prefix.

The trade-off vs. `import math` is the same as last lesson's
`from`-import discussion: shorter call sites, but you lose the
"these came from `math`" signal at the call site. For two or three
names you use a lot, multi-import is cleaner. For a dozen, it can
get messy — you start wondering whether each call is from a module
or from your own file.

## Star import: the one to avoid

```python
from math import *
```

The asterisk means *every name from this module*. After this line,
*all* of `math`'s public names — `pi`, `sqrt`, `floor`, `cos`, `sin`,
hundreds of others — are dumped into your file's namespace.

Cursor *sometimes* generates this when prompted with something like
*"give me access to everything in math"*. It is essentially always
wrong, for two concrete reasons:

### 1. You can't tell where a name came from

```python
from math import *
from numpy import *

print(sqrt(16))   # which sqrt? math's? numpy's?
```

Both `math` and `numpy` define `sqrt`. After two `import *` lines,
the second one *silently overwrites* the first. The `sqrt` you
called might not be the one you meant. There's no warning, no error,
just code that quietly used the wrong function — which can produce
subtly different numerical results.

### 2. It pollutes your namespace with names you didn't ask for

After `from math import *`, you have hundreds of names in scope. If
you write your own variable called `pi` or `gamma` or `e`, the
import either silently overrides it or gets silently overridden,
depending on order. You've made the code unreadable for anyone trying
to track which `pi` is in scope at any point.

## The two correct alternatives

Either name what you want explicitly:

```python
from math import pi, sqrt, floor
```

…or import the module and use the dot path:

```python
import math
math.pi, math.sqrt(16), math.floor(3.7)
```

Both leave the source of every name *visible* at the call site. Both
make refactoring safe. Both are what Cursor *should* generate.

## Where AI specifically gets imports wrong (final round)

Three patterns to flag when you read AI's import block:

1. **Star imports.** Always replace with named imports.
2. **Duplicate imports.** Cursor sometimes writes `from os import
   path` and `import os.path` in the same file. Pick one.
3. **Imports that aren't used.** AI frequently imports things it
   then doesn't use because earlier drafts of the script needed
   them. A `pylint`-style linter or your editor's "remove unused
   imports" command catches these. They're harmless, but they make
   the file noisier than it needs to be.

The rule for the import block at the top of any file: every line
should be *necessary* and *named*. No `*`, no aliases unless they're
conventional, no leftovers.

Run the editor. The three names from `math` are usable directly, no
prefix needed.
