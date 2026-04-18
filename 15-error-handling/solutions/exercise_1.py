try:
    n = int(input("number: "))
    print("doubled:", n*2)
except ValueError:
    print("not a valid number")
