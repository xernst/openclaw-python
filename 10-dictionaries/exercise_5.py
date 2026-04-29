"""
Exercise 10.5 — Nested JSON.
Given post dict with id, title, author{name,age}, tags list.
Print the author's name, then pretty-print the whole post using json.dumps(indent=2).
"""
import json
post = {
    "id": 1,
    "title": "hello",
    "author": {"name":"ava","age":24},
    "tags":["first","draft"]
}
# TODO
