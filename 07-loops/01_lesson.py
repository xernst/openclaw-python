"""Chapter 7 — Loops."""

# for over list
for name in ["Ada", "Grace", "Donald"]:
    print("hi", name)

# for with range
for i in range(1, 6):
    print(i, i ** 2)

# while
count = 3
while count > 0:
    print("countdown", count); count -= 1

# break/continue
for n in range(10):
    if n == 7: break
    if n % 2 == 0: continue
    print("odd<7:", n)

# for/else
items = [1, 2, 3]
for x in items:
    if x < 0:
        print("negative"); break
else:
    print("all non-negative")

# enumerate
for i, name in enumerate(["alice","bob","carol"], start=1):
    print(f"{i}. {name}")

# zip
for n, p in zip(["alice","bob","carol"], [1.99, 4.50, 0.75]):
    print(n, p)

# comprehensions
print([n * n for n in range(1, 6)])
print([n for n in range(20) if n % 2 == 0])
print({n: n ** 2 for n in range(1, 4)})
print({ch.lower() for ch in "Hello"})

# nested
for row in range(1, 4):
    for col in range(1, 4):
        print(row * col, end="\t")
    print()
