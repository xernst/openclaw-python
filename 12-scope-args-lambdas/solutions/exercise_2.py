testers=[{"name":"Ana","completed":12,"bugs":4},
         {"name":"Ben","completed":8,"bugs":7},
         {"name":"Cat","completed":15,"bugs":2},
         {"name":"Dan","completed":10,"bugs":5}]
print([t["name"] for t in sorted(testers, key=lambda t: t["bugs"]*2 + t["completed"], reverse=True)])
