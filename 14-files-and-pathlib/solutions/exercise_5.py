from pathlib import Path; import csv
here = Path(__file__).parent.parent
p = here / "workspace" / "people.csv"
p.parent.mkdir(parents=True, exist_ok=True)
with p.open("w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["name","age"])
    w.writeheader()
    for n, a in [("Ana",22),("Ben",31),("Cat",40)]: w.writerow({"name":n,"age":a})
with p.open(newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f): print(row)
