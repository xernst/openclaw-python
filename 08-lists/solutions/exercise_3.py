items = ["a","b","a","c","b","d"]
unique=[]
for x in items:
    if x not in unique: unique.append(x)
print(unique)
