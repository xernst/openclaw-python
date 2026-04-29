---
xp: 1
estSeconds: 90
concept: assignment-operator
code: |
  user_score = 7
  print(user_score)

  user_score = 12
  print(user_score)
---

# `=` doesn't mean what it did in math class

This one trips up almost every non-coder exactly once, and then never
again. It's the highest-leverage three minutes you'll spend in this whole
chapter.

## In math, `=` is a question

`x = 7` in algebra is a *claim* that two things are equal. You can
rearrange it (`7 = x`), you can chain it (`x = y = 7`), and the equals
sign points both directions. It's a mirror.

## In Python, `=` is a command

`user_score = 7` in Python is *do this thing*: take the value on the
right, stick the label `user_score` on it. The arrow only points one way:

```
user_score  ←  7
```

You can't write `7 = user_score` in Python — it's a syntax error. Python
isn't asking whether they're equal. It's telling Python *put that label
on that value, now.*

## The rebind move (the part that confuses everyone)

Here's where AI-generated code looks contradictory if you carry the math
model. Look at the editor on the right:

```py
user_score = 7
print(user_score)

user_score = 12
print(user_score)
```

To a math brain, line 4 looks like a contradiction — *but you said
`user_score` was 7?* Python doesn't see a contradiction. It sees four
commands, in order:

1. *Stick the label `user_score` on the value 7.*
2. *Print whatever has that label.* → `7`
3. *Now stick the label `user_score` on the value 12 instead.* (The 7 is
   no longer labeled by anything.)
4. *Print whatever has that label now.* → `12`

Run the code and watch the printed value change. The variable is a label
you can move, not a fact you're declaring.

## Where AI specifically breaks this for you

The single most common pattern Cursor writes is the accumulator loop:

```py
total = 0
for item in items:
    total = total + item.price
```

`total` gets rebound on every iteration. The math brain reads `total =
total + item.price` as a contradiction — *total equals total plus
something? impossible.* The Python brain reads it as: *grab the current
value labeled `total`, add `item.price` to it, move the label to the new
sum.*

If you understand this one move, you can read 80% of the loops Cursor
will ever write you. That's not an exaggeration — accumulators show up
constantly in scoring, totaling, summarizing, list-building, and reduce
operations.

## One more thing: variables don't lock the type

Python lets the same label sit on a number, then a string, then a list,
across the life of the program:

```py
result = 0          # result is now an int
result = "ok"       # now it's a string
result = [1, 2, 3]  # now a list
```

This is called *dynamic typing*, and AI uses it more than you'd expect.
When a variable's type seems to change between lines, that's not a bug —
that's Python letting the label move to a totally different kind of
value. Sometimes it IS a bug, and the next chapter will teach you how to
spot the difference. For now, just know: the label has no opinion about
what it's stuck on.
