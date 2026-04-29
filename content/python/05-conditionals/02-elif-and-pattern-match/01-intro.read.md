---
xp: 1
estSeconds: 40
concept: elif-chain
code: |
  status_code = 404

  if status_code == 200:
      print("ok")
  elif status_code == 301:
      print("redirect")
  elif status_code == 404:
      print("not found")
  elif status_code == 500:
      print("server error")
  else:
      print("unknown")
runnable: true
---

# `elif` is "otherwise, check this"

`if` runs one block when its condition is true. `elif` adds *another*
condition that's only checked if the previous ones failed. `else` is the
catch-all at the bottom.

When you ask Cursor for *"handle each HTTP status differently,"* the thing
it reaches for is an `elif` chain.

The shape on the right reads top to bottom:

- Try `status_code == 200` first
- If that's false, try `301`
- Otherwise `404`, otherwise `500`
- If nothing matched, the `else` runs

Hit **Run**. Only one branch fires per trip — the **first** one that's true.

The trap: Python checks them in order. If you put a broader condition before
a narrower one, the narrower one never runs. We'll fix that bug shortly.
