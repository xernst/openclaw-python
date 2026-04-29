"""Chapter 15 — Error handling."""
import logging

# Custom error family
class AppError(Exception): pass
class NotFound(AppError): pass

REG = {"A01":"Ana","A02":"Ben"}
def get_participant(pid):
    try:
        return REG[pid]
    except KeyError:
        raise NotFound(f"no participant {pid\!r}") from None

def to_int(s, default=0):
    try: return int(s)
    except (TypeError, ValueError): return default

print(to_int("42"), to_int("oops"), to_int(None, -1))

for pid in ["A01","A02","A99"]:
    try:
        print(pid, "->", get_participant(pid))
    except AppError as e:
        print("[ERR]", e)

# EAFP for dict
data = {"title":"Retro","tags":["project"]}
try: status = data["status"]
except KeyError: status = "unknown"
print("status:", status)
# Often equivalent: data.get("status", "unknown")

# raise ... from
def parse_version(s):
    try:
        parts = [int(p) for p in s.split(".")]
    except ValueError as e:
        raise AppError(f"bad version: {s\!r}") from e
    return parts

try:
    parse_version("1.2.oops")
except AppError as e:
    print(e)

# Re-raise after logging
try:
    1 / 0
except ZeroDivisionError:
    logging.basicConfig(level=logging.ERROR)
    logging.exception("math went bad")
    # raise  # uncomment to re-raise
