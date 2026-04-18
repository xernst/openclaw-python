import json
post = {"id":1,"title":"hello","author":{"name":"ava","age":24},"tags":["first","draft"]}
print(post["author"]["name"])
print(json.dumps(post, indent=2))
