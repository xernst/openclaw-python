temps_c = [0, 15, 22, 28, 31, 37, 40]
temps_f = [c*9/5+32 for c in temps_c]
hot = [c for c in temps_c if c >= 30]
print(temps_f); print(hot)
