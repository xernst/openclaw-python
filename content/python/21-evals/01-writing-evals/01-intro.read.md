---
xp: 1
estSeconds: 110
concept: eval-mindset
code: |
  # the canonical eval shape — input, expected, actual, pass/fail.
  cases = [
      {"name": "extract_email_simple",
       "input": "ping me at sam@example.com",
       "expected": "sam@example.com"},
      {"name": "extract_email_with_punct",
       "input": "(maya@example.com)",
       "expected": "maya@example.com"},
  ]

  # in real life this would call an LLM. here it's a stub.
  def fake_extract(text):
      import re
      m = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
      return m.group(0) if m else None

  passed = 0
  for c in cases:
      actual = fake_extract(c["input"])
      ok = actual == c["expected"]
      passed += ok
      print(f"{c['name']}: {'PASS' if ok else 'FAIL'}")
  print(f"{passed}/{len(cases)}")
runnable: true
---

# The bar: tests that fail when AI gets worse

Every team that ships AI features and lives long enough to ship version
two has the same realization: *"the demo worked, prod doesn't, and we
can't tell what changed."* The fix is not better prompts. It's
**evals** — small, repeatable tests that exercise the AI on known
inputs and check the output against known answers.

Run the editor on the right. That's the eval pattern in 20 lines: a
list of cases, a function that produces the answer (in real life,
calling Claude or GPT — here, a stub), and a comparison. If the answer
matches expectations, the case passes. Done. *That's an eval.*

You can write your first eval in five minutes. You should write it
*before* you ship the feature, and run it *every time you change the
prompt.* Without evals, "did this prompt change make things better?"
becomes a vibe check. With evals, it becomes a number.

## Why this matters more for AI than for normal code

A regular function returns the same thing every time. If `add(2, 3)`
returns `5` once, it returns `5` forever. So you write the test once
and forget it.

AI is different in two ways that matter:

1. **The output is non-deterministic.** Same input, slightly different
   output, run after run. Sometimes the difference is harmless
   ("Hello!" vs "Hi!"). Sometimes it's a regression that ships to
   users.
2. **The "correct" answer is fuzzy.** What does "extract the email"
   even mean for the input `"contact info: maya at example.com"`? You
   need to think about what counts as a pass *before* you write the
   eval, not after.

Both problems are solved by writing the eval *before* the prompt and
treating the eval as the spec.

## The mental model

Evals are unit tests, but for behaviors instead of branches. The shape
is the same as any other test:

```py
def test_extract_email_simple():
    assert fake_extract("ping me at sam@example.com") == "sam@example.com"
```

`assert` is the whole game. If the comparison is true, the test
passes. If it's false, Python raises `AssertionError` and pytest
reports a failure. There's no special framework you need to install.

## The four eval patterns you'll write 90% of the time

We'll cover each in detail in the next read step, but here's the menu:

1. **Exact match.** `actual == expected`. Use when the output should be
   one specific thing — an extracted entity, a structured value, a
   yes-or-no answer.
2. **Contains.** `expected in actual`. Use when the output is longer
   prose but must include a specific phrase.
3. **JSON-schema-validates.** Use when the AI is producing structured
   output and you care about *shape* more than exact text.
4. **LLM-as-judge.** Use sparingly, for vibe-checks where rules don't
   work. Slow, expensive, can lie. Avoid until you've exhausted the
   first three.

## Where AI specifically gets evals wrong

Two failure modes you'll see when you ask Cursor to "write some evals
for this":

1. **It generates evals from the same prompt.** It writes test cases
   by asking the same model what the answers should be. That's not an
   eval — that's a tautology. The expected values must come from
   *humans* (or a known-good source).
2. **It writes overly-strict assertions.** AI tends to write
   `actual == "Hello, Sam!"` when what you want is `"sam" in
   actual.lower()`. Strict equality on natural language fails the first
   time the model paraphrases.

Both of these will burn you in the first hour of writing evals.
We'll fix one of them in step 7.

## What's in this lesson

Eight more steps. By the end you'll have a working eval suite for a
toy AI feature, you'll know which assertion to reach for in which
situation, and you'll have a regression eval — the one that prevents
yesterday's bug from coming back tomorrow.
