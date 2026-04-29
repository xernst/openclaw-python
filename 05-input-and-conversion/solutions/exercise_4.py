def parse_bool(s):
    return s.strip().lower() in {"yes", "y", "true", "1"}
for raw in ["Yes", "no", "TRUE", "false", " y "]:
    print(raw, "->", parse_bool(raw))
