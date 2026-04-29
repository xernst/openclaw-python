"""Chapter 14 — pathlib, read/write, JSON, walking."""
from pathlib import Path
import json

here = Path(__file__).parent
work = here / "workspace"
(work / "subdir").mkdir(parents=True, exist_ok=True)

note = work / "note.md"
note.write_text("# Chapter 14\n\n- hello\n- world\n", encoding="utf-8")

# Read
print(note.read_text(encoding="utf-8"))

# Append
with note.open("a", encoding="utf-8") as f:
    f.write("- appended line\n")

# Walk
for p in work.rglob("*"):
    print(p.relative_to(work), p.is_dir())

# JSON
data = {"items":[1,2,3],"ok":True}
(work / "data.json").write_text(json.dumps(data, indent=2), encoding="utf-8")
loaded = json.loads((work / "data.json").read_text(encoding="utf-8"))
print(loaded)
