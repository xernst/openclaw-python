from pathlib import Path
root = Path(__file__).parent.parent / "workspace"
for p in root.rglob("*.md"): print(p.relative_to(root))
