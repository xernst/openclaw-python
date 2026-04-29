"""Chapter 8 — Lists."""

fruits = ["apple", "banana", "cherry"]
print(fruits[0], fruits[-1])

# mutate
fruits.append("date")
fruits.insert(0, "apricot")
fruits.extend(["fig", "grape"])
print(fruits)

# remove
fruits.remove("banana")
last = fruits.pop()
print("popped:", last, "remaining:", fruits)

# slice
print(fruits[:2])

# combine & repeat
print([1, 2] + [3, 4])
print(["-"] * 10)

# search
nums = [3, 1, 4, 1, 5, 9, 2, 6]
print(5 in nums, nums.index(4), nums.count(1), len(nums))
print(min(nums), max(nums), sum(nums))

# sort
nums.sort()
print("sorted asc:", nums)
nums.sort(reverse=True)
print("sorted desc:", nums)

# sort by key
words = ["banana", "fig", "apple", "kiwi"]
words.sort(key=len)
print(words)

# sort list of dicts
people = [{"name":"Bea","age":40},{"name":"Ava","age":22},{"name":"Cai","age":31}]
people.sort(key=lambda p: p["age"])
print(people)

# unpack
first, *rest = [10, 20, 30, 40]
print(first, rest)

# aliasing
a = [1, 2, 3]
b = a
b.append(4)
print("alias a:", a)    # also has 4
c = a.copy()
c.append(99)
print("a vs c:", a, c)
