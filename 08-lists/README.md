# Chapter 8 — Lists

A `list` is an ordered, mutable sequence. The workhorse collection.

```python
fruits = ["apple", "banana", "cherry"]
```

## 8.1 Indexing and slicing (same as strings)

```python
fruits[0]     # 'apple'
fruits[-1]    # 'cherry'
fruits[0:2]   # ['apple', 'banana']
fruits[::-1]  # reversed
```

Negative indices count from the end. Slicing returns a **new list** (not a view).

## 8.2 Mutating a list

Lists are **mutable** — change in place:

```python
fruits.append("date")           # add to end
fruits.insert(0, "apricot")     # insert at index
fruits.extend(["fig","grape"])  # add multiple from an iterable
fruits.remove("banana")         # remove by value (first match; raises if missing)
popped = fruits.pop()           # remove+return last; pop(i) for index
fruits[0] = "avocado"           # replace by index
fruits.clear()                  # empty it
```

## 8.3 Combining and repeating

```python
[1, 2] + [3, 4]        # [1, 2, 3, 4]
["-"] * 10             # ['-','-',...x10]
```

## 8.4 Searching and counting

```python
"apple" in fruits              # membership
fruits.index("cherry")         # position; ValueError if missing
fruits.count("apple")
len(fruits)
min(nums); max(nums); sum(nums)
```

## 8.5 Sorting

```python
nums = [3, 1, 4, 1, 5, 9, 2, 6]
nums.sort()                    # mutates
nums.sort(reverse=True)
nums.sort(key=abs)             # sort by |value|
sorted(nums)                   # returns NEW list
```

`sorted()` works on any iterable and returns a new list — safer when you want to keep the original.

Sorting complex objects by a field:

```python
people = [{"name": "Bea", "age": 40}, {"name": "Ava", "age": 22}]
people.sort(key=lambda p: p["age"])
```

## 8.6 Unpacking

```python
a, b, c = [1, 2, 3]
first, *rest = [10, 20, 30, 40]    # first=10, rest=[20,30,40]
*head, last = [10, 20, 30, 40]     # head=[10,20,30], last=40
```

## 8.7 Aliasing — the #1 beginner bug

```python
a = [1, 2, 3]
b = a               # NOT a copy — both names point at the same list
b.append(4)
print(a)            # [1, 2, 3, 4]  surprise\!

c = a.copy()        # real (shallow) copy
# or:
c = a[:]
c = list(a)
```

For deep (recursive) copy when lists contain lists:

```python
import copy
d = copy.deepcopy(a)
```

## 8.8 Lists vs other sequences

| Need | Use |
|------|-----|
| ordered, mutable | `list` |
| ordered, immutable | `tuple` (ch 9) |
| unique, unordered | `set` (ch 9) |
| key → value | `dict` (ch 10) |
| fast append+pop at both ends | `collections.deque` |

## Vibe-Coding Corner

- **Internalize:** indexing/slicing, `append`/`extend`/`insert`/`remove`/`pop`, `sort` vs `sorted`, `in`, aliasing gotcha.
- **Skim:** `bisect`, `heapq`, `deque` (you'll reach for them when needed).
- **AI gets wrong:** mutates a parameter list instead of returning a new one; uses `list.sort(...)` then prints the return value (it's `None`, not the sorted list).
