username = "ava"; password = "hunter2"
u = input("user: "); p = input("pass: ")
if u == username and p == password: print(f"Welcome back, {username}\!")
elif u == username: print("Wrong password.")
else: print("Unknown user.")
