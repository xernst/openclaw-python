---
xp: 1
estSeconds: 95
concept: while-loop
code: |
  count = 3
  while count > 0:
      print(f"countdown: {count}")
      count -= 1

  print("liftoff")
runnable: true
---

# `while` keeps going until the condition flips

A `for` loop runs once per item in a collection. That's the right
shape when you have a known list of things — three users, ten files,
five rows. But sometimes you don't know how many times the loop will
run. You want it to keep going *until something happens*:

- *Keep retrying until the API responds.*
- *Loop until the user types quit.*
- *Pop messages off the queue until it's empty.*

For all of those, AI reaches for `while`. The first cousin of `for`,
and a slightly more dangerous one.

## The mental model: a condition checked at the top of every pass

```python
while count > 0:
    print(f"countdown: {count}")
    count -= 1
```

A `while` loop runs in three phases, like `for`, but the order is
different:

1. **Check the condition.** Right at the top, Python evaluates `count
   > 0`. If `True`, run the body. If `False`, skip the body and exit
   the loop.
2. **Run the body.** All the indented lines fire, in order.
3. **Loop back to the top.** Re-check the condition. Repeat.

The condition is *only checked at the top*. If the body changes
something halfway through, the loop doesn't notice until the next
iteration begins.

## A worked example

The editor on the right counts down from 3:

| Pass | `count` is... | Condition? | Body output | Body changes |
|------|---------------|------------|-------------|--------------|
| 1    | `3`           | `True`     | `countdown: 3` | `count = 2` |
| 2    | `2`           | `True`     | `countdown: 2` | `count = 1` |
| 3    | `1`           | `True`     | `countdown: 1` | `count = 0` |
| 4    | `0`           | `False`    | (skipped — loop ends) | — |

After the loop ends, the script moves on to `print("liftoff")`.

The key move: **`count -= 1`**. Without that line, the condition
never changes, and the loop runs forever. We need to talk about that.

## The infinite-loop trap

A `while` loop has *no built-in stopping point*. The loop only ends
when the condition flips false. If the body never moves toward false,
the loop runs forever — until you kill the process or the browser
tab freezes.

```python
count = 3
while count > 0:
    print("forever")     # NO update to count — INFINITE LOOP
```

Don't run that one. The shape is identical to a working countdown,
minus the `count -= 1`. That's *one missing line* between "works
fine" and "your script never terminates."

## Where AI specifically gets `while` wrong

Two patterns to watch for in code Cursor writes:

1. **The "wait for the API" loop with no exit.** AI sometimes writes
   `while not response:` and then doesn't put a sleep, a retry
   counter, or a bail-out inside. If the API never responds, you have
   a tight infinite loop hammering the network. Real production
   `while` loops should *always* have a maximum iteration count or a
   timeout.

2. **`while True:` without a `break`.** This is a legitimate pattern —
   "loop forever, until something inside says stop" — but it's only
   safe if there's an unmissable `break` somewhere in the body. Cursor
   sometimes writes `while True:` and then guards the `break` with a
   condition that's never true, producing an infinite loop disguised
   as a finite one.

When you see `while` in AI code, your first reading habit should be:
*"what changes inside the body to eventually flip the condition, and
am I sure that change actually happens?"* If you can't answer, the
loop is probably broken.

Run the editor. Three iterations, then `liftoff`.
