def is_strong_match(title, salary, min_salary=150_000):
    return ("AI" in title or "Product" in title) and salary >= min_salary
for t,s in [("AI PM",200_000),("Data Analyst",180_000),("Product Manager",140_000),("Product Manager",160_000)]:
    print(t, s, "->", is_strong_match(t, s))
