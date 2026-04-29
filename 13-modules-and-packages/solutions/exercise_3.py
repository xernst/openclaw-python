def summary(p, f):
    total = p + f
    return f"{p}/{total} passed ({p/total:.0%})"

if __name__ == "__main__":
    print(summary(12, 3))
