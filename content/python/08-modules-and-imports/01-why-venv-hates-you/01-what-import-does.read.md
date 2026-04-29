---
xp: 1
estSeconds: 95
concept: import-statement
code: |
  import math

  print(math.pi)
  print(math.sqrt(16))
runnable: true
---

# `import` — "load this other file's code so I can use it"

The first three lines of every Python script Cursor writes you are
import statements. `import os`, `import json`, `from datetime import
datetime`, `import requests`. These lines are how the file gets
access to functions and constants that live somewhere else — in
Python's standard library, in a package you `pip install`ed, or in
another file in your own project.

If you can't read import lines, you can't tell where any of the code
*comes from*. And in AI-generated code, every line below the imports
is reaching back up into one of those modules.

## What `import` actually does

```python
import math
```

When Python hits that line, three things happen, in order:

1. **Find.** Python looks through a list of known directories — its
   standard library, your `site-packages` folder, the current
   directory — for a file or package called `math`.
2. **Load and run.** It runs the file once, which defines all the
   functions and constants inside it.
3. **Bind a name.** It creates a local variable in *your* file
   called `math`, which holds the loaded module. From now on, anywhere
   in your file you can say `math.something` to reach into it.

After the import, `math` is just another name in your file —
specifically, a name pointing at a *module object*. Every function
and constant inside is reached by walking through that name with a
dot:

```python
math.pi          # the constant pi
math.sqrt(16)    # the sqrt function, called with 16
```

## A worked example

The editor on the right has the canonical first import:

```python
import math

print(math.pi)
print(math.sqrt(16))
```

Output:

```
3.141592653589793
4.0
```

`math.pi` reaches into the `math` module and reads the `pi` constant.
`math.sqrt(16)` reaches into the `math` module, calls the `sqrt`
function with `16`, and gets back `4.0`. Same `math.` prefix, two
different things being looked up.

## The two flavors of imports AI generates

You'll see both forms in any non-trivial AI-generated file:

```python
import math                # the whole module
math.sqrt(16)              # use it via the module name

from math import sqrt      # just the one name
sqrt(16)                   # use it directly, no prefix
```

Both work. The next lesson covers which is better when. For now,
recognize them both as "this file is using something defined
elsewhere."

## What you'll see all year

A short list of imports that show up in approximately every script
Cursor writes:

- **Standard library** (already installed with Python — no setup):
  `os`, `sys`, `json`, `re`, `datetime`, `pathlib`, `math`,
  `random`, `collections`.
- **Data and ML** (need install): `numpy`, `pandas`, `matplotlib`,
  `scikit-learn`, `torch`, `transformers`.
- **Web** (need install): `requests`, `httpx`, `flask`, `fastapi`,
  `pydantic`, `uvicorn`.
- **AI integrations** (need install): `openai`, `anthropic`,
  `langchain`, `llama-index`.

When AI imports something not in the standard library, that something
has to be `pip install`ed first. Which is where the next two lessons
matter — virtual environments, where those installs go, and why your
laptop's "global" Python is the wrong place to put them.

## Where AI specifically gets imports wrong

Three patterns to flag:

1. **Importing something that isn't installed.** Cursor sometimes
   writes `import requests` when your venv doesn't have it. You get a
   `ModuleNotFoundError`. The fix is `pip install requests`, not
   "rewrite the script."

2. **Circular imports.** Two files that import each other can get
   tangled up — one is half-loaded when the other tries to use it,
   and you get a confusing `ImportError`. We won't cover the fix
   here, but recognize the symptom.

3. **Imports that don't match the function name.** AI sometimes
   writes `from datetime import datetime` and you have to read it
   twice. The first `datetime` is the *module*; the second is a
   *class* inside that module with the same name. Confusing? Yes.
   The convention exists because the module is also called
   `datetime`, and the class is the most useful thing inside it.

Run the editor. `math.pi` and `math.sqrt(16)` print. Both came from
a file Python loaded without you noticing.
