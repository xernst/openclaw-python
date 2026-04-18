# Chapter 15 — Error Handling

Real programs handle bad input: missing files, unparseable JSON, rate-limited APIs, partial data. The tools are `try`/`except`, raising, and custom exceptions.

## 15.1 Exceptions you'll meet regularly

| Exception | Typical cause |
|-----------|---------------|
| `ValueError` | `int("abc")`, bad conversion |
| `TypeError` | `"1" + 1`, wrong type |
| `KeyError` | `d["missing"]` |
| `IndexError` | `lst[100]` out of range |
| `AttributeError` | `obj.missing_method()` |
| `FileNotFoundError` | reading a missing file |
| `ZeroDivisionError` | `1 / 0` |
| `StopIteration` | exhausted iterator (usually wrapped by `for`) |

All of these inherit from **`Exception`**. You'll meet the hierarchy in ch 17.

## 15.2 `try` / `except`

```python
try:
    n = int(user_input)
except ValueError:
    print("please enter a whole number")
```

**Rule:** catch the *specific* exception you can handle. Do not write `except:` alone, or `except Exception:` as a default — you'll swallow bugs.

## 15.3 Multiple `except` branches

```python
try:
    data = json.loads(text)
except json.JSONDecodeError as e:
    print("bad JSON:", e)
except FileNotFoundError:
    print("file missing")
```

Combine with a tuple when the handling is the same:

```python
try:
    ...
except (ValueError, TypeError) as e:
    ...
```

## 15.4 `else` and `finally`

- `else` runs if `try` completes without raising.
- `finally` runs no matter what — great for cleanup.

```python
try:
    f = open(path)
except FileNotFoundError:
    print("missing")
else:
    process(f)
finally:
    f.close()
```

With files, prefer `with open(...)` — it handles `finally` for you.

## 15.5 Raising your own

```python
def send(token, chat_id, text):
    if not token:
        raise ValueError("TELEGRAM_TOKEN is not set")
    ...
```

To re-raise after logging:

```python
try:
    do_thing()
except Exception as e:
    log(e)
    raise                # re-raises the same exception
```

## 15.6 Custom exceptions

Inherit from `Exception` (not `BaseException`):

```python
class CrowdtestError(Exception):
    """Base for domain-specific errors."""

class ParticipantNotFound(CrowdtestError):
    pass

def get(pid):
    if pid not in REG:
        raise ParticipantNotFound(pid)
```

A base class lets callers catch your whole family:

```python
try:
    get("P99")
except CrowdtestError as e:
    ...
```

## 15.7 `raise X from Y` — chaining

```python
try:
    int(s)
except ValueError as e:
    raise MyError("couldn't parse") from e
```

`from e` preserves the original traceback in the new exception. Good for wrapping.

## 15.8 EAFP vs. LBYL

Pythonic style prefers **Easier to Ask Forgiveness than Permission**:

```python
# LBYL — Look Before You Leap
if path.exists():
    text = path.read_text()
else:
    text = ""

# EAFP — more Pythonic, especially with concurrency
try:
    text = path.read_text()
except FileNotFoundError:
    text = ""
```

EAFP is cleaner and race-condition-free (the file could disappear between check and read in LBYL).

## 15.9 Don't swallow exceptions silently

```python
# BAD:
try:
    do()
except Exception:
    pass          # bug hides here forever

# BAD:
except Exception as e:
    print("oops")  # lost the stack trace

# GOOD:
import logging
try:
    do()
except SpecificError as e:
    logging.exception("do() failed: %s", e)
    raise
```

## Vibe-Coding Corner

- **Internalize:** `try`/`except Specific`, `raise X from e`, EAFP style, custom exception with a base class, never bare `except:`.
- **Skim:** exception groups (`ExceptionGroup`), `contextlib.suppress`, `warnings`.
- **AI gets wrong:** bare `except:` swallowing errors; catching `Exception` to "make it robust"; losing the traceback by re-raising as a new error without `from`.
