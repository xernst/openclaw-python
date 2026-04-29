points = [(0,0),(0,5),(3,0),(3,4)]
for p in points:
    match p:
        case (0, 0): print(p, "origin")
        case (0, y): print(p, f"y-axis at {y}")
        case (x, 0): print(p, f"x-axis at {x}")
        case (x, y): print(p, f"at ({x},{y})")
