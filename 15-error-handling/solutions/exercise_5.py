d={"a":1,"b":2}
# LBYL
v1 = d["c"] if "c" in d else 0
# EAFP
try: v2 = d["c"]
except KeyError: v2 = 0
print(v1, v2)
