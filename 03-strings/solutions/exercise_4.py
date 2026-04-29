names  = ["Apple", "Banana", "Cherry"]
prices = [1.50, 0.75, 3.25]
for n, p in zip(names, prices):
    print(f"{n:<10}  $ {p:>5.2f}")
