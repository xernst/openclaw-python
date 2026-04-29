def route(fm):
    if not fm: return "inbox"
    if fm.get("status")=="archive": return "archive"
    tags = fm.get("tags",[])
    if "project" in tags: return "projects"
    if "area" in tags: return "areas"
    return "resources"
for fm in [{}, {"status":"archive"}, {"tags":["project"]}, {"tags":["area"]}, {"tags":["foo"]}]:
    print(fm, "->", route(fm))
