"""Chapter 12 — Scope, *args, **kwargs, lambdas."""

MAX_RETRIES = 3

def fetch():
    tries = 0
    while tries < MAX_RETRIES:
        tries += 1
    return tries

print(fetch())

# closure + nonlocal
def make_counter():
    n = 0
    def inc():
        nonlocal n
        n += 1
        return n
    return inc

c = make_counter()
print(c(), c(), c())

# *args
def broadcast(topic, *messages):
    for m in messages: print(topic, m)
broadcast("Main", "hi", "ready", "ship")

# **kwargs
def log_event(kind, **fields):
    print(kind, fields)
log_event("click", user="ava", page="/home")

# unpack at call site
nums = [1,2,3]
print(*nums)
opts = {"sep":"-","end":"\!\n"}
print("a","b","c", **opts)

# sort with lambda
people = [{"name":"Bea","age":40},{"name":"Ava","age":22},{"name":"Cai","age":31}]
people.sort(key=lambda p: p["age"])
print(people)

# map with already-named function (good)
strings = ["1","2","3"]
print(list(map(int, strings)))
