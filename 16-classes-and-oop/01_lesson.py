"""Chapter 16 — Classes & OOP."""

class Participant:
    count = 0   # class attribute

    def __init__(self, name: str, bugs_found: int = 0):
        self.name = name
        self.bugs_found = bugs_found
        Participant.count += 1

    def log_bug(self):
        self.bugs_found += 1

    @classmethod
    def total(cls):
        return cls.count

    @staticmethod
    def normalize(name: str) -> str:
        return name.strip().title()

    def __repr__(self):
        return f"Participant(name={self.name\!r}, bugs_found={self.bugs_found})"

    def __str__(self):
        return f"{self.name} ({self.bugs_found} bugs)"

a = Participant("ana")
b = Participant("BEN", bugs_found=3)
a.log_bug(); a.log_bug()
print(a, "|", repr(a))
print(b)
print("total:", Participant.total())
print("normalized:", Participant.normalize("  anA  "))

# property example
class Account:
    def __init__(self, balance=0):
        self._balance = balance
    @property
    def balance(self): return self._balance
    @balance.setter
    def balance(self, v):
        if v < 0: raise ValueError("negative")
        self._balance = v

acc = Account()
acc.balance = 50
print("balance:", acc.balance)
try: acc.balance = -1
except ValueError as e: print("err:", e)
