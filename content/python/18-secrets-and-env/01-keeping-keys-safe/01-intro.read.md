---
xp: 1
estSeconds: 95
concept: secrets-env-pattern
code: |
  # what python-dotenv would load from a .env file, simulated.
  # real code:
  #     from dotenv import load_dotenv
  #     load_dotenv()
  #     api_key = os.getenv("ANTHROPIC_API_KEY")

  fake_env = {
      "ANTHROPIC_API_KEY": "sk-ant-test-not-real",
      "OPENAI_API_KEY":    "sk-test-not-real",
      "DATABASE_URL":      "postgres://localhost/dev",
  }

  # ABSOLUTELY DO NOT do this:
  #     api_key = "sk-ant-real-key-goes-here"   # never
  #
  # do this instead:
  api_key = fake_env.get("ANTHROPIC_API_KEY")

  # never print the whole key. log a redacted preview at most.
  preview = api_key[:8] + "..." if api_key else "MISSING"
  print(f"key loaded: {preview}")
runnable: true
---

# AI commits secrets every week. Here's how to stop it.

GitHub's secret scanner finds tens of thousands of leaked API keys
*per day*. A huge fraction come from AI tools committing `.env` files,
hardcoding `api_key = "sk-..."` into source, or pushing scratch
notebooks with real credentials inside. If you ship anything this
year, you'll write to a private API. The single most important habit
in this whole course is making sure your keys never end up in git.

## The pattern that works

Three rules. They compound:

1. **Keys live in environment variables, never in source code.** Your
   Python code reads them via `os.getenv("ANTHROPIC_API_KEY")`. The
   actual value lives in a `.env` file you load at startup, or in
   the platform's secret manager (Vercel, Railway, GitHub Actions).
2. **`.env` is gitignored on day one.** Before you write any code,
   the very first line in your `.gitignore` should be `.env`. Then
   `.env.local`, `.env.*.local`, and friends.
3. **There's a `.env.example` checked in.** A template with the same
   keys but empty or placeholder values, so a teammate (or future
   you) knows what variables the app needs.

## The minimal `.gitignore` for any AI project

```
# secrets
.env
.env.*
!.env.example

# python
__pycache__/
*.pyc
.venv/

# editor
.DS_Store
.vscode/
.idea/
```

The `!.env.example` line says "ignore .env-everything *except* the
example template." The exclamation mark is an un-ignore.

## The pattern AI ships every time

```python
import os
from anthropic import Anthropic

# python-dotenv reads .env into os.environ at startup
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key:
    raise RuntimeError("ANTHROPIC_API_KEY not set — copy .env.example to .env")

client = Anthropic(api_key=api_key)
```

Five lines. Same pattern for OpenAI, Stripe, GitHub tokens, database
connection strings — anything sensitive.

## What to do when a key leaks (and it will)

You will leak a key. Everyone has. The fix is fast if you act fast:

1. **Rotate the key immediately.** Open the provider's dashboard,
   revoke the old key, generate a new one. The leaked key is now
   useless to anyone who scraped it. Do this *first*, before
   cleaning up the repo.
2. **Update your local `.env` with the new key.** Test that the app
   still works.
3. **Remove the key from git history.** `git rm` the file and
   commit. If the key was pushed, the secret is in history forever
   on GitHub — rotation in step 1 is what actually protects you.
   Tools like `git filter-repo` can scrub history, but the key
   already being public is the threat, not the file existing.
4. **Audit usage.** Check the provider's logs for any calls made
   between the leak and the rotation.

The rotation in step 1 is the only thing that actually matters. The
other steps are hygiene.

## Where AI specifically gets this wrong

- **Hardcodes the key in a Jupyter cell.** "Just for this notebook."
  Then commits the notebook. The key is now public.
- **Prints the full key to stdout for debugging.** Logs end up in
  cloud log services that get indexed.
- **Adds `.env` to git "by accident"** with `git add .`. Always
  `git status` first.

> **Browser note:** there's no real `os.environ` in here, and
> `python-dotenv` isn't installed. We'll use a Python dict to
> simulate environment variables. The pattern (`getenv`, default
> values, missing-key handling) is identical.

Run the editor. We load a (fake) key from a (fake) env and print only
a redacted preview.
