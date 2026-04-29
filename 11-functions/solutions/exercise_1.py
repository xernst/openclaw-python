def greet(name, session_id):
    return f"Hi {name}, welcome to session #S-{session_id:03d}."
print(greet("Ana", 7))
print(greet("Ben", 42))
