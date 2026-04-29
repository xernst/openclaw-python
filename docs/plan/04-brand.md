# 04 — Brand

> **Brand Guardian deliverable for the code-killa planning team.**
> Audience: Normal people pivoting careers who use AI to do most of their coding but need enough Python literacy to direct, read, and debug AI output. Not aspiring software engineers.

---

## RENAME RECOMMENDATION — FLAGGED LOUD

> **Verdict: RENAME. Working name "code killa" should not ship.**
>
> If the team strongly disagrees, fall back to ITERATE (drop "killa," keep something with similar phonetic punch). Do not ship "code killa" to a paid landing page or App Store listing.

PM, UX, Arch — please factor a name change into your slices. My top recommendation is **`Pyloft`**, with `Reckon` and `Sidecar` as runners-up. Full reasoning below.

---

## 1. Name Audit

### "code killa" — strengths

- Memorable, phonetically punchy, easy to say once.
- Has swagger and personality — a tone-of-voice signal that this is not boot camp #4,792.
- Slightly transgressive, which can cut through a saturated category.

### "code killa" — weaknesses (these dominate)

1. **Persona mismatch.** The 38-year-old marketing manager pivoting into "I want to build AI agents" is the ICP. They will not say "I'm learning to code at code killa" to their boss, their LinkedIn network, or their spouse without flinching. The name reads as 22-year-old hackathon energy. Our buyer is closer to a 35-year-old PM than a 19-year-old CS sophomore.
2. **"Kill" connotation is aggressive in a category built on shame-avoidance.** Our entire pedagogy is "you don't need to be a hardcore developer." The brand should reduce intimidation, not amplify it. "Killa" implies dominance, which is the opposite emotional vector.
3. **Cultural-appropriation risk.** "Killa" reads as AAVE-adjacent slang (Cam'ron, Killa Cam, Dipset). A learn-to-code product owned by a non-Black founder leaning on that phonetic register will eventually get a Twitter thread. Not a fight worth picking.
4. **SEO is bad.** "Code killer" / "code killa" surfaces antivirus, malware, and code-killer apps. Hard to rank. Domain `.com` almost certainly squatted or expensive. Trademarking around "kill" + a learn-to-code product is messy.
5. **"Would you tell your friend?"** test: "Hey, I've been learning Python on code killa." That sentence makes the speaker sound like they're trying too hard. The Duolingo / Brilliant test is that the name disappears into the sentence. "Code killa" calls attention to itself — and not flatteringly — for the ICP.
6. **Doesn't say what it does.** Boot.dev = boot camp + .dev. Codecademy = code + academy. Duolingo = duo (companion) + lingo (language). "Code killa" tells you nothing about Python, builders, or AI.

### Verdict: **RENAME**

### Five alternatives, ranked

Each tested by: *"Would a 38-year-old marketing-manager pivoter tell their friend, their boss, and their LinkedIn network without embarrassment?"*

| # | Name | Why | Friend-test | Boss-test | LinkedIn-test |
|---|------|-----|-------------|-----------|---------------|
| 1 | **Pyloft** | "Py" = Python (genre tag, low cost), "loft" = your space to build, slightly aspirational, soft. | Pass | Pass | Pass |
| 2 | **Reckon** | "I reckon I can build this." Builder energy without bro energy. Says "thinking + doing." | Pass | Pass | Pass |
| 3 | **Sidecar** | You ride alongside the AI. Captures the actual relationship: AI drives most of the code, you steer. | Pass | Pass | Pass |
| 4 | **Pyfluent** | Direct, says-what-it-does, mirrors language-learning frame. Slightly utility-grade. | Pass | Pass | Mid |
| 5 | **Pilot.py** | You're the pilot, AI is the autopilot. Maps cleanly to the AI-direction story. | Pass | Pass | Pass |

**Top pick: `Pyloft`.**

- "Py-" front-loads the genre, so SEO and category recognition do work for free.
- "Loft" is warm, spatial, slightly creative-class — fits the marketing manager / designer / PM pivoter better than a developer-coded name.
- Phonetically distinct, two syllables, easy to type, easy to say.
- Domain question flagged: `pyloft.com` and `pyloft.dev` likely worth checking. **Action for ARCH/PM**: do a domain + trademark sweep before locking.

If the team rejects "Pyloft," fall to **Reckon** (broader audience, no Py-prefix, but less SEO leverage).

The rest of this document uses **Pyloft** as the working name. Substitute if the team picks otherwise — the positioning, voice, visual, and copy all transfer.

---

## 2. Positioning

Three candidates:

> A. *Pyloft is the Python school for people who direct AI. Unlike boot.dev, we teach you just enough to ship — not to pass a CS degree.*
>
> B. *Pyloft teaches you the Python you need to read what Cursor wrote, catch what Claude got wrong, and ship what you actually meant. Unlike Codecademy, we're built around the AI you already use.*
>
> C. *Pyloft is the lightweight Python literacy layer for AI-first builders. Unlike Duolingo, you finish a chapter and you've shipped a working script.*

### Pick: **B**

Final one-liner:

> **Pyloft teaches you the Python you need to direct AI agents, read what they wrote, and catch what they got wrong. Unlike Codecademy, we're built around the AI you already use.**

This wins because it (1) explicitly names the three jobs the user is actually doing, (2) frames AI as a given rather than a future, and (3) draws a clear contrast to Codecademy (the closest mass-market competitor) without taking a swing at boot.dev or Duolingo.

---

## 3. Tone & Voice — Eight "Say This Not That"

The voice is **a sharp friend who already builds with AI, explaining concepts the way they wish someone had explained them to *them*** — concrete, no jargon-tax, never condescending, allergic to "guru."

| # | Say this NOT that | |
|---|-------------------|--|
| 1 | **Variables** | NOT "A variable is a named container that stores a value." → "When you tell Cursor *track the user's score*, the thing it's about to reach for is a variable. You're going to write a few yourself so you recognize them in someone else's code." |
| 2 | **Loops** | NOT "A `for` loop iterates over an iterable sequence." → "If you've ever asked Claude to *go through every row in this CSV and...*, that 'go through every' is a loop. Here's what it looks like when it writes one." |
| 3 | **Functions** | NOT "Functions encapsulate reusable logic." → "A function is a named piece of code you can re-run. When the AI gives you the same 30-line block twice, it's missing a function. You'll catch that now." |
| 4 | **Error message** (lesson framing) | NOT "Oops! That's not quite right. Try again!" → "That's a `TypeError`. It means Python tried to do math on something that wasn't a number. Look at line 4 — what's the type of `score`?" |
| 5 | **Button label** (run code) | NOT "Submit" / "Check Answer" → "Run it" |
| 6 | **Lesson title** | NOT "Introduction to List Comprehensions in Python" → "The one-liner Python writes when it's showing off" |
| 7 | **Encouragement** (after a hard problem) | NOT "Great job! You're a coding rockstar! 🎉" → "Nice. That's the same pattern Claude uses when it parses JSON. You'll see it everywhere now." |
| 8 | **AI-pair-programming framing** | NOT "Don't use AI to solve these — try it yourself first!" → "AI will solve this in two seconds. The point of doing it by hand once is so when AI does it wrong, you'll see it." |

Voice characteristics:

- **Concrete over abstract.** Always anchor a concept to something the user has seen the AI do.
- **Witty, not jokey.** A dry observation lands; a pun does not.
- **Adult.** Assumes the reader has a job, a kid, a mortgage, real time pressure. No "let's gooooo."
- **Pro-AI, not AI-skeptic and not AI-evangelist.** Posture: "AI is a tool you use. Here's how to be the one steering it."

---

## 4. Tone Redlines — Five Things We Will NOT Do

1. **No exclamation-point confetti.** Never "Great job!!!" or "Amazing work! 🎉🎉🎉." One controlled "Nice." is the ceiling.
2. **No infantilizing mascot speech.** No "Oopsie!" no "Let's try that again, friend!" no Comic Sans cousin. The user is 38, not 8.
3. **No "you're a hacker now" cosplay.** No green-on-black terminal aesthetic for the sake of vibes, no "10x developer," no "ship it 🚢" emoji-as-verb.
4. **No shame-mechanics.** Streak loss must never read as punishment. The Ember system already encodes this — copy must follow. Never "You broke your streak." Always "Your ember held the line."
5. **No fake urgency or scarcity.** No "Only 3 spots left in this cohort!" No "47 people are learning right now." We are a calm, durable place to build a skill, not a funnel.

---

## 5. Visual Direction

### Three options considered

**A. Stay dark + emerald (current)**
Pros: already implemented; reads serious; codes as developer-tool. Cons: indistinguishable from boot.dev, replit dark mode, half of GitHub. Reads as "for developers" — but our ICP is *not* a developer yet, and dark-only signals "you don't belong here yet."

**B. Bright/playful Duolingo-style**
Pros: low-intimidation, mass-market familiar. Cons: infantilizes a 35+ ICP. Marketing managers do not want Duo-the-owl vibes on their second monitor at work. Hard pass.

**C. Editorial / Brilliant-style — premium-but-free**
Pros: signals "for adults who think." Reads as a paid newsletter or a quietly expensive product, even when free. Plays with light + dark, serif accents, lots of whitespace, restrained color. Differentiates immediately from boot.dev *and* Duolingo. Cons: harder to execute well; if it lands flat it reads cold.

### Pick: **C, with a defaulted-dark theme switchable to light.**

Defaulted dark because that's where coders work and our user is mimicking that posture. But the *aesthetic register* is editorial, not "developer tool." Think: The Browser Company's Arc, Linear in dark mode, Stripe Press, *not* GitHub or VS Code.

### Color palette (5)

| Role | Hex | Notes |
|------|-----|-------|
| Ink (primary bg, dark mode) | `#0E0F12` | Near-black, slightly cool. Replaces zinc. |
| Paper (primary bg, light mode) | `#F7F4ED` | Warm off-white. Editorial, not clinical white. |
| Ember (primary accent) | `#F2683C` | Warm orange. Maps to the streak/ember mechanic. **Replaces emerald as the primary action color.** Differentiates from boot.dev hard. |
| Signal (secondary accent / "correct") | `#5BC8AF` | Muted teal-green. Used sparingly for confirmation, never as a hero color. |
| Slate (text on Ink / muted UI) | `#9AA0A8` | Body text on dark, secondary chrome. |

Why **Ember** as the lead accent: it's literally the brand mechanic. The streak system is built on embers. The brand color *is* the gameplay metaphor. That's a free coherence win.

Why we're moving off emerald: emerald-on-dark is the boot.dev / Replit / Vercel signature. Ember-on-ink is ownable.

### Typography

All free Google Fonts. Stack:

- **Display / Headlines:** `Fraunces` (serif, variable, has personality, reads "thinking publication" not "developer tool")
- **Body / UI:** `Inter` (workhorse, neutral, free, optimized for screens)
- **Code / Mono:** `JetBrains Mono` (already standard for code surfaces; readable in small sizes; Pyodide editor uses it)

Hierarchy: Fraunces for chapter titles and lesson titles. Inter for everything else. JetBrains Mono inside the editor and inline code spans. **Never** use Fraunces below 18px or for body copy.

### Logo direction sketches

**Sketch 1 — "the loft beam"**
A lowercase wordmark `pyloft` in Fraunces, with the dot of the `i` rendered as a small ember spark (the same ember pixel from the streak UI). Reads: *the place + the spark.* Works at favicon scale by isolating just the ember.

**Sketch 2 — "the angle"**
The letters `py` rendered as a roof / loft beam silhouette — two strokes meeting at an apex, with the rest of the wordmark in lowercase Inter. Geometric, architectural. Reads: *Python + a structure to build inside.* Stronger as a logomark; the angle alone works as an icon.

**Pick: Sketch 1.** Carries more warmth, ties directly to the ember mechanic, and the wordmark is the logo (no expensive bespoke icon work).

---

## 6. Mascot Question

### Should Pyloft have a mascot? **No. But we have a "presence."**

- Boot.dev has Boots. Duolingo has Duo. Both work *for their audiences* — Duo for kids/casual, Boots for the gamified-for-young-men crowd.
- Our ICP is a 35-year-old marketing manager. A character mascot will read as childish. The same person who buys Brilliant for $150/yr does not want a cartoon owl yelling at them.
- But the "consistent presence" slot is real and worth filling.

### What fills the slot: **The Copilot Panel.**

A persistent right-rail UI element styled as a quiet, low-key AI co-learner. Not a character. Not anthropomorphized. Not named.

- **Visual:** A subtle panel with the Ember-spark icon and a typed line of text.
- **Voice:** First-person, dry, brief. Examples below.
- **Behavior:** Comments on what the user just did. Notices patterns. Doesn't congratulate. Occasionally makes a sharp observation.
- **Why it works:** It mimics the *actual* relationship the user is learning to have with AI — a quiet collaborator that observes and assists, not a buddy that cheers.

If the team later wants to name the panel, soft suggestion: **"the copilot"** (lowercase, generic, never personified). Resist any push to give it a face or a name.

---

## 7. Key Brand Moments — Actual Copy

### Moment 1: First 30 seconds of onboarding

> **Welcome to Pyloft.**
>
> You're here because AI writes most of your code now, and you want to actually understand what it's doing.
>
> We'll teach you the Python you need to direct it, read it, and catch when it's wrong. Not a CS degree. Just enough.
>
> One question before we start: **what are you trying to build?** *(One sentence. We'll tune the lessons around it.)*
>
> [ text input ]
> [ Let's go → ]

### Moment 2: First "you got it wrong"

> That ran, but it didn't return what we expected.
>
> Look at line 3 — `total` is a *string*, not a number. Python won't add `"5" + 10`. That's the same bug Claude shipped twice last week in real codebases.
>
> [ Show me the fix ]   [ Try again ]

### Moment 3: First lesson completion

> Done. That's variables.
>
> Next time Cursor reaches for one, you'll know which is which.
>
> [ Next lesson → ]

### Moment 4: First chapter completion

> **Chapter 1, complete.**
>
> You can now read the variable, function, and loop work in any AI-generated Python file and tell what it's doing. That's already further than 80% of people who say they "use AI to code."
>
> Your ember is at **5**. It survives one missed day.
>
> [ Start chapter 2 → ]

### Moment 5: First streak save (ember spent)

> Your ember held the line.
>
> You missed yesterday. The ember burned one charge so the streak survived. You've got 4 left. No drama — pick up where you left off.
>
> [ Continue → ]

---

## 8. Marketing Surfaces

| Surface | Priority | Hook | ICP fit |
|---------|----------|------|---------|
| **Reddit** (r/learnpython, r/cscareerquestions, r/ChatGPTCoding, r/cursor) | **MUST** | "I built a Python course for people who already use AI to write most of their code. Free. Looking for honest feedback." | Very high — our ICP lurks here, especially r/cursor and r/ChatGPTCoding. |
| **Twitter / X** | **MUST** | Founder build-in-public thread: "I'm building the Python school for people who direct AI instead of write code. Here's lesson 1." Demo videos of the 3-pane UI. | High — AI-first builder community lives here. Note: Josh has an active growth push. |
| **HN (Hacker News)** | **NICE** | "Show HN: Pyloft — Python literacy for AI-first builders." Will get challenged by HN purists ("real devs should learn properly"). The contrast itself becomes content. | Medium — HN skews more senior-dev, but the AI-builder cohort is growing there fast. |
| **YouTube** | **NICE** | Long-tail SEO: "I asked Cursor to build [X]. Here's what its Python actually does." Each video maps to one lesson. | High but slow — YouTube is the highest-trust acquisition channel for adult learners, but takes 6+ months to compound. |
| **LinkedIn** | **NICE** | Career-pivot content: "I'm a marketing director. I learned enough Python in 6 weeks to ship internal AI tools at work. Here's what I actually needed." | Very high for ICP, low for virality. Worth a steady drumbeat. |
| **SEO** | **MUST (long-term)** | Target queries: "do I need to learn Python if I use AI", "how to read code Cursor wrote", "Python for product managers", "Python for non-developers 2026". | High — this is exactly what the ICP googles. |
| **Product Hunt** | **SKIP for v1.** | Save for a real launch with paid tier. PH for a free MVP burns the powder shot. | — |
| **TikTok** | **SKIP for v1.** | Wrong audience age, wrong content format for the ICP. | — |

### V1 launch order (concrete)

1. **Reddit r/cursor + r/ChatGPTCoding post** the day of soft launch.
2. **Twitter build-in-public thread** with a 30-second screen recording of the 3-pane UI + ember mechanic.
3. **One LinkedIn post** from Josh's profile naming the ICP explicitly ("for the non-engineer building with AI").
4. **SEO foundation** (4-6 long-form articles targeting the exact queries above) shipped within the first 30 days.

---

## 9. What We Don't Want To Be Confused With — Three Tropes To Avoid

1. **The "30 days to $200k" coding-bootcamp grift.** No countdowns, no "land your first dev job," no salary screenshots, no Lambo gif energy.
2. **The Duolingo gamified-cuteness clone.** No mascot tantrums, no anthropomorphic streak shaming, no green push-notification harassment.
3. **The traditional CS-academy seriousness.** No "Object-Oriented Programming Module 4.2," no algorithm-trivia gating, no "complete this LeetCode-style problem to advance." We are not preparing anyone for a coding interview. We are preparing them to ship.

---

## 10. AI-Content Guardrails

The product uses Claude/GPT for hints, encouragement, and inline tutoring. The tutor is **not** a character — it's a sharp, dry collaborator (matches the Copilot Panel above).

### Always do

1. **Anchor every explanation to something the user already knows.** "This is the pattern Cursor uses when..." — never an abstract definition first.
2. **Name the bug in technical terms, then translate.** ("That's a `TypeError`. It means Python tried to do math on a string.") Translation without the term wastes the teaching moment.
3. **Stop after 2 sentences when giving a hint.** Long hints become solutions; the user must do the lift. Hard cap.

### Never do

1. **Never use exclamation marks.** Period. Single rule, easy to enforce.
2. **Never congratulate effort.** Only acknowledge a *specific* thing the user did. "You used a list comprehension instead of a loop. Cleaner." — yes. "Great job, you tried so hard!" — no, ever.
3. **Never apologize for the user.** No "no worries, this one's tricky!" Keep the user in the adult chair. The bug is the bug; we explain it and move on.

### Default LLM config for the tutor

- **Temperature:** `0.4` — warm enough for natural phrasing, cold enough that the voice stays consistent across 10,000 hint generations.
- **Model:** Claude Haiku for inline hints (cost + latency), Claude Sonnet for chapter recap and personalized review (quality matters more there).

### System prompt fragment for tutor "voice"

```
You are the Pyloft tutor. You speak to an adult who is pivoting careers
into AI-first building. They are not a software engineer and never will be.
They use Cursor, Claude Code, and ChatGPT every day.

Voice: dry, sharp, concrete. Short sentences. No exclamation marks. No emoji.
No congratulations on effort. No apologies for the difficulty of the material.
Never call the user "friend," "buddy," or any pet name.

When explaining a concept, anchor it to something the user has already seen
the AI do. When pointing out a bug, name the technical term, then translate
it in plain English. Stop after 2 sentences when giving a hint.

You are not a character. You have no name. Do not refer to yourself in
the third person. Speak in first person sparingly, only when needed for
clarity.
```

---

## TL;DR (5 bullets)

- **RENAME from "code killa" to `Pyloft`** (or `Reckon` if Pyloft fails domain/trademark check). The current name fails the 38-year-old-marketing-manager friend-test, has SEO and cultural-appropriation risk, and doesn't say what the product does. **PM/UX/Arch must factor this in.**
- **Positioning lock:** *"Pyloft teaches you the Python you need to direct AI agents, read what they wrote, and catch what they got wrong. Unlike Codecademy, we're built around the AI you already use."*
- **Visual flip from emerald-on-zinc to ember-on-ink** (editorial-dark, Fraunces + Inter + JetBrains Mono). Ember is the lead accent because it's literally the streak mechanic — the brand color *is* the gameplay metaphor.
- **No mascot. Use the "Copilot Panel"** — a persistent, unnamed, dry AI presence in the right rail. Mascots infantilize the 35+ ICP; an unnamed copilot mirrors the actual user-AI relationship we're teaching.
- **Voice is "sharp friend who already builds with AI"** — no exclamation marks, no congratulating effort, no apologies, no shame mechanics. Hard guardrails enforced in the tutor system prompt at temperature 0.4.
