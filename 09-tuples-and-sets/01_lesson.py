"""Chapter 9 — Tuples & Sets."""

# tuples
point = (3, 4)
x, y = point
print(x, y)

single = (5,)
not_a_tuple = (5)
print(type(single), type(not_a_tuple))

# tuples as dict keys
grid = {(0,0): "start", (1,2): "treasure"}
print(grid[(0,0)])

# immutability
try:
    point[0] = 99
except TypeError as e:
    print("can't mutate tuple:", e)

# set basics
tags = {"python","beginner","2026"}
tags.add("course"); tags.discard("beginner")
print(tags)
print("python" in tags)

# set algebra
a = {1,2,3,4}; b = {3,4,5,6}
print("|",a|b); print("&",a&b); print("-",a-b); print("^",a^b)

# dedup (order lost)
print(list(set([1,2,2,3,3,3,4])))
# dedup (order preserved, 3.7+)
print(list(dict.fromkeys([1,2,2,3,3,3,4])))

# empty-set gotcha
e = set(); d = {}
print(type(e), type(d))

# frozenset as a dict key
fs = frozenset({1,2,3})
m = {fs: "ok"}
print(m[frozenset({3,2,1})])
