class Employee:
    def __init__(self, name, salary):
        self.name=name; self.salary=salary
class Manager(Employee):
    def __init__(self, name, salary, reports=None):
        super().__init__(name, salary)
        self.reports = reports or []
    def give_raise(self, amount):
        self.salary += amount
m = Manager("Ava", 100_000, ["Bea","Cai"])
m.give_raise(5_000)
print(m.name, m.salary, m.reports)
