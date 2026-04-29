def add(a,b): return a+b
def sub(a,b): return a-b
def mul(a,b): return a*b
def div(a,b): return a/b
ops = {"add":add,"sub":sub,"mul":mul,"div":div}
a,b = 10,3
for name in ["add","mul","sub","div"]:
    print(f"{name}={ops[name](a,b)}")
