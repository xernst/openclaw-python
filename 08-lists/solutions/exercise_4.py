people=[{"name":"Bea","age":40},{"name":"Ava","age":22},{"name":"Cai","age":31}]
people.sort(key=lambda p: p["age"])
print([p["name"] for p in people])
