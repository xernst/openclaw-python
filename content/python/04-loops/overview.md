## The half of programming that AI writes wrong by one

Every time you say *"for each user, do X"* to Cursor, Cursor writes a loop. It's the most common control structure in Python and the place AI ships the most off-by-one bugs in the world. Wrong index on the boundary. Skipped first element. Iterated one past the end. The kind of bug that doesn't crash, just produces subtly wrong numbers that you don't notice for a week.

This chapter is reading loops well enough to predict their output before you run them, and writing the few patterns Python prefers over the ones AI defaults to.

## The mental model: the same machine, with a counter

A loop is a single machine that runs over and over with one input changing each time. The input is whatever you're looping over — a list of users, a range of numbers, the lines of a file. The body is the same code each iteration. Python tracks the current value and the next one for you.

```python
for user in users:
    print(user.name)
```

Read that as: *for each user in the list of users, print that user's name*. The variable `user` exists only inside the loop body and points to a different element each time around. After the loop ends, `user` lingers (Python doesn't unbind it), holding the last element.

Two flavors of loop matter for daily AI work:

- **`for` loops** — when you know what you're iterating over (a list, a range, a dict).
- **`while` loops** — when you don't know how many iterations until the exit condition fires.

In modern Python you reach for `for` 95% of the time. `while` shows up in agent loops (chapter 16) and retry-with-backoff patterns (chapter 9). This chapter gets both into your hands.

## What this chapter covers in three lessons

**Lesson 1: Predict the output.** Reading a loop, tracing it by hand, and predicting what it prints before clicking Run. The single most useful drill in this chapter — once you can predict loop output cold, you can spot bugs in code review without running anything.

**Lesson 2: While and break.** When `while` is the right tool, the `break` and `continue` statements, and the most common AI bug: writing `while True` with a `break` deep inside that fires only sometimes. Includes the agent-loop preview that chapter 16 builds out.

**Lesson 3: `enumerate` and `zip`.** The two helpers Python prefers over manual index counting. AI sometimes writes `for i in range(len(items)): item = items[i]` when `for i, item in enumerate(items)` is shorter and harder to mess up. AI also sometimes writes nested loops over two parallel lists when `zip` is the cleaner answer. We drill both.

## What AI specifically gets wrong about loops

Three patterns:

1. **Off-by-one on `range`.** `range(10)` is `0..9`, not `1..10`. AI sometimes writes `range(1, len(items))` and skips the first element. Lesson 1 has a predict-the-output step on exactly this.

2. **Mutating the list you're iterating.** `for item in items: items.remove(item)` skips elements because the list shifts mid-iteration. The fix is to iterate `list(items)` (a copy) or build a new list with a comprehension. Lesson 2 covers it.

3. **Manual index counting instead of `enumerate`.** `for i in range(len(items)):` is a tell that AI is writing C-style loops in Python. The Pythonic version is shorter and resists off-by-one. Lesson 3 drills the swap.

## What you'll be able to do at the end

Three lessons, ~28 steps. By the end you'll be able to:

- Read any `for` or `while` loop and predict its output without running it.
- Spot the three top "AI shipped this wrong" loop bugs in code review.
- Reach for `enumerate`, `zip`, and list comprehensions instead of manual index counting.
- Recognize when `while True: ... break` is right and when it's just bad style.

Loops are the machine in every script. Chapter 16 (agent loops) is the most-cited downstream use of this chapter. Chapter 21 (evals) iterates over test cases. Chapter 22 (capstone) is one giant `while` loop. The patterns you learn here repeat everywhere.

Press *Start chapter* below.
