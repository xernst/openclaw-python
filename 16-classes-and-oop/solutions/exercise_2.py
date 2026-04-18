class User:
    count = 0
    def __init__(self, name):
        self.name = name; User.count += 1
    @classmethod
    def total(cls): return cls.count
for n in ["Ava","Bea","Cai"]: User(n)
print(User.total())
