class Book:
    def __init__(self, title, author, pages):
        self.title=title; self.author=author; self.pages=pages
    def summary(self):
        return f"{self.title} by {self.author}, {self.pages}p"
for b in [Book("Dune","Herbert",412), Book("1984","Orwell",328)]:
    print(b.summary())
