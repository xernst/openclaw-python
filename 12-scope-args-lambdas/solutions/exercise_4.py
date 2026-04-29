def make_counter(start=0):
    n = start
    def inc():
        nonlocal n
        n += 1; return n
    return inc
a = make_counter(); b = make_counter()
print(a(),a(),a())   # 1 2 3
print(b())           # 1 (independent)
