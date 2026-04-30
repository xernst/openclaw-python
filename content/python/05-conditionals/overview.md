## Where AI silently bugs

`if` looks like the simplest thing in programming. *If this is true, do that, otherwise do this other thing.* Two pages of any intro book. Skip-pastable.

Except `if` is also where AI quietly ships some of the most expensive bugs you'll see, because the conditions inside it are full of traps:

- `if user:` evaluates to `False` when `user` is `None`, an empty string, an empty list, or `0`. AI sometimes ships this when the intent was *"only proceed if the user variable is set"* and the variable being `0` was a perfectly valid value.
- `if x == None:` is technically valid but `if x is None:` is the right answer, and AI mixes them.
- `if response.status_code:` is `False` when the status is `0`, which is never. So always `True`. So the condition does nothing. Lesson 1 has this as a predict-the-output step.

This chapter is the small list of conditional traps that bite AI-generated Python, plus the modern `match` statement that the model uses surprisingly often.

## The mental model: truthy versus falsy

Every Python value can be tested in an `if` statement. Some values count as "true" and some as "false." The empty/zero/None cases count as false:

| False (counts as `False` in `if`) | True (counts as `True`) |
|---|---|
| `False` | `True` |
| `None` | any non-empty string |
| `0`, `0.0` | any non-zero number |
| `""` (empty string) | any non-empty list |
| `[]` (empty list) | any dict with at least one key |
| `{}` (empty dict) | any object |

This is the **truthiness rule**. It's why `if some_list:` works as "is the list non-empty" — a Pythonic shorthand that AI uses correctly most of the time, and ships a subtle bug with the rest.

## What this chapter covers in two lessons

**Lesson 1: Truthiness bugs.** The big trap — when `if x:` does and doesn't do what AI thinks it does. Specifically the four times Cursor ships subtly wrong conditions: empty-string vs missing-string, `0` vs `None`, `False` vs unset, and `[]` vs `[0]`. Plus the `==` vs `is` distinction that haunts `None` checks.

**Lesson 2: `elif` and `match`/`case`.** The right way to write a multi-branch decision tree. Python 3.10 added `match`/`case` (pattern matching), AI ships it more often now, and you'll learn to read it. Includes the bug pattern of using `if/elif` chains that overlap (multiple branches matching) when the intent was mutually exclusive.

## What AI specifically gets wrong about conditionals

Three patterns:

1. **Truthy traps.** `if user_id:` fails to match a real user with id `0`. `if items:` skips the legitimate case of an explicit empty list. Lesson 1 step 4 is fixing this.

2. **`==` vs `is` for `None`.** Both work *most* of the time, but `is None` is the official idiom and the only one that's guaranteed to do the right thing on edge cases (overloaded `__eq__` methods, sentinel objects). Lesson 1 covers it.

3. **Overlapping `if/elif` branches.** When the intent was "exactly one branch fires," AI sometimes writes branches that can both match. The bug is invisible in unit tests with disjoint inputs and explodes in production. Lesson 2 has a fix-the-bug step.

## What you'll be able to do at the end

Two lessons, ~17 steps. By the end you'll be able to:

- Predict whether any `if` condition will fire on a given value, including the truthy/falsy edge cases.
- Spot the three top "AI shipped this wrong" conditional bugs.
- Read a Python 3.10+ `match`/`case` block and reason about which branch fires.
- Use `is None` correctly (and know when `==` is wrong).

Conditionals show up in every chapter from here. Chapter 6 (tracebacks) reads conditional logic in the call stack. Chapter 9 (error handling) is `try/except`, which is structurally similar. Chapter 16 (agent loops) is one giant conditional on `stop_reason`. Get the truthy rules in your hands here and the rest reads obvious.

Press *Start chapter* below.
