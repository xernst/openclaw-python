# Chapter 14 — Files & `pathlib`

Once you can read/write files, you can automate anything — logs, JSON data, markdown notes, CSVs, configs, caches.

## 14.1 `pathlib` — the modern way

Forget `os.path` string gymnastics. `pathlib.Path` is the 2026 default.

```python
from pathlib import Path

home = Path.home()            # ~
cwd = Path.cwd()              # current working dir
p = home / "Documents" / "notes.md"

p.exists(); p.is_file(); p.is_dir()
list(p.parent.iterdir())      # direct children
list(p.parent.rglob("*.md"))  # recursive
p.name; p.stem; p.suffix; p.parent
p.resolve()                   # absolute
```

`/` between Paths joins them correctly across platforms.

## 14.2 Reading a file

```python
text = p.read_text(encoding="utf-8")
data = p.read_bytes()
```

For huge files, stream line-by-line with a context manager:

```python
with p.open(encoding="utf-8") as f:
    for line in f:
        ...
```

The `with` block guarantees the file closes, even on exceptions. **Always use it.**

## 14.3 Writing a file

```python
p.write_text("hello\n", encoding="utf-8")     # overwrites
p.write_bytes(b"\x00\x01")

with p.open("a", encoding="utf-8") as f:      # append
    f.write("more\n")
```

Modes:
- `"r"` read (default)
- `"w"` write (overwrite)
- `"a"` append
- `"x"` create-only (fails if exists)
- `"b"` binary suffix, e.g., `"rb"`, `"wb"`

## 14.4 Create directories safely

```python
(home / "logs").mkdir(parents=True, exist_ok=True)
```

- `parents=True` — create missing intermediates.
- `exist_ok=True` — don't error if already there.

## 14.5 JSON

```python
import json
data = json.loads(p.read_text(encoding="utf-8"))          # parse
p.write_text(json.dumps(data, indent=2), encoding="utf-8") # write
```

`json.dumps`/`json.loads` use strings; `json.dump`/`json.load` take a file object.

## 14.6 CSV

```python
import csv
with p.open(newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    rows = [row for row in reader]

with out.open("w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name","age"])
    writer.writeheader()
    for r in rows: writer.writerow(r)
```

(Chapter 25 goes deeper with pandas.)

## 14.7 Walking a tree

```python
for path in root.rglob("*.md"):
    if "draft" in path.name.lower():
        print(path.relative_to(root))
```

`rglob` is recursive. `glob` is just the current dir.

## 14.8 Copying, renaming, deleting

```python
import shutil
shutil.copy(src, dst)
shutil.move(src, dst)
p.rename(new_path)       # move/rename on same filesystem
p.unlink(missing_ok=True) # delete file
shutil.rmtree(dir_path)  # delete directory recursively (careful\!)
```

## 14.9 Temporary files

```python
import tempfile
with tempfile.NamedTemporaryFile("w", delete=False) as f:
    f.write("scratch")
    scratch_path = Path(f.name)
```

## 14.10 Always specify `encoding="utf-8"`

Default encoding varies by OS. Always pass `encoding="utf-8"` for portability.

## Vibe-Coding Corner

- **Internalize:** `Path` joining, `read_text`/`write_text`, `rglob`, `json.loads/dumps`, `mkdir(parents=True, exist_ok=True)`.
- **Skim:** `os.walk` (older API), file descriptors, text vs binary nuances.
- **AI gets wrong:** uses `os.path.join("a","b")` instead of `Path("a") / "b"`; forgets `encoding="utf-8"`; uses `open(...)` without `with` (leaks handles).
