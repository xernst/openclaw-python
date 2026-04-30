---
xp: 2
estSeconds: 75
concept: os-getenv-with-default
code: |
  # simulated environment — what os.environ would hold after load_dotenv()
  fake_env = {
      "ANTHROPIC_API_KEY": "sk-ant-test",
      "MODEL": "claude-sonnet-4-6",
      # DEBUG is intentionally not set
  }

  def getenv(name, default=None):
      return fake_env.get(name, default)

  api_key = getenv("ANTHROPIC_API_KEY")
  model = getenv("MODEL", "claude-haiku-4-5")
  debug = getenv("DEBUG", "false")

  print(f"api_key set: {api_key is not None}")
  print(f"model: {model}")
  print(f"debug: {debug}")
---

# `os.getenv` and the missing-key trap

Python ships two ways to read environment variables. They behave very
differently when the variable is missing:

```python
os.environ["ANTHROPIC_API_KEY"]   # KeyError if missing
os.getenv("ANTHROPIC_API_KEY")    # returns None if missing
os.getenv("MODEL", "claude-haiku-4-5")   # returns default if missing
```

`os.environ[...]` crashes loudly. `os.getenv` returns silently. Each
has a place — and AI almost always picks wrong.

## When to use which

- **For required secrets**, use `os.getenv` followed by an explicit
  None check. You want to FAIL FAST with a useful message, not
  crash deep in a library call:

  ```python
  api_key = os.getenv("ANTHROPIC_API_KEY")
  if not api_key:
      raise RuntimeError("ANTHROPIC_API_KEY missing — see .env.example")
  ```

- **For optional configuration**, use `os.getenv` with a default:

  ```python
  model = os.getenv("MODEL", "claude-sonnet-4-6")
  log_level = os.getenv("LOG_LEVEL", "INFO")
  ```

- **Almost never** use `os.environ["..."]` directly. The KeyError it
  raises tells you the missing key name, but it doesn't tell the user
  *what to do about it* — and the line of source code that needs the
  value is almost never the right place to bail. Catch missing keys at
  startup with a clear error message instead.

## Booleans, ints, and the parsing tax

Environment variables are *always strings*. `os.getenv("DEBUG")` will
never return `True` — it returns `"true"` (or `"True"` or `"1"` or
whatever the user typed). You parse:

```python
debug = os.getenv("DEBUG", "false").lower() == "true"
port = int(os.getenv("PORT", "3000"))
```

Forgetting this is the second most common AI bug after hardcoding the
key in the first place. `if os.getenv("DEBUG"):` is True for *any*
non-empty string, including `"false"`. Always normalize.

Run the editor. We read three env vars — one set, one falling through
to default, one with a normal value.
