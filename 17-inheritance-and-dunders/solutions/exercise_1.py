class Animal:
    def __init__(self,name): self.name=name
    def speak(self): return "..."
class Dog(Animal):
    def speak(self): return "woof"
class Cat(Animal):
    def speak(self): return "meow"
class Cow(Animal):
    def speak(self): return "moo"
for a in [Dog("Rex"), Cat("Whiskers"), Cow("Bessie")]:
    print(a.name, a.speak())
