def parse_version(s):
    try: return [int(p) for p in s.split(".")]
    except ValueError as e:
        raise RuntimeError(f"bad version {s\!r}") from e
print(parse_version("1.2.3"))
try: parse_version("1.2.oops")
except RuntimeError as e: print(e, "| cause:", e.__cause__)
