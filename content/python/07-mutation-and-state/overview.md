## The bug class that takes the longest to find

You write a function that takes a list, modifies it, and returns. The function works in your test. You ship it. Two weeks later a customer reports that their data is wrong. You investigate, and discover that the list passed *into* your function got modified, even though the function only "looks like" it works on a local copy.

That's mutation. Specifically, *unintended* mutation — modifying a value that the caller still has a reference to. It's the bug class that doesn't crash, doesn't warn, and silently corrupts state across function boundaries. AI ships this constantly because it's pattern-matching code that worked locally without thinking about who else holds a reference to that list.

This chapter is about reading code well enough to spot when mutation is happening, and writing code that doesn't trip the trap.

## The mental model: lists are pointers, not boxes

When you write `users = [{"name": "alice"}]` and then `friends = users`, you don't have two lists. You have *one* list with two names pointing at it. Modify `friends.append({"name": "bob"})` and `users` also has Bob now, because they're the same list.

This is the most consequential thing about Python that intro courses gloss over. Lists, dicts, sets, custom objects — all *mutable* — are passed by reference. Strings, ints, floats, tuples, frozensets — all *immutable* — are conceptually passed by value. (Technically Python passes references for everything; the immutable ones just can't be changed in place, so the distinction doesn't matter.)

When you pass a list to a function, the function gets a reference to the same list. Modify it inside the function, and the caller sees the modification. Most of the time this is what you want. The other times — *aliasing accidents* — are where bugs live.

## What this chapter covers in two lessons

**Lesson 1: Why it breaks.** The shape of an aliasing bug, demonstrated end-to-end: original list → pass to function → function modifies → caller's list is now different. Includes the canonical AI-shipped version of this bug ("just sort the list" silently mutating the caller's data) and the fix.

**Lesson 2: Copy versus reference.** When you actually want a new list versus when sharing one is fine. The shallow-copy (`list.copy()`, `dict.copy()`, `[*items]`) versus deep-copy (`copy.deepcopy`) distinction. The single most common AI mistake here: shallow-copying a list of dicts and being surprised when modifying a dict in the copy also modifies the dict in the original (because the *dicts* were shared, even though the *list* was copied).

## What AI specifically gets wrong about mutation

Three patterns:

1. **Passing a list to a function and not realizing the function will mutate it.** Cursor writes `def normalize(items): items.sort(); return items` and the caller's list is now sorted in place. Tests pass. Production breaks when a different caller relied on the original order. Lesson 1 step 4 is fixing this.

2. **Returning the same dict that was passed in, with one field changed.** Looks like a transformation. Is actually mutation in disguise. Lesson 2 covers the right pattern: return a new dict with `{**input, "field": new_value}`.

3. **Shallow copy of nested data.** `users.copy()` doesn't deep-copy the dicts inside. Modify a dict in the "copy" and the original sees it. AI ships this when asked to "make a defensive copy." Lesson 2 has it as a fix-the-bug step.

## What you'll be able to do at the end

Two lessons, ~17 steps. By the end you'll be able to:

- Spot when a function is mutating a caller's data, in code review, in 30 seconds.
- Distinguish aliasing from copying in any Python snippet.
- Use shallow versus deep copy correctly.
- Catch the three top "AI shipped mutation wrong" patterns.

Mutation bugs are the longest-to-debug bug class in Python — sometimes weeks to track down — because they don't crash, just produce wrong values somewhere downstream. This chapter is the inoculation. Read it once and you'll never lose three days to an aliasing bug again.

Press *Start chapter* below.
