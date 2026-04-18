from pathlib import Path; import json
here = Path(__file__).parent.parent
p = here / "workspace" / "data.json"
p.parent.mkdir(parents=True, exist_ok=True)
data = {"counts":{"a":1,"b":2},"active":True}
p.write_text(json.dumps(data, indent=2), encoding="utf-8")
loaded = json.loads(p.read_text(encoding="utf-8"))
print(loaded["counts"]["b"])
