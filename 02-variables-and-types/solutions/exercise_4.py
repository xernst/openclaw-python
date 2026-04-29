for v in (3, 3.0, True, "3", None):
    print(v, isinstance(v, int))
# True is int -> True (because bool is a subclass of int)
