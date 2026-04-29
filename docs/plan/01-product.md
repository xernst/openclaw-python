# 01 — Product Plan: code killa (working title)

**Author:** Alex (PM)
**Status:** Draft v1.1 — updated 2026-04-29 to absorb Brand inputs
**Last updated:** 2026-04-29
**Owner:** Josh Ernst

---

## Changelog v1.1 (2026-04-29)

- **Rename pending:** Brand recommends renaming to **Pyloft** (fallback: Reckon). I agree with the rationale (cultural-appropriation risk + persona mismatch + bad SEO). Treating "code killa" as a working title from this point forward. **Lock blocked on Arch's domain + trademark sweep** — see updated decision point #1 below.
- **Positioning sentence updated** to Brand's wording (concrete, names the three jobs). Old version superseded — see §2.
- **ICP #1 age range under discussion with Brand.** Brand's voice/visual work is anchored to a 38-year-old career-pivoter. My MVP ICP #1 is 29. These are not the same human and the gap matters for product, copy, and channel. Flagged back to team-lead and Brand. Tentative resolution: keep Maya at 29 as MVP target, broaden written persona band to "late-20s to late-30s knowledge worker pivoting toward AI building" so Brand's voice work still applies. Final call needed from Josh — see updated decision point #6.

---

## 1. Ideal Customer Profile

We are not building for "people who want to learn to code." That market is saturated and that user gives up. We are building for **people who already use AI tools daily and have hit the ceiling of what they can do without code literacy**.

Three personas, ranked by priority. ICP #1 is the only one that matters for MVP.

### ICP #1 — "Maya, the AI-Curious PM" (PRIMARY)

- **Profile:** 29, mid-level Product Manager at a 200-person SaaS company. Liberal arts degree. 5 years PM experience.
- **Why she needs code now:** Her team is shipping AI features. She uses Cursor and ChatGPT to draft specs and prototypes, but every time she tries to *modify* generated code, she gets stuck. She can't tell when Claude is hallucinating an API. She wants to ship a working internal tool herself instead of waiting six weeks for engineering.
- **What she's tried:** Codecademy (got bored at the syntax drills), a Coursera Python course (didn't finish week 2), bought a Udemy course for $14.99 (watched 3 videos). Tried boot.dev for two weeks but the gamification felt infantilizing and the curriculum assumed she wanted to be a backend engineer.
- **Why she bounced:** Existing courses teach Python as if she's becoming a software engineer. She doesn't want to invert a binary tree. She wants to read what Cursor wrote, know if it's wrong, and fix it.
- **What would actually work:** Short evening sessions (15-25 min). Lessons framed around "here's what AI just wrote you — what does it do, why is it broken, how do you fix it." A clear sense that this is *for her*, not a watered-down CS curriculum.

### ICP #2 — "Marcus, the Ops-to-Builder Career Pivot" (NON-TECH PIVOTER)

- **Profile:** 34, currently Operations Manager at a logistics company, $85K. Wife is pregnant. Sees that AI is reshaping his industry and his current skills are evaporating in slow motion.
- **Why he needs code now:** He's seen ops peers get laid off and replaced with workflow automations. He wants to be the person who *builds* the automations, not the one being automated. He's been told by every "learn to code in 2026" article that AI changes everything but isn't sure what to actually study.
- **What he's tried:** freeCodeCamp (made it through HTML/CSS, stalled at JavaScript week 4 — too long, too abstract). Watched 30 hours of YouTube. Tried to build a Zapier replacement on a weekend, got overwhelmed by venv errors.
- **Why he bounced:** No clear endgame. Every course implies the goal is "junior software engineer at a FAANG." He doesn't want that. He wants to build internal tools, automate his department, and command $130K as an "ops + AI builder" hybrid.
- **What would actually work:** Curriculum framed around real outcomes (build a CSV-to-Slack-bot, scrape inventory levels, automate vendor emails). Trust that he can use AI to write the code; teach him to read, debug, and direct it.

### ICP #3 — "Priya, the Indie Founder Who Got Stuck" (BUILDER MIDGAME)

- **Profile:** 26, dropped out of consulting, building a B2B SaaS solo. Vibe-codes with Cursor. Paying $200/mo in API credits.
- **Why she needs code now:** Her app works for 3 customers. The 4th customer hit an edge case and Cursor's fix broke two other things. She realizes she's accumulating technical debt she can't read.
- **What she's tried:** Skipped fundamentals entirely. Now Googling specific errors, hitting StackOverflow, and feeding screenshots to Claude.
- **What would actually work:** A targeted "fundamentals for vibe coders" track. Not 28 chapters — maybe 8. Skip syntax, focus on *mental models*: what is state, why does this loop hang, what's a class actually for, how do I read a stack trace.

**Decision: Build for Maya. Marcus is the secondary growth wedge once Maya works. Priya is a future targeted track, not v1.**

---

## 2. Positioning

**Canonical positioning sentence (locked with Brand, 2026-04-29):**

> **Pyloft teaches you the Python you need to direct AI agents, read what they wrote, and catch what they got wrong. Unlike Codecademy, we're built around the AI you already use.**

This wins because it (1) names the three concrete jobs the user is doing — direct, read, catch — instead of the abstract "literacy" frame, (2) treats AI as a given rather than a future trend, and (3) draws the contrast against Codecademy (the closest mass-market competitor) without picking unwinnable fights with boot.dev or Duolingo.

| Compared to | They are | We are |
|---|---|---|
| **boot.dev** | Gamified backend-engineering bootcamp for aspiring devs | Python literacy for AI-first builders who don't want to be devs |
| **Codecademy** | Syntax drills with paywalled depth | Concept-first lessons where every example is something AI just wrote you |
| **freeCodeCamp** | Comprehensive, free, broad — but you're on your own | Opinionated, narrow, built for one audience: AI-builders |
| **Duolingo (the mechanics)** | Dark-pattern streaks engineered for daily app opens | Embers and grace days — "welcome back" not "you lost everything" |

---

## 3. Core insight (the wedge)

Every existing platform — boot.dev, Codecademy, Coursera, freeCodeCamp — assumes the student wants to **become a software engineer**. The curriculum is shaped by that endgame: data structures, algorithms, OOP deep-dives, leetcode prep.

**That endgame is dead for our ICP.** Maya doesn't want to invert a binary tree. She wants to look at 200 lines of Python that Claude just wrote and know whether it works.

The wedge is a curriculum **inverted around the AI-builder workflow**:

1. **Read first, write second.** Most lessons start with code Maya didn't write — generated, copied, found — and ask her to predict, explain, and modify.
2. **Skip what AI handles fluently.** No 90-minute lessons on string formatting minutiae. AI doesn't get string formatting wrong.
3. **Double down on what AI gets wrong.** Hallucinated APIs, silent type bugs, off-by-one errors, environment setup, "why does my venv not see the package," reading tracebacks. These are the moats.
4. **Mental models over syntax.** State, mutation, scope, async, exceptions. The stuff you need to *direct* AI.

This is the bet: **boot.dev is selling 1995 fundamentals with 2025 gamification. We're selling 2026 fundamentals with 2026 gamification.** AI didn't make Python literacy obsolete — it made *which* parts matter completely different.

This wedge is also what justifies its existence as an OSS / free product. The for-profit incumbents can't pivot here without nuking their backend-engineer brand.

---

## 4. MVP definition

**Smallest thing that delivers real value to Maya alone.**

### IN scope
- 8 lessons covering the foundational arc of "read AI-generated Python and know what it does":
  1. Variables and types (read, don't write)
  2. Functions and return values (the most-hallucinated thing)
  3. Lists and dicts (the bones of every API response)
  4. Loops and comprehensions (predict the output)
  5. Conditionals and truthiness (where AI silently bugs)
  6. Reading a traceback
  7. Mutation and state (why your code mysteriously breaks)
  8. Modules and imports (why your venv hates you)
- 3-pane lesson UI (already built): instruction, code, output
- Pyodide-in-worker code execution (already built)
- Brain-dump inbox (P0 for ADHD — already built)
- localStorage progress (already built)
- Embers, no streaks (per ADHD research)
- "Welcome back" UX, never guilt

### OUT of scope
- Auth / user accounts
- Server / backend / database
- Payments
- Mobile-optimized layout
- Full 28-chapter curriculum (de-Josh'd later)
- AI mascot, gem store, boss battles, leagues
- Certificates
- Community features

### Acceptance criteria for MVP-shipped
- Maya can complete all 8 lessons in one weekend (~3-4 hours total)
- Each lesson has at least 3 "predict the output" exercises and 1 "fix the AI-generated code" exercise
- Zero infra cost (Pyodide stays in browser)
- Works on Chrome desktop. iOS and Firefox are bugs to fix post-V1.
- Three of Josh's friends complete it without giving up
- Brain-dump captures input in <500ms, persists across reloads
- No login wall, no email gate, no paywall

---

## 5. Phasing — V1 / V2 / V3

### V1 — "Ship to friends" (target: 4 weeks of evening time)
- The 8-lesson MVP above
- Hosted on Vercel free tier at codekilla.dev (or similar)
- Shared via DM to ~10 friends Josh trusts to give honest feedback
- Goal: validate that the wedge resonates with non-Josh humans
- Success: 5 of 10 friends finish all 8 lessons within 2 weeks of receiving the link

### V2 — "Ship to r/learnpython" (target: 8 more weeks)
- Expand to 16 lessons (add: error handling, file I/O, basic API calls, classes-just-enough, regex-just-enough, working with JSON, debugging strategies, "directing AI" meta-lessons)
- De-personalized content (replace specific personal references with rotating templated personas or generic examples)
- Optional account system (localStorage + magic link only, no passwords)
- Reddit-ready landing page with clear "who this is for / who this isn't for"
- Goal: 500 organic signups from one Reddit post
- Success: >30% of signups complete lesson 1, >10% complete lesson 8

### V3 — "Revenue-capable" (target: 6 months out, only if V2 hits)
- Full 28-chapter curriculum
- Optional paid tier: $7/mo or $49/yr (intentionally below boot.dev's $29/mo)
- Free tier remains generous (first 16 lessons fully free, forever)
- Paid tier unlocks: targeted tracks (Maya track, Marcus track, Priya track), AI-tutor "explain this lesson differently," cohort cohorts/body-doubling rooms
- Optional self-host / OSS path remains alive
- Goal: $500 MRR within 90 days of V3 launch

**Hard gate: do not start V2 until V1 has 5/10 completion. Do not start V3 until V2 hits 500 signups.**

---

## 6. Success metrics

This is a personal-use + small-audience product. We measure outcomes, not vanity.

| Horizon | Metric | Target |
|---|---|---|
| **Week 1** post-V1 | Friends who started lesson 1 | 7 of 10 |
| **Week 1** post-V1 | Bug reports / friction reports captured | ≥10 (more = better signal) |
| **Month 1** post-V1 | Friends who completed lesson 8 | 5 of 10 |
| **Month 1** post-V1 | Josh's own retention (he uses it himself nightly) | 20+ sessions logged |
| **Month 6** (post-V2 launch) | Total signups from organic | 500+ |
| **Month 6** | Lesson 1 → lesson 8 completion rate | >10% |
| **Month 6** | Median session length | 12-25 min (ADHD sweet spot) |
| **Month 6** | NPS from completers | ≥40 |

**Anti-metrics we explicitly ignore:** total registered users, daily active users, time-on-site (longer is *worse* for ADHD users), social shares.

---

## 7. Pricing strategy

**Decision: Free + open-source, with optional paid tier appearing only at V3.**

Reasoning:
1. **Distribution is the moat for an indie founder, not pricing.** Free + OSS gets us to the first 5,000 users. Paid gates at this stage kill the wedge.
2. **OSS solves the "Josh quits paying for hosting" risk** — see risk #1 below. If the repo is public and the architecture is static-files + Pyodide (zero backend), anyone can fork it and self-host for free, forever.
3. **It's a credible signal that we're not boot.dev.** Non-tech pivoters like Marcus are burned by paywalls. Free + OSS is a trust accelerant.
4. **It postpones the hardest decision** (what to charge for) until we have signal that anyone wants it. Charging in V1 is a forecast; charging in V3 is a measurement.

**The "Josh quits paying" risk is mitigated structurally**: Pyodide-in-browser means there is no server to pay for. Vercel free tier covers it. If even Vercel goes away, the static export runs from any static host or even GitHub Pages. The product is *post-hosting*. This is a hidden architectural superpower.

---

## 8. Top 5 risks (ranked)

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | **Josh runs out of evening time and stalls.** Single founder + ADHD + grad school + consulting work = high abandonment risk. | High | High | (a) Phase gates are small (8 lessons, not 28). (b) The product itself is Josh's own learning tool — he uses what he builds. (c) V1 acceptance is "5 friends finish," not "10K users" — survivable goal. (d) Brain-dump inbox protects against context loss between evening sessions. |
| 2 | **The wedge doesn't resonate.** Maya tries it and says "this is just Codecademy with different vibes." | Medium | Critical | Sprint 1 includes 3 user interviews with real Mayas before we write lessons 4-8. If wedge fails interviews, kill the project before lesson 4. Don't sunk-cost-fallacy 28 chapters. |
| 3 | **Pyodide hits a wall.** Some Python feature we need doesn't work in the browser, or load times degrade with content scale, or mobile breaks completely. | Medium | High | (a) MVP scope is deliberately Pyodide-friendly (no networking, no filesystem, no native deps). (b) We have a documented fallback path to server-side execution if needed (costs money, breaks free tier — explicit V3 decision). (c) Mobile is OUT for V1. |
| 4 | **De-Josh-ing the existing 28 chapters takes longer than rewriting.** Personal references are deeply embedded. | Medium | Medium | Don't try to de-Josh until V2. V1 ships with the 8 new MVP lessons written from scratch, generic from day one. The existing 28 chapters are reference material, not V1 content. |
| 5 | **Free + OSS gets cloned and outcompeted.** Someone with more time/money forks and ships faster. | Low | Medium | This is a *good problem* for the mission and a real but distant problem for Josh. Mitigated by: (a) brand and curriculum POV, not code, are the moat; (b) being the canonical / first; (c) Josh's distribution (his network, his X presence) is non-trivial. |

---

## 9. Anti-goals — what this is NOT

- **Not a CS degree.** No data structures, no algorithms, no Big-O, no leetcode.
- **Not a job-prep platform.** No interview prep, no portfolio coaching, no certificates v1.
- **Not a community.** No forums, no Discord, no leaderboards, no leagues v1.
- **Not for kids.** No cute mascots, no infantilizing copy, no streaks-as-punishment.
- **Not multi-language.** Python only. Forever, probably.
- **Not a video course.** Text-first, code-first. Video is expensive to produce and hostile to ADHD.
- **Not freemium-with-pain.** No "you've used 3 of 5 free lessons this month." Free tier is generous and permanent.
- **Not a bootcamp.** No 12-week programs, no accountability coaches, no "5 hours/day."
- **Not for engineers leveling up.** We're not the place where senior devs go to learn Rust. We're the place where Maya stops being scared of `KeyError`.

---

## 10. Decision points for Josh — sprint 1 cannot start without these

1. **Final name + domain.** Brand recommends renaming "code killa" → **Pyloft** (fallback: Reckon). I agree. Lock blocks on Arch's domain + trademark sweep. Question for Josh: do you accept Pyloft conditional on the sweep clearing, or do you want a wider name search? If you say "yes, Pyloft pending sweep," everything downstream proceeds; if you say "let me think about it," brand/UX/arch all stall.
2. **De-Josh-ing strategy for V1.** Confirm the recommendation here: V1 ships with 8 brand-new generic lessons, NOT with de-Joshed versions of the existing 28 chapters. If you disagree, we re-plan scope.
3. **Friends list for V1.** Who are the 10 humans you actually trust to test V1 and give honest feedback? Name them. We need to know if they fit Maya / Marcus / Priya, or if we're shipping into a void of "supportive friends who'll never finish lesson 2."
4. **OSS posture.** Public GitHub from day one, or stealth until V2 launch? Recommendation: public from day one — the OSS signal IS the marketing. But this is your call and there's no reversing "we were stealth."
5. **Time budget reality check.** You have evenings + ADHD + consulting + classes. Be honest: how many hours/week do you actually have, sustained? If it's <8/week, V1 takes 12 weeks not 4, and V2 is a 2026 problem. We should plan against the real number, not the aspirational one.
6. **ICP age center — 29 or 38?** PM has Maya at 29 (mid-career PM). Brand has anchored voice/visuals on a 38-year-old marketing manager pivoter. These are not the same human. Recommendation: **keep Maya at 29 as the MVP target user (her pain is sharpest, she's the easiest to reach via friends + Reddit/r/cursor), but write copy in a register that doesn't alienate the 38-year-old**. Effectively "late-20s through late-30s knowledge worker pivoting toward AI-building." Josh: confirm or pick a single age center and we re-tune.

---

## TL;DR

- **Build for Maya** — the AI-curious PM (29, mid-career, AI-curious). Marcus is V2 wedge, Priya is V3 track. Don't dilute V1. Brand's voice work targets a slightly older 38yo register; resolution is to broaden the persona band to late-20s–late-30s and let Brand keep its tonal floor while PM keeps its sharpest target.
- **The wedge is "Python literacy for AI-builders, not aspiring engineers"** — invert the curriculum around reading/debugging/directing AI-generated code, skip what AI handles fluently, double down on what AI gets wrong.
- **MVP is 8 lessons in 4 weeks of evening time.** Free, OSS, zero infra cost via Pyodide. Ship to 10 friends, gate V2 on 5 finishing.
- **Pricing is free + OSS through V2.** Paid tier appears only at V3, only if V2 hits 500 signups. Architecture is post-hosting — Pyodide-in-browser means there's nothing to keep paying for.
- **The six things blocking sprint 1**: confirm rename to Pyloft pending Arch's sweep, confirm V1 = fresh generic lessons (not de-Joshed), name the 10 friends, decide OSS-day-one yes/no, give us your real weekly hours, and pick the ICP age center (29 vs 38 vs band).
