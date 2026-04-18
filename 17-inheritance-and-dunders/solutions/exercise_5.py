class Playlist:
    def __init__(self): self.tracks = []
    def add(self, t): self.tracks.append(t)
    def __len__(self): return len(self.tracks)
    def __iter__(self): return iter(self.tracks)
    def __contains__(self, t): return t in self.tracks
pl = Playlist()
for t in ["a","b","c"]: pl.add(t)
print(len(pl), "b" in pl, list(pl))
