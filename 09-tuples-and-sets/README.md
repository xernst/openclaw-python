# Chapter 9 — Tuples & Sets

## 9.1 Tuples — immutable ordered sequences

```python
point = (3, 4)
rgb = (255, 128, 0)
single = (5,)      # trailing comma — else it's just int 5 in parens
empty = ()
```

Why pick a tuple over a list?

- **Immutability.** Tuple can't change after creation — safer for data you don't want mutated.
- **Slight performance edge** (tiny).
- **Hashable** — tuples can be **dict keys** and **set elements**. Lists cannot.
- **Semantic signal** — tuples often mean "a fixed bundle of related things" (coordinate, RGB, a name+age).

### Unpacking is where tuples shine

```python
x, y = (3, 4)
for name, age in [("Ava", 24), ("Bea", 40)]:
    print(name, age)
```

Functions can return multiple values via a tuple:

```python
def min_max(nums):
    return min(nums), max(nums)

lo, hi = min_max([3, 1, 4, 1, 5, 9])
```

### Named tuples (preview)

`collections.namedtuple` gives tuples a field API. In Chapter 19 you'll move to `@dataclass` which is generally better.

## 9.2 Sets — unordered collections of unique items

```python
tags = {"python", "beginner", "2026"}
```

- No duplicates — adding an existing value is a no-op.
- No guaranteed order.
- Very fast membership check (`x in s` is O(1) average).

### Methods

```python
tags.add("course")
tags.remove("beginner")    # raises if missing
tags.discard("missing")    # no error if missing
tags.pop()                 # remove+return an arbitrary element

"python" in tags           # O(1) average
len(tags)
tags.clear()
```

### Set algebra

```python
a = {1, 2, 3}
b = {3, 4, 5}
a | b    # union          {1,2,3,4,5}
a & b    # intersection   {3}
a - b    # difference     {1,2}
a ^ b    # symmetric diff {1,2,4,5}

a < b    # proper subset
a <= b   # subset
a.isdisjoint(b)
```

### Quick dedup

```python
list(set([1, 2, 2, 3, 3]))   # loses order
list(dict.fromkeys([1,2,2,3,3]))  # preserves order (3.7+)
```

### Set comprehension

```python
unique_lower = {ch.lower() for ch in "Hello"}
```

### `frozenset` — immutable set

Hashable, so it can be a dict key or set element.

```python
fs = frozenset({1, 2, 3})
```

## 9.3 Empty set gotcha

```python
empty_dict = {}        # this is a DICT
empty_set = set()      # THIS is an empty set
```

Why: `{}` was dict first; `set` literals use `{}` with at least one item.

## 9.4 When to use which

| Use case | Pick |
|----------|------|
| Ordered, editable list of items | `list` |
| Fixed bundle of heterogeneous items | `tuple` or `@dataclass` |
| Many fast membership checks | `set` |
| Unique items, no order | `set` |
| Key-value lookup | `dict` (ch 10) |

## Vibe-Coding Corner

- **Internalize:** tuple as "fixed group," the 1-element `(5,)` gotcha, set algebra operators, empty-set literal.
- **Skim:** `frozenset`, tuple performance vs list, `collections.namedtuple`.
- **AI gets wrong:** uses `{}` for an empty set; tries to mutate a tuple (raises `TypeError`); uses `list(set(x))` when order-preserving dedup is needed.
