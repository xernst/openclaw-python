---
xp: 2
estSeconds: 90
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

When you `pip install requests`, the package has to land *somewhere on disk*.
Without a virtual environment, it lands in your *system Python* — the same
place every other project on your laptop is reading from. Two projects with
two different versions of `requests` will fight, and you'll lose.

A **virtual environment** (venv) is just a folder Python treats as its own
mini-install:

```
.venv/
  bin/python      # a Python that only sees this folder's packages
  bin/pip
  lib/python3.x/site-packages/   # where your installs land
```

The trap that hits non-engineers most: you create the venv, forget to
activate it, run `pip install`, and the package lands in your system Python.
Then your script (which Cursor configured to use the venv) can't find it.

The classic error: `ModuleNotFoundError: No module named 'requests'`. Nine
times out of ten, that's not Python's fault. It's that `pip` and your
script are looking at two different Python installs.

(This lesson runs in your browser, so we can't make a venv here. But every
real Python project on your laptop will use one.)
