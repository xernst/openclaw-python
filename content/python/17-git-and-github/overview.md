## The version-control workflow you actually need in 2026

Most "learn git" tutorials open with the SVN-vs-git history lecture and twelve sub-commands you'll never use. This chapter is the opposite: the eight commands you'll run a hundred times a week as someone shipping with Cursor and Claude Code, the GitHub CLI moves that replace clicking around the GitHub website, and the specific bugs AI ships into your branch that you need to spot before they get merged.

If you've already used git for a year, half of this will be review. The half that isn't — the AI-builder workflow, the `gh` CLI, the way Claude Code expects you to commit — that's why the chapter exists.

## The three states is the only mental model you need

Every file in a git repo is in one of three places:

- **Working tree** — the actual files on disk you edit.
- **Index (staging area)** — the snapshot you've prepared for the next commit.
- **HEAD (the repo)** — the commits already saved.

Every git command is a transition between these. `git add` moves working tree → index. `git commit` moves index → HEAD. `git checkout` moves HEAD → working tree. `git diff` shows the gap between any two of them.

Once you can name where each file is right now, every git command starts to read like English. *I'm staging this hunk so it goes into the next commit.* *I'm checking out this file from HEAD because I edited it by accident.* The mystery dies.

## Why the GitHub CLI matters more in 2026 than it did in 2022

Claude Code and Cursor expect you to use `gh`. Their slash commands assume it's installed. Their PR-creation flows shell out to `gh pr create`. The agent traces you'll read in chapter 20 reference `gh pr view` and `gh issue list`. If you're on the GitHub website clicking buttons, you're working slower than your tools expect, and the AI you're directing can't see what you're seeing.

The good news: `gh` is small. Five commands cover 90% of usage. `gh pr create`, `gh pr list`, `gh pr view`, `gh issue create`, `gh repo clone`. Once those are in your hands, you stop opening github.com for anything except UI-only things like merging.

## What AI specifically gets wrong with git

Three patterns Cursor and Claude Code ship that you'll spot in PRs:

1. **Staging .env or other secrets.** AI runs `git add .` because it's the most common pattern in its training data. Nobody actually wants to stage everything. Step 6 of this chapter is the exact bug — a script that filters `staged_files` for safety-critical things, but with the filter inverted (keeps the secrets instead of removing them). PMs who learn to read this kind of code in the diff will catch the leak before it ships.

2. **Force-pushing to main.** Cursor sometimes generates `git push --force` in scripts. On a feature branch, fine. On main, catastrophic. The `gh` and git tooling will warn you, but you have to understand what the warning means.

3. **Mangled commit messages.** AI writes "Update files" or "Fix bug" because that's what most of its training data looks like. Real teams require subject + body, conventional-commit prefixes, issue references. Step 8 of this chapter is writing one well; once you've written one well you'll never accept "Update files" again.

## The three states applied to AI workflows

When you let Claude Code make changes, the changes land in your **working tree**. They aren't safe yet. They aren't reviewed yet. They aren't committed.

The way you stay in control is to `git status` after every Claude Code session, `git diff` to see what actually changed (versus what Claude Code says it did — those don't always match), `git add -p` to stage hunks selectively, and `git commit` with a real message. The three-states model is also the AI-trust model: until you've moved a change into HEAD, you can revert. Once you've pushed, you're committed.

## What you'll be able to do at the end

Nine steps. By the end you'll be able to:

- Name where any file is in the three-state model and how to move it.
- Run the eight git commands that cover daily AI-builder work without looking them up.
- Use `gh pr create`, `gh pr list`, and `gh pr view` from the terminal in place of github.com.
- Spot the three top "AI shipped this wrong" patterns in git and gh code.
- Write a commit message that gets through code review on the first pass.

Chapter 18 (secrets and env) immediately follows because the most common AI-shipped git mistake is committing secrets — and that's the one you cannot recover from after the push. Chapter 17 makes you fluent in the workflow; chapter 18 keeps you out of the worst trap.

Press *Start chapter* below.
