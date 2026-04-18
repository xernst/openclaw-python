from pathlib import Path; import json
here = Path(__file__).parent.parent
path = here / "workspace" / "logs" / "events.jsonl"
path.parent.mkdir(parents=True, exist_ok=True)
events=[{"ts":"09:00","level":"INFO","text":"started"},
        {"ts":"09:05","level":"WARN","text":"slow query"},
        {"ts":"09:06","level":"ERROR","text":"timeout"}]
with path.open("a", encoding="utf-8") as f:
    for e in events: f.write(json.dumps(e)+"\n")
for line in path.read_text(encoding="utf-8").splitlines(): print(line)
