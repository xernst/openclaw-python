## The chapter that keeps your API keys off GitHub

Type "leaked api key" into the GitHub code search bar. You'll find tens of thousands of repos. Some of them are toys. Many of them are real production code from real companies, hardcoded keys in plaintext, sitting on the internet for anyone to use. Most of them got there because somebody let an AI tool run `git add .` and didn't notice that `config.py` had `OPENAI_API_KEY = "sk-..."` baked into it.

This chapter is how you don't end up in that list.

## The three-step pattern that handles 95% of the danger

Real production code never has a secret hardcoded. It reads secrets from environment variables. The pattern:

1. **Define the secret in a `.env` file** at the project root. `ANTHROPIC_API_KEY=sk-ant-api03-...`. The file lives on your machine, not in git.
2. **Add `.env` to `.gitignore`** so git refuses to track it. If you don't, your IDE will helpfully stage it the first time it sees the file.
3. **Load it at startup with `python-dotenv`** so `os.getenv("ANTHROPIC_API_KEY")` returns the value at runtime.

That's the pattern. Three steps. Once it's muscle memory, you can never accidentally ship a secret again — because secrets are never in your source files in the first place.

## Why this is its own chapter, not a footnote

PMs and ops folks who use Cursor often inherit this pattern from their engineers without understanding it, and then a small change breaks it in a way nobody notices. They paste a key inline "just for testing." They commit `.env.local` because their `.gitignore` only said `.env`. They write `os.environ["KEY"]` and the app crashes mysteriously when the env isn't set, instead of failing at startup with a clear error.

Each of those is a one-line bug with a multi-day recovery cost if the key leaks. So we drill the pattern explicitly, including the failure modes Cursor reliably produces.

## What `os.getenv` versus `os.environ` actually does

This is a small but load-bearing distinction:

- `os.getenv("KEY")` — returns the value if set, returns `None` if not. *Doesn't crash.* Pass a default with `os.getenv("KEY", "fallback")`. Use this for optional config.
- `os.environ["KEY"]` — returns the value if set, raises `KeyError` if not. Crashes hard with the missing key name. Use this for required secrets at startup, where "missing" should be loud and immediate.

AI sometimes writes `os.getenv("ANTHROPIC_API_KEY")` and then proceeds to use the value as if it's guaranteed to be present. The first time someone runs the app without `.env` loaded, they get `TypeError: cannot unpack NoneType` two functions deep, which is the worst possible error message for a missing-config problem. Step 4 of this chapter is fixing exactly this.

## What to do when (not if) a key leaks

Every team that ships AI features for long enough leaks a key once. The recovery flow is deterministic and worth memorizing:

1. **Rotate the key in the provider's dashboard immediately.** This is the only step that actually saves you. Anthropic, OpenAI, every major provider has a "revoke and rotate" button. Use it the moment you realize.
2. *Then* worry about scrubbing the git history. `git filter-repo` is the modern tool. BFG Repo-Cleaner still works. The historical commit on GitHub is technically still scrapable until the rewrite + force-push, but the rotated key is already worthless.
3. *Never* rely on "removing the file" or "force-push to overwrite the bad commit" alone. The instant the key was on a public repo, the indexers had it. Rotation is the only thing that matters.

Most leaked-key recovery posts on the internet get this order wrong. Step 8 of this chapter is the recovery flow correctly.

## What AI specifically gets wrong about secrets

Three patterns:

1. **Hardcoding the key "just for testing."** AI generates `client = OpenAI(api_key="sk-...")` because that's the README pattern. PMs paste in their real key, run it once, forget, commit. The diff has the key. Step 2 is spotting which line leaks.

2. **Sloppy `.gitignore`.** `.env` doesn't catch `.env.local`, `.env.production`, `.env.staging`. Step 5 is fixing the gitignore so the whole family is covered.

3. **Catching missing-env errors silently.** AI writes `try: key = os.environ[...] except: key = ""`. The app runs with an empty key. The API returns 401s. Hours of debugging. Step 6 is the right pattern: fail loudly at startup.

## What you'll be able to do at the end

Nine steps. By the end you'll be able to:

- Read any project and tell whether it's leaking secrets in 30 seconds (check `.gitignore`, grep for `sk-`, scan for `os.environ`).
- Set up the `.env` + `python-dotenv` + `.gitignore` pattern in a fresh project from memory.
- Use `os.getenv` versus `os.environ` correctly for required-vs-optional config.
- Run the rotate-then-scrub recovery flow if a key ever leaks.

Chapter 17 (git/GitHub) is the prerequisite. Chapter 22 (capstone) is where you'll need the env pattern to actually call an LLM API in your CLI agent.

Press *Start chapter* below.
