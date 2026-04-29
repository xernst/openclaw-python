from pathlib import Path
here = Path(__file__).parent.parent
path = here / "workspace" / "daily" / "2026-04-17.md"
path.parent.mkdir(parents=True, exist_ok=True)
path.write_text("---\ndate: 2026-04-17\ntags: [daily]\n---\n# 2026-04-17\n## Focus\n- \n", encoding="utf-8")
print(path.resolve())
