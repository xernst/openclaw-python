## Assertions on AI output, not vibes

You've shipped an AI feature. It works on your three test inputs. You demo it. Everyone says "ship it." Two weeks later your customer support inbox lights up because on the inputs you didn't think to test, the model returns nonsense, refuses, or returns the right shape with the wrong content.

There's a name for the discipline that prevents this: eval-driven AI development. It's the test-driven development of the LLM era, and it's the single biggest gap between teams who ship reliable AI features and teams who don't.

This chapter is the introduction. By step 8 you'll have a pytest-style eval suite that runs against any prompt and tells you exactly which inputs passed and which failed.

## Why this exists as a beginner chapter, not an enterprise topic

Most "evals" content on the internet is positioned for ML engineers at large companies — Braintrust, LangSmith, Anthropic's evals cookbook, expensive SaaS dashboards. That's appropriate for production AI infrastructure teams. It's *not* the right starting point for a PM or ops person trying to ship an AI feature without their first deploy lighting up the on-call rotation.

The right starting point is much smaller: a Python file with a list of inputs, a list of expected outputs, and some `assert` statements. Pytest. Maybe a regex check. Maybe a Pydantic schema. That's it. You don't need infrastructure to have a real eval suite. You need fifty lines of Python and the discipline to add one case every time a real customer hits a new failure mode.

## The four eval patterns ranked from strict to loose

Real evals stack from cheapest-strictest to most-flexible. Reach for the cheapest one that works:

1. **Exact match.** `assert output == "Paris"`. Brittle. Works when the prompt has only one valid answer. Surprisingly effective for classification, extraction, simple QA.
2. **Substring / contains.** `assert "paris" in output.lower()`. The 90% case for evaluating natural-language responses where the *fact* matters more than the phrasing.
3. **Shape (Pydantic / regex).** `Receipt.model_validate_json(output)`. Catches the most common production failure mode: "the response was the right shape but with one wrong field."
4. **LLM-as-judge.** Pass the candidate output and the ground truth to a second LLM call: "did A and B convey the same information?" Slow, expensive, and the judge can also lie. Use sparingly, for cases the first three patterns can't catch.

Most teams over-reach for #4 because it sounds smart. The truth is that 80% of useful evals are pattern #2 or #3.

## Why the regression suite matters most

The single most useful eval pattern isn't testing your latest prompt against a fresh dataset — it's catching the moment a *new* prompt breaks an *old* case. Models drift. Prompts get edited. Library versions update. The bug class to fear is "we improved the prompt for case A and silently broke case B."

Run your eval suite on every prompt change. If green, ship. If red, the diff between prompt-old and prompt-new is the cause. Tools like git bisect work on this principle for code; eval suites work the same way for prompts.

## What AI specifically gets wrong about evals

Three patterns:

1. **Tautological evals.** Cursor sometimes generates evals that "evaluate" the prompt by sending the prompt itself to another LLM and asking "is this output good?" — without any ground truth. That's not an eval, that's a tautology. The model is judging its own work. Step 4 of this chapter is spotting this.

2. **Tests that pass on every input.** AI loves writing `assert output is not None`. That eval will never fail. Useful evals fail on bad inputs and pass on good ones. If your eval doesn't fail when you swap a deliberately wrong prompt in, it's not testing anything.

3. **Catching every error and recording it as "passed."** AI defaults to defensive `try: ... except: pass` patterns. In an eval suite that's fatal — every failure becomes invisible. The right pattern: let `assert` raise, let `pytest` collect, let the suite be loud about failures.

## What you'll be able to do at the end

Nine steps. By the end you'll be able to:

- Write a pytest-style eval suite for any prompt — exact-match, substring, shape, LLM-as-judge, in that order.
- Recognize the three "AI shipped a fake eval" patterns and fix them.
- Run regression evals before every prompt change to catch the silent-break-old-case bug.
- Reason about when an eval is good enough to ship and when you need more cases.

Chapter 22 (capstone) ships an agent with an eval suite attached, putting this chapter into immediate practice. Chapter 21 doesn't make you an evals engineer; it makes you the PM who ships AI features that don't break in prod.

Press *Start chapter* below.
