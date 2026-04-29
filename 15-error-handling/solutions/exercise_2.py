notes=[{"title":"n1","tags":["project"]},{"title":"n2"},{"title":"n3","tags":["area"]},{}]
for note in notes:
    title = note.get("title","untitled")
    try: tag = note["tags"][0]
    except (KeyError, IndexError): tag = "none"
    print(f"{title} -> {tag}")
