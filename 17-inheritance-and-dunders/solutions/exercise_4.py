class Coord:
    def __init__(self,x,y): self.x,self.y = x,y
    def __eq__(self, o): return isinstance(o,Coord) and (self.x,self.y)==(o.x,o.y)
    def __hash__(self): return hash((self.x,self.y))
    def __repr__(self): return f"Coord({self.x},{self.y})"
s = {Coord(1,1), Coord(2,2), Coord(1,1)}
print(s)
