---
xp: 1
estSeconds: 40
concept: mutation-vs-reassignment
code: |
  pets = ["luna", "moose"]

  def add_one(items):
      items.append("biscuit")

  add_one(pets)
  print(pets)
runnable: true
---

# A list passed to a function isn't a copy — it's the same list

Run the code on the right. The function `add_one` only ever sees `items`,
never `pets`. But after the call, `pets` has three items, not two.

That's because Python doesn't copy lists when it passes them. The function
parameter `items` and the outside variable `pets` point at the *same list
in memory*. When the function does `items.append`, the outside list changes
too.

This is the bug AI ships when you ask it to *just process the data*. It
silently mutates your input and the rest of your program runs on a
different list than you thought.

The technical term for this is **mutation**. Memorize it — when something
"mysteriously breaks," this is the first thing to check.
