---
xp: 1
estSeconds: 90
concept: git-three-states
code: |
  # what `git status` would print, parsed into a Python dict.
  # we can't actually shell out to git in the browser, so the
  # rest of this lesson uses parsed status objects like this.
  status = {
      "branch": "feature/auth-fix",
      "staged": ["src/auth.py"],
      "modified": ["README.md"],
      "untracked": ["scratch.py"],
  }

  print(f"on branch: {status['branch']}")
  print(f"staged ({len(status['staged'])}):    {status['staged']}")
  print(f"modified ({len(status['modified'])}): {status['modified']}")
  print(f"untracked ({len(status['untracked'])}): {status['untracked']}")
runnable: true
---

# Git has three states, and AI confuses them constantly

Cursor just made twelve edits across nine files and ran `git commit -am
"refactor"`. Did it commit *all* of your changes? Half? The wrong half?
You can't answer until you understand git's three-state model. Skip
this and you'll either lose work or ship secrets.

## The three states

Every file in a git repo lives in one of three places:

```
working tree   ──> staging area (index)  ──> commit (HEAD)
   (your edits)      (git add)               (git commit)
```

1. **Working tree.** The files on disk as you've edited them. Cursor
   writes here.
2. **Staging area** (also called the *index*). A snapshot of changes
   you've marked for the next commit. `git add file.py` moves changes
   from working tree → staging.
3. **The last commit (HEAD).** What's actually saved in history.
   `git commit` packages everything in staging into a new commit.

That arrow is one-way for `git add` and `git commit`. It's also
reversible: `git restore --staged file` un-stages, `git restore file`
discards working-tree changes.

## The four file categories `git status` shows you

```
Changes to be committed:        # staged   - will land in next commit
  modified:   src/auth.py

Changes not staged for commit:  # modified - in working tree only
  modified:   README.md

Untracked files:                # untracked - git has never seen these
  scratch.py
```

A file can be in *multiple* categories at once. If you `git add` then
edit again, the same file shows up under both "staged" and "modified".
The staged version is what'll commit; the new edits won't.

## What AI does that breaks this

Three patterns Cursor and Claude Code fall into:

- **`git add .` then `git commit`.** Stages every file, including
  `.env` files, scratch notebooks, and large binaries. Always run
  `git status` BEFORE adding, or stage specific files by name.
- **`git commit -am "..."`.** The `-a` auto-stages every modified
  tracked file. It does NOT add untracked files (good), but it also
  doesn't pause to let you review. Cursor uses this constantly.
- **Forgetting `.gitignore`.** AI happily commits `node_modules/`,
  `__pycache__/`, and your virtualenv if there's no `.gitignore`.
  Check the diff before pushing.

## The two CLIs you'll use every day

- **`git`** — the version-control tool. Local commits, branches,
  diffs, history. Doesn't know GitHub exists.
- **`gh`** — GitHub's CLI. PRs, issues, releases, repo creation.
  Wraps the GitHub API so you don't have to leave the terminal.

Real workflow:

```bash
git checkout -b feature/auth-fix     # new branch
# make edits
git add src/auth.py                  # stage one specific file
git commit -m "fix: token refresh"   # commit
git push -u origin feature/auth-fix  # push (first time uses -u)
gh pr create --fill                  # open the PR from the terminal
gh pr view --web                     # open it in the browser
```

> **Browser note:** we can't shell out to `git` here, so we'll use
> Python dicts that match the *structured* output of `git status` and
> `gh pr list`. The patterns and decisions are identical.

Run the editor. We render a parsed `git status` for a typical mid-edit
state.
