total_seconds = 9875
h = total_seconds // 3600
m = (total_seconds % 3600) // 60
s = total_seconds % 60
print(f"{h}:{m}:{s}")
