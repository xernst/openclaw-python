## When the model lies to your customer

Tuesday, 2pm. A customer support ticket lands. "Your AI assistant told me my refund was already processed. It hasn't been." The screenshot is on your screen. The model said something fluent and confident and wrong. There is no stack trace. Nothing crashed. The assistant just made it up, and now you have to figure out what to fix and ship a change before anyone else sees the same answer.

This chapter is the methodology for that Tuesday afternoon. The teams that recover from these moments well are not the teams with the best prompts. They are the teams that know what to look at, in what order, and which of the four common breakage classes the failure belongs to. The teams that recover badly say "the model hallucinated" and ship a vibe fix that doesn't address the actual cause.

You'll leave this chapter with a debugging checklist that turns "what happened" from a 4-hour panic into a 20-minute investigation, plus the discipline to actually file the right fix instead of patching the prompt and hoping.

## What you'll actually do here

Look at the trace, not the chat. Chapter 20 taught you to read traces. This chapter is what you do once you can read them. You'll walk through real broken-output traces and learn to spot the moment the failure happened. Spoiler: it's usually not the model. It's usually the input the model was given.

Sort the failure into one of four classes. Almost every "the model is broken" report falls into one of these:

1. The retrieval gave the model the wrong context. The model dutifully answered from bad data. (Chapter 22 territory.)
2. The prompt didn't tell the model what to do clearly enough, and the model picked an obvious-but-wrong interpretation.
3. The model genuinely hallucinated, in a context where the right answer wasn't available to retrieve.
4. The downstream code mangled the model's correct output before showing it to the user. (Often a JSON parse, a string trim, a regex, or a missing field.)

These four have completely different fixes. Misclassify them and you ship the wrong fix. The lessons walk through real examples of each.

Run the post-mortem in writing. The teams that get good at this run a short, structured post-mortem after every customer-visible AI failure. You'll learn the four-question template and where to file the doc.

## What AI gets wrong about debugging when you ask it to fix the bug for you

Ask Cursor to fix a broken AI output and Cursor will almost always do one of three things, in order of frequency:

1. Suggest a prompt edit that makes the answer "more careful." This works for the one example you tested and breaks two adjacent cases you didn't.
2. Add a regex post-filter to scrub the bad output. This works in dev, then a real user phrasing breaks the regex and the bug returns silently.
3. Suggest switching to a bigger model. This sometimes works. It also sometimes makes the bug more confident.

You'll learn to recognize all three reflexes in your own code and in the AI's suggestions. The right fix is usually upstream of where the bug surfaces. Chasing it where it surfaces is what bad debugging looks like.

## The principle the chapter pivots on

Don't blame the model. Blame the system. The model is one component of a feature that includes context, prompt, post-processing, UI, and the user's intent. Failures are almost always in the seams between those, not in the model itself. The discipline of finding the seam is what separates the teams who debug AI features fast from the teams who don't.

A second principle: every customer-visible AI failure is also an eval gap. If your evals had caught it, the user wouldn't have. The exit move from this chapter is folding what you learned into the eval suite from chapter 21, so the next time the same class of failure happens, your CI catches it before any user does.

## Where this fits in your week

If you have an AI feature in front of users right now, the next time it breaks, walk through this chapter's debugging checklist instead of starting from scratch. The methodology is the same whether the feature is a chatbot, a summarizer, an internal tool, or a multi-step agent. By the third broken-output you debug with the checklist in hand, the rhythm sticks and the panic shrinks.
