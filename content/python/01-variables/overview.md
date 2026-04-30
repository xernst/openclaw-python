## Names are 80% of what reading code is

When you read AI-generated Python — and you will, all day long — most of what you're reading is a constellation of named values being passed around. Variables. The model invents a name, sticks a value on it, refers to it three lines later, passes it to a function, gets a different value back, names that one too. The whole script is a tree of names with values stuck on them.

If you can't read those names on sight, you can't read the code. Variables aren't the easy part of programming you skip past on your way to "the real stuff." They're the substrate. This chapter puts them in your hands.

## The mental model that actually works

Forget "container." Forget "memory location." Both are technically true and neither is useful when you're staring at a Cursor diff. The model that makes Python click is much smaller: **labels stuck on values**.

Right side first. Python evaluates whatever's on the right of the `=`. Then it sticks a label — the name — on the result. Anywhere you later use the name, Python looks at the label and finds the value.

```python
score = 7
```

Read that out loud: *the value seven, with a label called `score` stuck on it*. Two lines later when you write `score + 1`, Python looks at the label `score`, finds the seven, adds one, gets eight. That's the entire mental model. Every variable you'll ever see is some version of this.

## What this chapter covers in three lessons

**Lesson 1: Naming things you'll point AI at.** Valid names, the four basic types you'll see daily, and the rebind rule (when the same name shows up twice on the left side of `=`, the second one replaces the first). The most common reason AI ships subtly wrong code in this category is forgetting which value the name points to *right now*.

**Lesson 2: The four types you'll see daily.** `int`, `float`, `str`, `bool`. Reading their differences on sight (no, `"7"` and `7` are not the same thing). The exact bug Cursor produces when it pattern-matches a string where it wanted a number, and how Python's traceback tells you which line.

**Lesson 3: `print`, `repr`, and the f-string.** How to format any value into a sentence — the single most-used Python pattern, period. F-strings replaced `.format()` and `%` formatting years ago, and modern AI-generated code should use them exclusively. We'll look at when AI doesn't.

## What AI specifically gets wrong about variables

Three patterns that ship into Cursor diffs you'll review:

1. **Reusing a name for a different purpose.** AI rebinds `data` from a list to a dict to a string across ten lines, and by line ten the type isn't what the function below expects. Spotting "wait, what type is this name now?" is half of debugging Python in 2026.

2. **Off-by-one in string formatting.** F-strings are forgiving but not magic. Cursor sometimes writes `f"score: {score+1}"` when the intent was the previous score. The output looks reasonable; it's wrong. Lesson 3 step 6 is fixing this.

3. **`==` vs `is` confusion.** Subtle, infrequent, but catastrophic when it happens. `is` checks identity, `==` checks equality. AI sometimes ships `if x is "foo":` because that pattern works for `None`, and the test passes by accident on small strings (CPython interns short strings). Goes wrong on longer ones. We touch this in chapter 5 properly; this chapter just plants the flag.

## What you'll be able to do at the end

Three lessons, ~26 steps. By the end you'll be able to:

- Read any Python file and answer two questions in under five seconds: which names are valid, and what value does each name point at right now.
- Spot the four basic types on sight (int, float, str, bool, plus the special-case None).
- Format any value into a sentence with f-strings, including the AI-generated variations of this pattern.
- Catch the three top "AI got the variable wrong" patterns in code review.

This is the keystone for the rest of the course. Functions assume you can read names. Lists and dicts are made of names. Loops iterate over names. Every chapter from here references the muscle this chapter builds.

Press *Start chapter* below.
