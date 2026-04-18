from collections import defaultdict
words=["apple","ant","bat","ball","cat","car","dog"]
g = defaultdict(list)
for w in words: g[w[0]].append(w)
print(dict(g))
