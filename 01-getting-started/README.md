# Chapter 1 — Getting Started

You know "Hello, World\!" exists. Cool — we're skipping it. By the end of this chapter you can already print dynamic output, leave readable comments, do math in the REPL, and tell the difference between `print()` and its many siblings.

## 1.0 Install & sanity-check

In a terminal:

```bash
python3 --version
```

You want **3.12** or newer. If you get something older or "command not found," install from https://www.python.org/downloads/ or use `brew install python@3.12` on macOS.

## 1.1 Three ways to run Python

### The REPL — interactive playground

```bash
python3
```

You'll see `>>>`. Anything you type is evaluated right away.

```
>>> 2 + 2
4
>>> "hi" * 3
'hiihihi'
>>> exit()
```

Use the REPL when you want to *try something small*. It's the fastest feedback loop in programming.

### A `.py` file

Save code into a file like `hello.py`, then:

```bash
python3 hello.py
```

Python runs top to bottom, then stops.

### VS Code

Open the file, click the ▶ Run Python File button in the top right. The output appears in the integrated terminal.

> **Note:** VS Code sometimes runs files in a "debug console" that handles `input()` weirdly. For anything that uses `input()`, run from the terminal.

## 1.2 `print()` — your first microscope

`print(*args, sep=' ', end='\n', file=sys.stdout, flush=False)`

That's the full signature. You'll use it constantly. Every argument is stringified and joined by `sep` (default a space), then `end` is appended (default a newline).

```python
print("Learning Python in 2026")
print(7 * 6)                          # 42
print("two", "separate", "args")      # two separate args
print("a", "b", "c", sep="-")         # a-b-c
print("no newline", end=" ")
print("<- same line")
```

### Printing things that aren't strings

`print()` calls `str()` on each argument automatically. So you can print numbers, lists, dicts, anything. To see the "developer" form of a value (e.g., quotes around strings), use `repr()`:

```python
print("hi")         # hi
print(repr("hi"))   # 'hi'
```

Use `repr()` in debug output so you can see whether a value is the string `"42"` or the number `42`.

## 1.3 Comments

```python
# a full-line comment
x = 5  # inline comment
```

Python ignores everything from `#` to end of line.

For multi-line explanations, either stack `#` lines or use a triple-quoted string (called a *docstring* when at the top of a module, function, or class):

```python
"""
This file demonstrates the print function and its options.
"""
```

A stand-alone triple-quoted string isn't technically a comment — Python *evaluates* it but throws away the value — so by convention use them only at the top of files, functions, and classes.

## 1.4 The Zen of Python

In the REPL, try `import this`. It prints the *Zen of Python* — 19 aphorisms that guide the language's style. Internalize two:

- *Readability counts.*
- *There should be one — and preferably only one — obvious way to do it.*

## 1.5 Errors you'll see immediately

If you mistype `prin("hi")` you get `NameError: name 'prin' is not defined`.
If you forget a quote: `SyntaxError: EOL while scanning string literal`.
These are helpful. Read the **last line** of the traceback first — that's usually the real error.

## Vibe-Coding Corner

- **Internalize:** the three ways to run Python, the `print()` signature, the distinction between `str()` and `repr()`, reading the last line of a traceback.
- **Skim:** byte-strings, I/O redirection via `file=`, `sys.stdout` details.
- **AI gets wrong:** sometimes uses `print ("hi")` with a space (works but non-idiomatic), or uses `print("%s" % x)` (works but outdated — prefer f-strings).

## Go do

1. Run `01_lesson.py`.
2. Do `exercise_1.py` through `exercise_5.py`.
3. Peek at solutions only after trying.
4. Quiz yourself with `CHECKPOINT.md`.
