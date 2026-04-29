---
xp: 1
estSeconds: 50
concept: break-continue
code: |
  # break stops the loop entirely
  for n in range(10):
      if n == 4:
          break
      print(f"n: {n}")

  print("---")

  # continue skips the rest of this pass and goes to the next
  for n in range(5):
      if n == 2:
          continue
      print(f"m: {n}")
---

# `break` ends the loop. `continue` skips one pass.

Two loop-control keywords. Both work in `for` and `while` loops. AI uses
them constantly to bail out early or skip a single bad item.

- `break` — exit the loop right now, don't finish the rest
- `continue` — abandon this pass, jump to the next iteration

Run the code on the right.

- The first loop counts `0, 1, 2, 3` and then `break` ends it before `4`
- The second loop counts `0, 1, 3, 4` — `continue` skips `2` but the loop
  keeps going

The trap: `break` is final. If you put it inside an `if` that's always true,
the loop runs exactly once. We'll fix one of those in a minute.
