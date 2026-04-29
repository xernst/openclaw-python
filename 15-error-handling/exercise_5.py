"""
Exercise 15.5 — EAFP vs LBYL.
Given `d={"a":1,"b":2}`, write two versions that safely read `d["c"]`
with default 0:
  v1 — LBYL using `if "c" in d:`
  v2 — EAFP using try/except KeyError
Print both results.
"""
d = {"a":1,"b":2}
# TODO
