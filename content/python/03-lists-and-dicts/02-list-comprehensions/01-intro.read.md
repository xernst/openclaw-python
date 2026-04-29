---
xp: 1
estSeconds: 95
concept: list-comprehension-shape
code: |
  prices = [10, 20, 30]

  # the long way
  with_tax = []
  for p in prices:
      with_tax.append(p * 1.1)

  # the same thing as a comprehension
  with_tax_short = [p * 1.1 for p in prices]

  print(with_tax)
  print(with_tax_short)
runnable: true
---

# The one-liner AI reaches for nine times out of ten

Watch what happens the next time you ask Cursor for *a list of email
addresses from these users* or *the prices in dollars instead of
cents* or *every URL in lowercase*. It will not write a four-line
`for` loop with `.append`. It will write one line. That line is a
**list comprehension**.

This is the most common single-line construct in modern Python, and
roughly half of "I can't read AI's code" complaints from non-engineers
trace back to this exact syntax. Once you've internalized the shape,
the rest of the language opens up.

## The mental model: read it like English

A list comprehension is built from three pieces, in order:

```
[  expression   for item in iterable  ]
   ^new-value     ^source-loop
```

Read it left-to-right, **out loud** if it helps:

> *"a new list, where each item is `expression`, for every `item` in
> `iterable`."*

That's it. No new logic. It's the same `for` loop you already know,
collapsed onto one line and wrapped in `[ ]` to mark "this whole
thing is a list."

## The long way and the short way, side by side

The editor on the right has both forms doing exactly the same job:

```python
# the long way
with_tax = []
for p in prices:
    with_tax.append(p * 1.1)

# the comprehension
with_tax_short = [p * 1.1 for p in prices]
```

The long way is what you'd write if you'd never seen Python before.
Three lines of setup, loop, append. The comprehension says the same
thing in twelve characters less, with one less moving part — no
explicit empty list to start, no `.append` call.

When you read the comprehension, the trick is to *read the right side
first*: `for p in prices` tells you the source. Then read the left:
`p * 1.1` tells you what to do with each `p`. The brackets tell you
the result is a list.

## Why AI almost always writes it this way

Three reasons Cursor reaches for comprehensions:

1. **Less code to maintain.** One line vs. four.
2. **No empty-list-and-append boilerplate.** Less to get wrong.
3. **Faster at runtime.** Comprehensions are slightly faster than the
   manual loop because Python optimizes them internally. For tiny
   lists this doesn't matter; for big ones it does.

You'll start writing them yourself within a week of seeing them. They
become muscle memory.

## Where AI gets comprehensions wrong

The single most common mistake: nesting them so deep nobody can read
them. Cursor sometimes writes:

```python
emails = [u["email"] for team in org for u in team["members"] if u["active"]]
```

That's a *valid* comprehension, but it crams a lot into one line. When
you see one with two `for` clauses or an `if`, **break it into a real
loop** when you're reading. Six readable lines beat one clever line
every time.

Run the editor. Both lines print the same list — `[11.0, 22.0, 33.0]`.
Same output, two flavors of syntax.
