"""Chapter 10 — Dictionaries."""
import json
from collections import Counter, defaultdict

user = {"name":"Ava","age":24,"is_admin":True}
print(user["name"], user.get("email", "no email"))
user["email"] = "ava@example.com"
user["age"] = 25
del user["is_admin"]
print(user)

# iterate
for k, v in user.items(): print(k, "=>", v)

# merge
defaults = {"theme":"dark","lang":"en"}
overrides = {"lang":"es","fontsize":14}
print(defaults | overrides)

# comprehension
print({n: n**2 for n in range(1,6)})

# counting
text = "one two two three three three four four four four"
freq = {}
for w in text.split(): freq[w] = freq.get(w, 0) + 1
print("freq:", freq)
print("Counter:", Counter(text.split()))

# grouping
words = ["apple","ant","bat","ball","cat"]
by_first = defaultdict(list)
for w in words: by_first[w[0]].append(w)
print(dict(by_first))

# nested (JSON-like)
post = {
    "id": 1,
    "title": "hello",
    "author": {"name":"ava","age":24},
    "tags": ["first","draft"],
}
print(post["author"]["name"])
print(json.dumps(post, indent=2))
