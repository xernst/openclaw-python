# openclaw-python

> Codecademy teaches Python like it's 1995. Boot.dev gamifies the same curriculum. Both assume you want to be a software engineer.
>
> openclaw-python is the school for people who use Cursor every day and need to know what it got wrong.

**Status**: building in public. Follow [@joshernst](https://twitter.com/joshernst) for daily progress.

This repo now ships in two halves of the same product:

1. **The interactive web app** — a Pyodide-in-the-browser, Codecademy-style step-by-step course at `localhost:3000`. Source lives at the root of this repo (Next.js, React 19, Tailwind 4, CodeMirror 6).
2. **The 28-chapter book** — a long-form, Codecademy-rhythm Python course as plain folders (`01-getting-started/` through `28-capstone-ai-notes-app/`) you can read in your editor or remix against your own life. The web app's curriculum was sourced from this.

Both share the same curriculum spine and the same point of view. Pick whichever surface you prefer; the wedge is identical.

---

## What this is

An open-source Python school for the AI-builder era. The curriculum inverts around the workflow you actually use: read code AI wrote, predict what it does, fix what it got wrong, write only what AI fluently can't.

Free forever. No accounts. No paywalls. No tracking. The web app runs 100% in your browser via Pyodide; the book is just folders of markdown and Python.

## Why this exists

Most "learn Python" platforms were designed for people becoming software engineers — data structures, algorithms, leetcode prep.

The audience here is different: a 29-year-old PM who uses Cursor every day, ships AI features, and wants to actually understand the 200 lines Claude just wrote. A 38-year-old marketing manager who wants to build internal AI tools at work. An indie founder who vibe-coded a SaaS and is now drowning in technical debt they can't read.

We skip what AI handles fluently. We double down on what AI gets wrong: hallucinated APIs, silent type bugs, off-by-one errors, traceback reading, environment setup, mutable default arguments, missing `await`s, stale stdlib usage. We teach the mental models you need to *direct* AI, not replace it.

---

## Two ways to use this repo

### A. The interactive web app (recommended)

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. Five-question onboarding, then your first lesson. Every step runs live Python in your browser via Pyodide. Built on Next.js 16 + Pyodide-in-Web-Worker + CodeMirror 6 + localStorage. Zero backend. Vercel hobby tier hosts it forever.

The web curriculum lives in `content/python/` as YAML+Markdown — one folder per lesson, one file per step. Schema is documented in `lib/content/schema.ts`.

### B. The 28-chapter book

If you'd rather read it in your editor like a textbook, the original 28-chapter folders are still at the root:

```
NN-topic/
├── README.md          — the lesson narrative (read it first)
├── 01_lesson.py       — annotated runnable examples
├── exercise_1.py … exercise_5.py
├── solutions/         — peek only after trying
└── CHECKPOINT.md      — self-quiz
```

Run a file with the ▶ button in VS Code, or in a terminal:

```bash
brew install python@3.12 uv
python3 01-getting-started/01_lesson.py
```

Some later chapters require extra libraries (`httpx`, `rich`, `pytest`, `anthropic`, `pandas`). Each chapter's README tells you what to install when you get there.

The web app currently covers a focused subset (variables → modules + new chapters for error handling, files, classes, HTTP/APIs). The 28-chapter book has the full breadth (control flow, async, pytest, pandas, LLM integration, CLI tooling, capstone). Everything in the web app's `content/python/` is the canonical source for the interactive surface; the root chapter folders are the long-form companion.

## Customize it — this is the magic

The course becomes genuinely great when you swap the stock examples for things from your actual life. 10 minutes of customization turns "another Python tutorial" into "a course *about me* that happens to teach Python." Drop the repo into Cursor / Cowork / Claude Code, paste in a "Running Cast" of your pets/team/project/dataset, and ask the AI to rewrite the examples while keeping every concept and exercise the same. See the legacy openclaw README for the full template.

## Philosophy: "vibe coding" doesn't mean skip the fundamentals

You're going to use AI to help you code. Great. But the AI will confidently hand you wrong code, especially about:

- Off-by-one errors in slicing
- Mutable default arguments (`def f(x=[])`)
- Missing `await` in async code
- Using stale APIs (`os.path` instead of `pathlib`, `urllib` instead of `httpx`, `%` instead of f-strings)
- Silently swallowing exceptions (`except: pass`)
- Forgetting type hints or returning the wrong type

This course makes you the person who catches those. The goal isn't memorizing syntax — it's developing the **judgment** to read, evaluate, and edit what the AI gives back.

## Chapter map (the long-form book)

| # | Chapter | You'll be able to |
|---|---------|-------------------|
| 01 | Getting Started | Run Python, use the REPL, print and comment, read tracebacks |
| 02 | Variables & Types | Store data; know `int`, `float`, `str`, `bool`, `None` |
| 03 | Strings | Format with f-strings; slice, split, join, transform text |
| 04 | Numbers & Math | Do arithmetic; use `math`; know float imprecision and `Decimal` |
| 05 | Input & Conversion | Take user input; cast types safely; understand truthiness |
| 06 | Control Flow | Branch with `if`/`elif`/`else`; pattern-match with `match`/`case` |
| 07 | Loops | Iterate with `for`, `while`, `range`, `enumerate`, `zip`, comprehensions |
| 08 | Lists | Mutability, sorting, slicing, the aliasing trap |
| 09 | Tuples & Sets | Immutability; set algebra; when to use each |
| 10 | Dictionaries | Keys, values, items, merging, counting, grouping |
| 11 | Functions | Define, call, return, defaults, docstrings, guard clauses |
| 12 | Scope, `*args`, Lambdas | LEGB, closures, unpacking at call sites |
| 13 | Modules & Packages | `import`, `__init__.py`, `__main__` guard |
| 14 | Files & `pathlib` | Modern file I/O, JSON, CSV, walking a tree |
| 15 | Error Handling | `try`/`except`, custom exceptions, EAFP style |
| 16 | Classes & OOP | Objects, `__init__`, instance vs class attrs, `@property` |
| 17 | Inheritance & Dunders | `super()`, `__repr__`, `__eq__`, container protocol |
| 18 | Decorators & Generators | `@decorator`, `yield`, context managers |
| 19 | Type Hints & Dataclasses | `int \| None`, `@dataclass`, when to use which |
| 20 | Venvs, pip, `uv` | Environment isolation, 2026's package manager |
| 21 | Standard Library Tour | `datetime`, `json`, `collections`, `itertools`, `random` |
| 22 | HTTP & APIs | `httpx`, REST, status codes, sessions, retries |
| 23 | Async Python | `async`/`await`, `asyncio.gather`, when it's worth it |
| 24 | Testing with `pytest` | `assert`, fixtures, `parametrize`, `tmp_path` |
| 25 | CSV, JSON, Pandas | Real datasets, cleaning, grouping, pivot tables |
| 26 | AI & LLM Integration | Anthropic/OpenAI APIs, structured output, multi-turn |
| 27 | Building a CLI Tool | `argparse`, `rich`, subcommands, exit codes |
| 28 | Capstone | One working tool that uses every chapter's ideas |

## Web app curriculum (currently shipped)

**18 chapters · 38 lessons · ~410 step-typed micro-screens.** The interactive web app covers:

| # | Chapter | Lessons | Focus |
|---|---|---|---|
| 1 | variables | 1 | naming, assignment, the rebind move |
| 2 | functions | 3 | def/return, args+defaults, closures+decorators |
| 3 | lists & dicts | 3 | the bones of an API response, comprehensions, nested data |
| 4 | loops | 3 | predict-the-output, while/break, enumerate+zip |
| 5 | conditionals | 2 | truthiness traps, elif + match-case |
| 6 | tracebacks | 3 | reading the stack, the five error classes, debug-by-print |
| 7 | mutation & state | 2 | why-it-breaks, copy vs reference |
| 8 | modules & imports | 2 | venv pain, from-imports + aliases |
| 9 | error handling | 3 | try/except, catching specifics, raising + custom |
| 10 | files & I/O | 3 | read/write, pathlib, csv + JSONL |
| 11 | classes basics | 3 | reading AI's classes, instance vs class, dataclasses |
| 12 | HTTP & APIs | 3 | making the call, status codes, parsing nested responses |
| **13** | **LLM APIs** | **1** | **messages, roles, response shape (Claude + OpenAI SDK)** |
| **14** | **structured output** | **1** | **Pydantic schemas, JSON validation, the missing-field bug** |
| **15** | **MCP** | **1** | **Model Context Protocol — servers, tools, when MCP > custom** |
| **16** | **agent loops** | **1** | **stop_reason, tool_use, the request → tool → respond cycle** |
| **17** | **git + GitHub** | **1** | **the three states, gh CLI, the AI-builder git workflow** |
| **18** | **secrets** | **1** | **.env, os.getenv, .gitignore, leaked-key recovery** |

Chapters 13–18 are the wedge for AI-first builders — the part of the course that no other Python school is teaching in 2026. Each lesson has 9 steps in the canonical sequence: `read → mc → read → predict → fill → fix → fix → write → checkpoint`.

## Stack

Web: Next.js 16 · React 19 · Tailwind 4 · Pyodide-in-Web-Worker · CodeMirror 6 · localStorage. Zero backend.
Book: Python 3.12+ · `uv` for envs · `httpx`, `pytest`, `anthropic`, `pandas` for the later chapters.

## Contributing

This is in active build. If you've used AI to write Python and gotten burned by something specific — hallucinated API, silent type bug, environment-setup hell — open an issue with the example. That's the curriculum.

For the book chapters: typo / unclear / dead link → PR. New chapter or structural change → issue first.

The core invariants I'm protecting:

- 28 chapters in the book, no more.
- Each book chapter: narrative lesson → lesson file → 5 exercises → 5 solutions → checkpoint.
- Each web lesson: 8–10 typed steps, ~5–8 minutes, ending in a checkpoint.
- Modern Python (3.12+), type hints, `pathlib`, `httpx`, f-strings.
- Vibe-Coding Corner in every book chapter.

## License

MIT. Do whatever you want with it. If you customize and share, tag me — I'd love to see where it goes.

## Author

Built by [Josh Ernst](https://github.com/xernst). If this saved you time, a ⭐ means a lot.
More on AI, Python, and vibe-coding in 2026 on Twitter: [@joshernst](https://twitter.com/joshernst).
26's package manager |
| 21 | Standard Library Tour | `datetime`, `json`, `collections`, `itertools`, `random` |
| 22 | HTTP & APIs | `httpx`, REST, status codes, sessions, retries |
| 23 | Async Python | `async`/`await`, `asyncio.gather`, when it's worth it |
| 24 | Testing with `pytest` | `assert`, fixtures, `parametrize`, `tmp_path` |
| 25 | CSV, JSON, Pandas | Real datasets, cleaning, grouping, pivot tables |
| 26 | AI & LLM Integration | Anthropic/OpenAI APIs, structured output, multi-turn |
| 27 | Building a CLI Tool | `argparse`, `rich`, subcommands, exit codes |
| 28 | Capstone | One working tool that uses every chapter's ideas |

## Philosophy: "vibe coding" doesn't mean skip the fundamentals

You're going to use AI to help you code. Great. But the AI will confidently hand you wrong code, especially about:

- Off-by-one errors in slicing
- Mutable default arguments (`def f(x=[])`)
- Missing `await` in async code
- Using stale APIs (`os.path` instead of `pathlib`, `urllib` instead of `httpx`, `%` instead of f-strings)
- Silently swallowing exceptions (`except: pass`)
- Forgetting type hints or returning the wrong type

This course makes you the person who catches those. The goal isn't memorizing syntax — it's developing the **judgment** to read, evaluate, and edit what the AI gives back.

## Prior art

In conversation with a few courses I genuinely love:

- **The Python Tutorial** (python.org/docs) — the official source.
- **Codecademy's Learn Python 3** — the rhythm of short lesson + many small exercises.
- **trekhleb/learn-python** — depth in one repo.
- **Asabeneh/30-Days-Of-Python** — structured progression.
- **Real Python's free tutorials** — some of the best Python writing on the internet.

This course borrows the *structure* of good prior art and fills a gap: a Codecademy-style rhythm built around modern tooling (`uv`, `httpx`, `pathlib`, `@dataclass`, `asyncio`, LLM APIs) with vibe-coding commentary on every chapter.

## Contributing

Found a typo, unclear explanation, or dead link? Open an issue or send a PR. If you want to add a whole chapter or propose a structural change, open an issue first.

This course is opinionated. The core invariants I'm protecting:

- 28 chapters, no more.
- Each chapter: narrative lesson → lesson file → 5 exercises → 5 solutions → checkpoint.
- Modern Python (3.12+), type hints everywhere, `pathlib` over `os.path`, `httpx` over `requests`, f-strings over `.format()`.
- Vibe-Coding Corner in every chapter.

## License

MIT. Do whatever you want with it. If you customize and share, tag me — I'd love to see where it goes.

## Author

Built by [Josh Ernst](https://github.com/xernst). If this saved you time, a ⭐ means a lot.

More on AI, Python, and vibe-coding in 2026 on Twitter: [@joshernst](https://twitter.com/joshernst).
>>>>>>> openclaw/main
