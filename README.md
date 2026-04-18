# openclaw-python

**Python for the vibe-coding age.** A 28-chapter, Codecademy-style course built for the way people actually learn Python in 2026 — sitting next to an AI, building real things, learning just enough CS to read and steer what the model gives back.

Pair this with your own life — your pets, your team, your side project, your dataset — and the course becomes 10× more engaging. See **Customize it** below.

## What makes it different

- **AI-pair-programming first.** Every chapter has a *Vibe-Coding Corner* that flags what to actually internalize vs. what to skim, and the specific failure modes AI hits in that topic.
- **Real depth on the right things.** Types, `pathlib`, errors, `httpx`, `asyncio`, `pytest`, LLM APIs — long, patient chapters. Deep CS theory gets mentioned, not drilled.
- **Codecademy-style reps.** Each chapter: narrative lesson → annotated lesson file → five exercises (progressive difficulty) → five solutions → self-quiz.
- **PSF-aligned.** Anchored to the official Python tutorial, language reference, standard library, PEP 8, PEP 20.
- **End-to-end capstone.** The final chapter ships a working CLI tool that takes a file, calls an LLM, writes a structured note, logs the run — every chapter's concepts woven together.

## Who it's for

- Curious beginners who want to build real things, not pass a CS exam.
- PMs, designers, analysts, founders — people who want to read and steer AI-generated code with confidence.
- Self-taught learners who've done a bootcamp but want depth where it counts (types, errors, tests, APIs, LLMs).

## Quick start

```bash
# macOS
brew install python@3.12 uv
python3 --version         # should be 3.12+

# Clone
git clone https://github.com/xernst/openclaw-python.git
cd openclaw-python

# Open in VS Code
code .
```

Install the Microsoft **Python** extension. Open `01-getting-started/README.md` and go.

Each chapter folder has:

```
NN-topic/
├── README.md          — the lesson (read it first)
├── 01_lesson.py       — annotated runnable examples
├── exercise_1.py … exercise_5.py
├── solutions/         — peek only after trying
└── CHECKPOINT.md      — self-quiz
```

Run a file with the ▶ button in VS Code, or in a terminal:

```bash
python3 01-getting-started/01_lesson.py
```

Some later chapters require extra libraries (`httpx`, `rich`, `pytest`, `anthropic`, `pandas`). Each chapter's README tells you what to install when you get there.

## Customize it — this is the magic

This course becomes genuinely great when you swap the stock examples for things from your actual life. 10 minutes of customization turns "another Python tutorial" into "a course *about me* that happens to teach Python." The fastest path is via **Cowork** (the Claude desktop app) or any AI-assisted editor (Cursor, VS Code + Copilot, Windsurf, Zed AI).

### Step 1 — Drop the folder into your AI coworker

Open Cowork (or Cursor / VS Code with an agentic mode). Select this folder as the working directory so the AI can read and edit every file.

Sanity check: ask the AI *"list the chapter folders in this course"* and it should respond with `01-getting-started` through `28-capstone-ai-notes-app`.

### Step 2 — Fill in your "Running Cast"

Copy this template into a scratch doc and fill it in:

```
# My Running Cast

## Personal threads (pick 4-6)
- School / work: _______
- Significant other / close friend: _______
- Family / roommates: _______
- Pets: _______   (name + species)
- Favorite sports team(s): _______
- A hobby with regular data: _______   (gym routine, running, D&D, garden)

## Professional threads (pick 2-4)
- Main project right now: _______
- A side project you wish was further along: _______
- A tool you use daily you'd love to automate: _______
- A dataset you have access to: _______
```

This stays on YOUR machine. It's your cheat sheet for making the course feel like home.

### Step 3 — Let the AI rewrite the examples

Paste your Running Cast into the AI and say:

> Using the Running Cast below, rewrite the course files I'm loading. Keep all teaching content and exercises the same — only change the example data (names, teams, projects). Don't change the Python concepts. Add a `PROJECT_CONNECTIONS.md` showing which chapter uses which thread of my life.
>
> [paste your Running Cast here]

The AI will go chapter by chapter and swap in your examples. This repo is your pristine backup — fork it, customize the fork, keep the original clean.

### Step 4 — Light-touch alternatives

If you'd rather keep it minimal, point the AI at just the chapters that'd benefit most:

- **Pets:** "In chapters 7, 10, 16, 17, use my pets as the running example for lists, dicts, classes, inheritance."
- **Sports:** "Use a season of game scores for chapters 7-8. Use team/player records for dict examples in chapter 10."
- **School:** "Use course credits and GPA math for chapters 4 and 11. Use a graduation countdown for chapters 1 and 21."
- **A side project:** "Use my project as the recurring professional example for chapters 11-17. Base the capstone in chapter 28 on extending it."
- **A daily tool** (Obsidian / Notion / Notes / Things / Linear): "Use its data shape for chapters 14, 22, 24, 26."

### Step 5 — Iterate

As you work through the course and a chapter's examples feel flat, tell the AI: *"Chapter X's example using ___ isn't clicking — swap in something closer to ___."* Revise just that chapter.

## Chapter map

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
