a=[1,2,3]; b=a; c=a.copy()
b.append(4); c.append(99)
print("a:",a,"b:",b,"c:",c)
# a and b are the same list; c is a separate list.
