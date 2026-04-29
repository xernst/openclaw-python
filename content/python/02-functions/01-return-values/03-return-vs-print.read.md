---
xp: 1
estSeconds: 40
concept: return-vs-print
code: |
  def shout_returns(word):
      return word.upper()

  def shout_prints(word):
      print(word.upper())

  a = shout_returns("hello")
  b = shout_prints("hello")

  print("a is:", a)
  print("b is:", b)
---

# `return` and `print` are not the same thing

This is the bug AI ships most often inside a function. They look similar.
They aren't.

- `print(x)` — shows `x` on the screen, then keeps going. The function still
  hands back `None` unless you also `return` something.
- `return x` — hands `x` back to whoever called the function. Nothing shows
  on the screen unless someone *prints* what they got back.

Run the code on the right. `shout_returns` hands back the uppercase word —
so `a` holds `"HELLO"`. `shout_prints` shows the word on screen but hands
back nothing — so `b` is `None`.

Whenever you see a function that "doesn't seem to work," check this first.
