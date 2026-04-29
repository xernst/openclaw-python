# Chapter 10 — Dictionaries

`dict` maps **keys** to **values**. It's the backbone of configs, JSON payloads, database rows, model objects, and LLM message structures.

```python
user = {"name": "Ava", "age": 24, "is_admin": True}
```

## 10.1 Access, update, delete

```python
user["name"]             # "Ava"
user["name"] = "Bea"     # update
user["email"] = "b@x"    # add new key
del user["age"]          # remove key
```

`user[key]` raises `KeyError` if the key isn't there. Safer:

```python
user.get("phone")              # None if missing
user.get("phone", "unknown")   # custom default
```

## 10.2 Checking keys

```python
"name" in user     # True — checks keys, not values
```

## 10.3 Iterating

```python
for key in user:                  # keys only
    ...
for key, value in user.items():   # most common
    ...
for value in user.values():
    ...
```

Order: since Python 3.7, dicts keep **insertion order**. You can rely on it.

## 10.4 Common operations

```python
len(user)
user.update({"age": 25})       # merge another dict in
user.pop("email", None)         # remove+return; default if missing
dict.fromkeys(["a","b"], 0)     # {"a":0,"b":0}
list(user.keys()); list(user.values()); list(user.items())
```

## 10.5 Merging (Python 3.9+)

```python
defaults = {"theme": "dark", "lang": "en"}
overrides = {"lang": "es"}
final = defaults | overrides      # {'theme':'dark','lang':'es'}
defaults |= overrides             # in-place merge
```

## 10.6 Dict comprehensions

```python
squares = {n: n*n for n in range(5)}
inverted = {v: k for k, v in user.items()}
```

## 10.7 Grouping with `setdefault` and `defaultdict`

Counting occurrences:

```python
text = "one two two three three three"
freq = {}
for w in text.split():
    freq[w] = freq.get(w, 0) + 1
```

Or cleaner with `collections.Counter`:

```python
from collections import Counter
Counter(text.split())   # Counter({'three':3,'two':2,'one':1})
```

Grouping by a key:

```python
from collections import defaultdict
by_first_letter = defaultdict(list)
for word in words:
    by_first_letter[word[0]].append(word)
```

## 10.8 Nested dicts — modeling JSON

```python
post = {
    "id": 1,
    "title": "hello",
    "author": {"name": "ava", "age": 24},
    "tags": ["first", "draft"],
}
post["author"]["name"]      # "ava"
```

## 10.9 What can be a key?

Anything **hashable**: strings, numbers, booleans, tuples of hashables, `frozenset`. **Not** lists, sets, or dicts (they're mutable).

## 10.10 Pretty-printing

```python
import json
print(json.dumps(post, indent=2))
```

You'll use this constantly when debugging nested data.

## Vibe-Coding Corner

- **Internalize:** `.get(key, default)`, `.items()` loops, nested access, `|` merge, `Counter`, `defaultdict`, pretty-printing with `json.dumps`.
- **Skim:** `OrderedDict` (legacy — regular dicts are ordered now), `ChainMap`.
- **AI gets wrong:** hits `KeyError` by using `d[key]` instead of `d.get(key)`; forgets dicts are insertion-ordered post-3.7; tries to use a list as a key.
