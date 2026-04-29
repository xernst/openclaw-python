# Chapter 3 — Strings

Strings hold text. You'll touch them hourly — formatting output, parsing inputs, building prompts for LLMs, slicing filenames.

## 3.1 Creating strings

```python
a = "double"
b = 'single'
c = """triple quoted — can span
multiple lines."""
```

Use whichever doesn't conflict with quotes inside the text. Or escape with `\`:

```python
"She said \"hi.\""
'She said "hi."'          # easier — mix quote styles
```

## 3.2 f-strings — the modern way to format

An **f-string** embeds expressions in `{braces}`.

```python
name = "Ava"
score = 94.3
print(f"{name} scored {score}.")
print(f"{name} scored {score:.1f}%.")       # 94.3%
print(f"{name} scored {score / 100:.1%}.")  # 94.3%
print(f"{name = }")                         # debug form: name = 'Ava'
```

Format specifiers after `:` control display:

| Spec | Meaning |
|------|---------|
| `:d`     | integer |
| `:.2f`   | float, 2 decimals |
| `:,`     | thousands separators |
| `:.1%`   | percentage, 1 decimal |
| `:>10`   | right-align in width 10 |
| `:<10`   | left-align |
| `:^10`   | center |
| `:0>5`   | zero-pad to width 5 |
| `:04d`   | zero-pad int to width 4 |

F-strings are faster than `%`-formatting and `.format()`. Use them exclusively.

## 3.3 Useful methods

```python
s = "  Hello, Python\!  "

s.strip()                    # 'Hello, Python\!' — trim whitespace
s.lstrip(); s.rstrip()       # left/right only
s.lower(); s.upper(); s.title(); s.casefold()
s.replace("Python", "World")
s.split(",")                 # ['  Hello', ' Python\!  ']
"-".join(["a", "b", "c"])    # 'a-b-c'
s.startswith("  He"); s.endswith("\!  ")
"python" in s.lower()        # True
len(s)
s.count("l")
s.find("Py")                 # index, -1 if missing
s.index("Py")                # index, raises ValueError if missing
s.zfill(8)                   # zero-pad
```

Strings are **immutable**. Methods return NEW strings; the original isn't changed.

## 3.4 Indexing and slicing

```python
word = "python"
word[0]     # 'p'
word[-1]    # 'n'
word[0:3]   # 'pyt'   stop is exclusive
word[:3]    # 'pyt'
word[3:]    # 'hon'
word[::-1]  # 'nohtyp'  — full reverse
word[::2]   # 'pto'    — every other char
```

## 3.5 Escape characters

```python
"\n"   # newline
"\t"   # tab
"\\"   # literal backslash
"\""   # literal double-quote
"\'"   # literal single-quote
"\u2764"  # ❤  (Unicode code point)
```

## 3.6 Raw strings

Prefix with `r` to disable escape processing — handy for Windows paths and regex:

```python
r"C:\Users\Ava"          # literal backslashes
r"\d+"                   # regex: one or more digits
```

## 3.7 Concatenation vs. f-strings

```python
name = "Ava"
n = 3
"name: " + name + ", count: " + str(n)   # works, but ugly
f"name: {name}, count: {n}"              # cleaner
```

Avoid repeated `+` inside a loop — each `+` allocates a new string. Use `"".join(parts)` for that.

## 3.8 Encoding (know this exists)

Python strings are Unicode by default. Bytes are separate (`b"hello"`). You'll rarely care as a beginner except when reading/writing files: specify `encoding="utf-8"`.

## Vibe-Coding Corner

- **Internalize:** f-strings including format specs, `.strip()`, `.split()`, `.join()`, `.lower()`, slicing syntax, immutability.
- **Skim:** old `%`-formatting and `.format()` (you'll see them in legacy code, but don't write them).
- **AI gets wrong:** uses `"... %s" % x` or `"{}".format(x)` instead of f-strings; forgets `encoding="utf-8"` when reading files; mutates a string via `+=` in a hot loop.
