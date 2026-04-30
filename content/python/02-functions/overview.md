## The single most-hallucinated bug AI ships

A function takes some inputs, does something, returns a value. Standard programming idea, taught in every intro course. So why does Cursor silently produce a function that does the work and then *forgets the return statement* about a third of the time?

Because the absence of a `return` is invisible in the source. The function body still runs. The variable still gets computed. The print statement that AI sometimes adds at the end still fires. The only thing missing is the line that hands the value back to whoever called it. The caller gets `None`, and your downstream code, which expected a number or a dict or a list, fails three steps later with an error message that points at the wrong place.

This chapter is about reading function definitions well enough to spot that missing return on sight, plus the other half-dozen function-shaped bugs AI produces fluently.

## The mental model: machine on a workbench

A function is a machine that takes inputs and produces an output. The arguments are what you put in the hopper. The body is what the machine does. The `return` statement is the chute the output comes out of. No `return`? The output never leaves the machine.

```python
def double(x):
    result = x * 2
    # bug: nothing returned. result is computed and discarded.
```

When you call `double(7)`, the machine runs, computes 14, and... drops it on the floor. You get `None` back because that's the default. AI does this constantly because in the *intermediate* layers of a deeply nested function call, the actual return is structurally identical to the variable assignment — you have to read carefully to spot which case is which.

The whole rest of this chapter is exercises that drill this distinction.

## What this chapter covers in three lessons

**Lesson 1: Return values.** What `return` does, what happens without it, and the AI-pattern of "computes the answer, doesn't return it." Steps include predicting what a function with a missing return will print, and fixing exactly that bug.

**Lesson 2: Arguments and defaults.** Required versus optional arguments, default values, the mutable-default-argument trap (a.k.a. `def f(x=[])` — one of the most famous bugs in Python), and the bug Cursor produces when it copy-pastes a default from a different function and breaks the new one.

**Lesson 3: Closures and decorators.** Higher-order functions made approachable: a function that returns a function, a decorator that wraps a function. AI ships decorators all the time (FastAPI, retry-on-failure, caching) — you'll learn to read them without flinching. Not to write them; to read what was already written.

## What AI specifically gets wrong about functions

Four patterns:

1. **Missing return.** The flagship bug. Lesson 1 step 6 is fixing it.
2. **Mutable default arguments.** `def append_user(user, users=[])` — the `users=[]` is created *once at definition time* and shared across every call. Add a user, the list grows. Call again with no `users` argument, the new user sees the previous user. AI ships this constantly. Lesson 2 has a step on it.
3. **Wrong argument order on call.** Functions with three positional arguments, AI swaps the second and third because it pattern-matched a similar function. Lesson 2 covers reading function signatures defensively.
4. **Forgetting `self` in a method.** When AI is writing a class, the method signature should be `def foo(self, x)`. Cursor sometimes writes `def foo(x)` and the class breaks. Chapter 11 covers this in detail; this chapter plants the flag.

## What you'll be able to do at the end

Three lessons, ~27 steps. By the end you'll be able to:

- Read any function definition and predict what calling it will return.
- Spot the missing-return bug on sight in 30 seconds of code review.
- Reason about default argument values without falling into the mutable-default trap.
- Read closures and decorators well enough to evaluate AI-generated code that uses them.

Functions are the unit AI ships in. Most diffs you'll review for the next year are "added/changed one function." Get this chapter solid and the bulk of code review reads obvious.

Press *Start chapter* below.
