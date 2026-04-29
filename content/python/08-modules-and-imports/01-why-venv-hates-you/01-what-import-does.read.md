---
xp: 1
estSeconds: 45
concept: import-statement
code: |
  import math

  print(math.pi)
  print(math.sqrt(16))
runnable: true
---

# `import` is "load this other file's code so I can use it"

When AI writes `import math` at the top of a script, it's saying *go find
the file called `math.py` somewhere Python knows to look, run it, and let
me reach into its functions*.

After `import math`, every name from that module is reached with `math.xxx`:

- `math.pi` — the constant
- `math.sqrt(16)` — the function

Hit **Run**. The two prints show `3.141592653589793` and `4.0`.

You'll see this shape every day. AI imports `math`, `json`, `datetime`,
`random`, `os`, `requests`, `pandas`. The standard library (the first five)
is built in. The rest you have to install — and that's where `venv` enters
the chat.
