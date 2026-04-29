"""Chapter 11 — Functions."""

def score_posting(title: str, salary: int) -> int:
    """Return a 0-100 relevance score."""
    s = 50
    if "AI" in title or "LLM" in title: s += 20
    if "Product" in title: s += 10
    if salary >= 180_000: s += 15
    elif salary >= 140_000: s += 5
    return min(s, 100)

print(score_posting("AI Product Lead", 200_000))
print(score_posting("Junior Analyst", 75_000))

# mutable-default trap — don't do this
def bad(items=[]):
    items.append("x")
    return items

print(bad())           # ['x']
print(bad())           # ['x','x']  — surprise (shared\!)

def good(items=None):
    items = [] if items is None else items
    items.append("x")
    return items

print(good()); print(good())

# keyword-only args
def send(*, topic, message, silent=False):
    return f"{'[SILENT] ' if silent else ''}[TOPIC: {topic}] {message}"

print(send(topic="Main", message="hello"))
# send("Main", "hello")  # TypeError: needs keyword

# Multiple return values
def stats(nums):
    return min(nums), max(nums), sum(nums)/len(nums)

lo, hi, avg = stats([3,1,4,1,5,9,2,6])
print(lo, hi, avg)

# guard clause
def categorize(tags):
    if not tags: return "inbox"
    if "archive" in tags: return "archive"
    if "project" in tags: return "projects"
    return "resources"

print(categorize([]))
print(categorize(["project","test"]))
print(categorize(["archive"]))

# functions as first-class values
def add(a,b): return a+b
def mul(a,b): return a*b
ops = {"+": add, "*": mul}
print(ops["+"](2,3))
print(ops["*"](4,5))
