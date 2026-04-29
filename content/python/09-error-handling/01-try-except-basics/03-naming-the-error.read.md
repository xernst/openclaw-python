---
xp: 2
estSeconds: 50
concept: specific-exception-types
code: |
  pets = {"dog": "rex"}

  try:
      print(pets["cat"])
  except KeyError:
      print("no cat in the dict")

  try:
      print(pets["dog"] + 7)
  except TypeError:
      print("can't add a string and a number")
---

# Catch the specific error, not "anything that goes wrong"

`except:` on its own catches *everything* — including bugs you'd rather see
crash loudly. AI sometimes writes bare `except:` and silently hides the
real problem for hours.

The fix is to name the exception you actually expect:

- `ValueError` — wrong kind of value (`int("hi")`)
- `KeyError` — dict key not found
- `IndexError` — list index out of range
- `TypeError` — wrong type for the operation
- `FileNotFoundError` — open() couldn't find the file

Run the editor. Two separate `try` blocks, each catching exactly the error
it expects.
