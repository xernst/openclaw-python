class Temperature:
    def __init__(self, c=0.0): self._c = c
    @property
    def fahrenheit(self): return self._c * 9/5 + 32
    @fahrenheit.setter
    def fahrenheit(self, f): self._c = (f - 32) * 5/9
t = Temperature()
t.fahrenheit = 100
print(t.fahrenheit)
