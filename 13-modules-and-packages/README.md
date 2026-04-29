# Chapter 13 — Modules & Packages

Past ~300 lines, one file hurts. Python splits code into **modules** (files) and **packages** (folders).

## 13.1 A module is a `.py` file

Given:

```
project/
├── main.py
└── utils.py
```

From `main.py`:

```python
import utils
from utils import clean_text
from utils import clean_text as clean    # alias
import utils as u
```

## 13.2 A package is a folder (with `__init__.py`)

```
mypkg/
├── __init__.py
├── bot.py
├── topics.py
└── swarm/
    ├── __init__.py
    ├── strategist.py
    └── synthesis.py
```

Dotted imports:

```python
from mypkg.swarm import strategist
from mypkg.swarm.synthesis import combine
```

`__init__.py` can be empty. Content in it runs the first time the package is imported; common use: re-exporting:

```python
# mypkg/__init__.py
from .bot import send
from .topics import TOPICS, route_topic
```

Now `from mypkg import send` works directly.

Note the leading dot in `from .bot import send` — this is a **relative import**, meaning "from this package." Inside a package, prefer relative imports.

## 13.3 `if __name__ == "__main__":`

Every file has a magic `__name__`:
- Run directly: `__name__ == "__main__"`
- Imported: `__name__ == module_name`

```python
def send(topic, msg): ...

if __name__ == "__main__":
    send("Main", "smoke test")
```

Use this in every script that doubles as a library.

## 13.4 Where does Python look?

- The folder of the currently running script
- Entries in `sys.path`
- Installed packages (via `pip` / `uv` — ch 20)

See `sys.path` for the list; add to it via `PYTHONPATH` env var or `sys.path.insert(0, "...")`.

## 13.5 Naming

- Lowercase, no spaces. `obsidian_utils.py`, not `ObsidianUtils.py`.
- Short, lowercase package names. Avoid hyphens in package names (hyphens aren't legal in `import` — use underscores).

## 13.6 `from x import *` — don't

It imports everything and pollutes your namespace. Exceptions: interactive REPL exploration, or if a package defines `__all__` deliberately.

## 13.7 Circular imports

If A imports B and B imports A at module top-level, you get a headache. Usually fixed by moving the import *inside the function that uses it* or restructuring.

## 13.8 Three import styles — when to use each

```python
import json                      # whole module
from json import dumps            # one name
from json import dumps as jdumps  # aliased
```

Rule of thumb: `import module` for stdlib/external packages you'll use a lot; `from module import name` for things you'll call often where the prefix noise isn't useful.

## Vibe-Coding Corner

- **Internalize:** the `__init__.py` + `__name__ == "__main__"` pair, relative imports, the search path.
- **Skim:** namespace packages, `importlib`, lazy imports.
- **AI gets wrong:** creates a package without `__init__.py` (mostly fine now with namespace packages, but confusing); uses `from x import *`; doesn't wire a `__name__` guard.
