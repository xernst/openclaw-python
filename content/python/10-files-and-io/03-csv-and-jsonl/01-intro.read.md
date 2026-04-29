---
xp: 1
estSeconds: 110
concept: csv-dictreader
code: |
  import csv
  from pathlib import Path

  Path("/tmp/users.csv").write_text(
      "name,role,age\n"
      "maya,admin,29\n"
      "marcus,viewer,34\n"
  )

  with open("/tmp/users.csv", newline="") as f:
      for row in csv.DictReader(f):
          print(row["name"], "->", row["role"])
runnable: true
---

# CSV — the format every AI dataset and spreadsheet export uses

Pull any dataset off Kaggle, export anything from Notion or
Salesforce, dump any database table to a file — you get a CSV. Cursor
ships CSV-handling code constantly: read this export, filter these
rows, write a cleaned version. Knowing the *one right shape* of that
code saves you from the four wrong ones AI alternates between.

The right shape is `csv.DictReader`. It reads each row as a dict
keyed by the header column names. You don't index by position
(`row[2]`), you index by column name (`row["age"]`), which means a
new column showing up next month doesn't break your code.

## The mental model

A CSV file is a plain text file where each line is a row and commas
separate the fields. The first line is usually the header — column
names — and every line after that is data:

```
name,role,age
maya,admin,29
marcus,viewer,34
```

`csv.DictReader` reads the first line, remembers the column names,
then yields each subsequent line as a dict mapping column name to
string value:

```python
{"name": "maya", "role": "admin", "age": "29"}
{"name": "marcus", "role": "viewer", "age": "34"}
```

Three things to internalize:

1. **All values are strings.** Even `"29"`. CSV has no type system —
   it's text. If you need an int, you `int(row["age"])` yourself.
2. **You iterate the reader.** It doesn't load the whole file into
   memory. `for row in reader:` streams one row at a time, which means
   it works on a 2GB CSV the same way it works on a 50-line file.
3. **You need `newline=""` on the `open` call.** This is the gotcha.
   Without it, Windows-style line endings can cause `csv.DictReader`
   to see blank rows. Always include it. Always.

## A worked example

The editor on the right writes a tiny CSV and reads it back:

```python
import csv
from pathlib import Path

Path("/tmp/users.csv").write_text(
    "name,role,age\n"
    "maya,admin,29\n"
    "marcus,viewer,34\n"
)

with open("/tmp/users.csv", newline="") as f:
    for row in csv.DictReader(f):
        print(row["name"], "->", row["role"])
```

The `with` block opens the file for reading. `csv.DictReader(f)`
wraps the file handle and yields one dict per data row. The loop
prints `name -> role` for each. Output:

```
maya -> admin
marcus -> viewer
```

`pathlib`'s `read_text` doesn't fit this case because `csv.DictReader`
wants a file-like object that yields lines, not a string. So we drop
back to `open(...)` here — that's the only time in this chapter
you'll see the old `open` shape. Remember `newline=""`.

## Where AI specifically gets this wrong

Three patterns to watch for in code Cursor writes you.

**One: `csv.reader` instead of `csv.DictReader`.** `csv.reader` gives
you a list per row — `["maya", "admin", "29"]`. You then have to
remember that index 0 is name, index 1 is role, index 2 is age.
That's brittle and unreadable. AI defaults to `csv.reader` because
it's older. Reach for `DictReader` unless you're explicitly working
with a header-less file.

**Two: forgetting `newline=""`.** Cursor will write `with open(p) as
f: csv.DictReader(f)` and ship it. On the developer's Mac it works.
On a teammate's Windows machine, every other row is empty. Add
`newline=""` every single time you open a file for `csv` work.

**Three: forgetting the values are strings.** `int(row["age"]) > 30`
works. `row["age"] > 30` is `"29" > 30` — a `TypeError` (Python 3
won't compare strings to ints). When you see CSV data being treated
like numbers without an explicit `int()` or `float()`, that's a bug
about to happen.

Run the editor. Pyodide's virtual filesystem makes the file write
real, and `DictReader` streams it back as dicts.
