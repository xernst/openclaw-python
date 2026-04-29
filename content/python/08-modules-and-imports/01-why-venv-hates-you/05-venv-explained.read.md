---
xp: 2
estSeconds: 130
concept: virtual-environment
code: |
  # Why your venv hates you, in three lines:
  #
  #   python -m venv .venv          # create an isolated Python install
  #   source .venv/bin/activate     # tell the shell to use it
  #   pip install requests          # installs *into the venv*, not the OS
  #
  # If you skip step 2, `pip install` writes to the wrong Python.
  # Then your script can't find the package and you blame Python.
---

# A venv is a folder. Your packages go in it. End of mystery.

This is the single most confusing thing about Python for newcomers.
You install a package, your script can't find it, you reinstall it,
the script still can't find it, you panic, you delete and reinstall
Python itself. That entire failure mode comes from one missing
concept: **virtual environments**.

Read this once carefully and you'll save yourself a lot of pain.
Cursor will set this up for you most of the time, but you need to
know what it's setting up so you can fix it when it doesn't.

## The problem virtual environments solve

When you `pip install requests`, the package files have to land
*somewhere on disk*. By default, that's the directory belonging to
*your system Python install* — the one that came with macOS, or
that you installed once and have used for everything since.

That sounds fine until you have two projects:

- Project A needs `requests` version 2.25.
- Project B needs `requests` version 2.31.

If they share the same system-wide `requests` directory, they fight.
The latest install wins. The other project either crashes or
silently behaves wrong.

Multiply that across every project on your laptop and the conflicts
get nasty. The solution: every project gets its *own* Python
install, with its *own* `site-packages` directory. That's a virtual
environment.

## What a venv actually is

A virtual environment is just a folder. Usually called `.venv`,
sometimes `env`. Inside, it has its own Python interpreter and its
own package directory:

```
.venv/
  bin/python                          # a Python that only sees this folder's packages
  bin/pip                             # a pip that installs into this folder only
  lib/python3.x/site-packages/        # where pip installs land
```

That's it. No magic. Just a folder with a fenced-off copy of Python.

## The three commands

To use a venv, you create it, activate it, and install into it:

```bash
python -m venv .venv             # 1. create the folder
source .venv/bin/activate        # 2. activate (Mac/Linux)
.venv\Scripts\activate           # 2. activate (Windows)
pip install requests             # 3. install — but only into the venv
```

After step 2, your shell prompt usually shows `(.venv)` to remind you
the venv is active. Now `python` and `pip` refer to the ones inside
`.venv/bin/`, not the system ones.

Activation is *per-shell-session*. Open a new terminal tab, you have
to activate again. Cursor handles this for you most of the time.

## The classic bug: forgetting to activate

This is the single most common Python frustration:

1. You create a venv with `python -m venv .venv`.
2. You forget to run `source .venv/bin/activate`.
3. You run `pip install requests` — but `pip` here is the *system*
   pip, so it installs into your system Python, not the venv.
4. You run your script — but the script is configured to use the
   *venv's* Python, which has no `requests`.
5. Crash: `ModuleNotFoundError: No module named 'requests'`.

Nine out of ten times you see this error, the bug is *not* a missing
package. It's that `pip` and your script are talking to two
different Python installs, and only one of them has the package.

The fix: activate the venv first, then `pip install`. Or use the
venv's pip explicitly: `.venv/bin/pip install requests`.

## Where AI specifically gets this wrong

Three patterns to flag in code Cursor walks you through:

1. **`pip install` without saying "activate first."** Cursor will
   sometimes hand you a one-liner `pip install foo bar` without
   reminding you to activate the venv. If your shell prompt doesn't
   show `(.venv)`, the install is going to the wrong place.

2. **Running the script with the system Python by accident.** If you
   have multiple Pythons (system, Homebrew, pyenv, conda), `python`
   on the command line might not be the one you want. Use
   `which python` to confirm — when activated, it should point inside
   `.venv/`.

3. **Working in the wrong project's venv.** Each project has its
   own venv, and they're not interchangeable. If you have project A
   activated and `cd` into project B, the venv from A is still
   active. Run `deactivate`, then activate B's venv. Cursor's
   integrated terminal usually handles this for you.

(This lesson runs in your browser via Pyodide, so we can't actually
make a venv in this environment. The concepts are the same — every
real Python project on your laptop will use one.)
