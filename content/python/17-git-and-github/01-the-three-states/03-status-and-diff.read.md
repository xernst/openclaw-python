---
xp: 2
estSeconds: 80
concept: git-status-diff-and-gh
code: |
  # parsed `git status --porcelain` plus a small `gh pr list` slice.
  # both are dicts here so we can read them like real CLI output.

  status = {
      "branch": "feature/login-rate-limit",
      "staged":   ["src/auth/login.py", "tests/test_login.py"],
      "modified": ["README.md"],
      "untracked": [".env.local"],
  }

  open_prs = [
      {"number": 142, "title": "fix: token refresh", "author": "maya", "draft": False},
      {"number": 143, "title": "wip: rate limit",     "author": "maya", "draft": True},
  ]

  print("STAGED:")
  for f in status["staged"]:
      print(f"  + {f}")

  print("\nOPEN PRs:")
  for pr in open_prs:
      tag = "draft" if pr["draft"] else "ready"
      print(f"  #{pr['number']} [{tag}] {pr['title']}")
---

# `git status`, `git diff`, and `gh pr list` — the three you'll run daily

Reading what AI just did is half the job. These three commands cover 90%
of your daily inspection:

### `git status`

Shows the four categories of files (staged, modified, untracked,
unmerged). The shortcut form is `git status --porcelain` — machine-
readable, one file per line, two-character status codes. This is what
scripts (and AI agents) parse. Use the human form when reading,
porcelain when scripting.

### `git diff`

By default shows the working tree vs staging — *what you'd lose if
you discarded changes*. Two key variations:

- `git diff --staged` — shows what'll go into the next commit
- `git diff main...HEAD` — full diff of your branch against main

When Cursor commits something you don't trust, run `git diff HEAD~1` —
that's "what did the last commit change?" You'll catch the wrong-files-
staged bug in 30 seconds.

### `gh pr list` and `gh pr view`

`git` doesn't know GitHub exists; `gh` does. Lists open PRs in your
repo, shows the diff of any one of them, lets you check out a PR
locally with `gh pr checkout 142`. AI builders live in this command —
it's how you review PRs without leaving the terminal.

## A useful rule

If you can read `git status` and `git diff --staged`, you can catch
almost every commit Cursor messes up *before* it lands. Both commands
are read-only. They cost nothing to run. Run them constantly.

Run the editor. We parse a status snapshot and a list of open PRs.
