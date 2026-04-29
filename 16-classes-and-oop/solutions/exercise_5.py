class Movie:
    def __init__(self,title,year): self.title,self.year = title,year
    @classmethod
    def from_dict(cls, d): return cls(d["title"], d["year"])
    def __repr__(self): return f"Movie(title={self.title\!r}, year={self.year})"
m = Movie.from_dict({"title":"Inception","year":2010})
print(m)
