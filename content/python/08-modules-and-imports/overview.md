## Why your venv hates you (and how to make peace with it)

You ran `pip install requests`. You see "Successfully installed." You write `import requests` in your script. You hit Run. You get `ModuleNotFoundError: No module named 'requests'`.

Welcome to the single most-confusing thing about Python for non-engineers. The package is installed. The script can't find it. The "fix" is some combination of `pyenv`, `venv`, `.python-version`, `which python`, `python -m pip` versus `pip`, and reading the output of three different shell commands until something clicks.

This chapter exists because that experience is universal, completely unrelated to whether you understand Python the language, and the source of more "I quit" moments than any other beginner topic. After this chapter you'll know exactly what's happening and which command to run when.

## The mental model: there's more than one Python on your machine

Open a terminal. Type `which python`. Type `which python3`. Type `which pip`. They probably all point to different binaries — or worse, the same binary but a different *interpreter version* than your IDE is using to run your script. macOS ships its own Python. Homebrew installed another. `pyenv` manages a third. Your project might have a `.venv/` with a fourth.

When you `pip install requests`, the package is installed *somewhere* — into the site-packages of *whichever Python interpreter `pip` is associated with*. When you run `python script.py`, you might be running a *different* interpreter, with a different site-packages, that doesn't have `requests`. Hence the error.

The fix at the daily-work level is one habit:

- One project, one virtual environment.
- Activate the venv (`source .venv/bin/activate`), then `pip install`, then `python` — all using the venv's binaries.
- When something doesn't work, the first question is *"is the venv activated?"* before any other debugging.

That's 95% of "why doesn't pip find my package." Once that's habit, the other 5% (path edge cases, system Python conflicts, macOS framework quirks) gets manageable.

## What this chapter covers in two lessons

**Lesson 1: Why venv hates you.** The mental model above, drilled. What `import` actually does (it's a search through `sys.path`), how `sys.path` is constructed, and where the venv inserts itself. Includes the canonical "I installed it but Python can't find it" debug exercise — the script and the error and the fix.

**Lesson 2: From-imports and aliases.** Python's import syntax in detail: `import x`, `from x import y`, `import x as alias`, `from x import (a, b, c)`. The bug AI ships when it imports `numpy` versus `np` aliasing, and the circular-import error you'll occasionally hit. Plus the modern `uv` workflow (faster than pip; the 2025+ tool of choice).

## What AI specifically gets wrong about modules

Three patterns:

1. **Installing into the wrong Python.** Cursor sometimes generates `pip install x` shell commands that target the system Python, not your venv. Six minutes later you're confused why the package is missing. Lesson 1 covers spotting this.

2. **Importing from the wrong path.** AI sometimes writes `from utils import helper` when the project layout has `from app.utils import helper`. Tests pass when run from one directory, fail from another. Lesson 1 has a debugging step for this.

3. **Star imports (`from x import *`).** AI ships these in toy code. They're banned in real code because they pollute your namespace and obscure what's coming from where. Lesson 2 covers it.

## What you'll be able to do at the end

Two lessons, ~17 steps. By the end you'll be able to:

- Diagnose any "ModuleNotFoundError" or "ImportError" in 60 seconds.
- Set up a Python project with venv (or `uv`) from scratch from memory.
- Read import statements correctly, including the AI-generated tricky ones.
- Avoid the three top "AI shipped this wrong" import patterns.

This chapter is the unblock for everything else. You can't run any of the chapters from 12 onward — HTTP, LLM APIs, MCP, agents — without correctly installing the SDKs first. Get this chapter solid and the rest of the course stops generating "but how do I install" friction.

Press *Start chapter* below.
