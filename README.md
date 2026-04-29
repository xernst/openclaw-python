# code-killa

> Codecademy teaches Python like it's 1995. Boot.dev gamifies the same curriculum. Both assume you want to be a software engineer.
>
> code-killa is the school for people who use Cursor every day and need to know what it got wrong.

**Status**: building in public. Early days. Follow [@TFisPython](https://x.com/TFisPython) for daily progress.

---

## What this is

An open-source Python school for the AI-builder era. The curriculum inverts around the workflow you actually use: read code AI wrote, predict what it does, fix what it got wrong, write only what AI fluently can't.

Eight chapters at MVP, all running 100% in your browser via Pyodide. No server. No accounts. No paywalls. No tracking. Free forever.

## Why this exists

Most "learn Python" platforms were designed for people becoming software engineers. Their curriculum is shaped by that endgame: data structures, algorithms, leetcode prep.

Maya doesn't want any of that. She uses Cursor every day, ships AI features at her PM job, and wants to actually understand the 200 lines Claude just wrote. That's a different curriculum.

We skip what AI handles fluently. We double down on what AI gets wrong: hallucinated APIs, silent type bugs, off-by-one errors, traceback reading, environment setup. We teach the mental models you need to *direct* AI, not replace it.

## Stack

Next.js 16 · React 19 · Tailwind 4 · Pyodide-in-Web-Worker · CodeMirror 6 · localStorage. Zero backend. Vercel free tier hosts it forever.

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Contributing

This is an in-progress build. The schema is documented in `lib/content/schema.ts`. Each lesson is YAML + Markdown in `content/python/`.

If you've used AI to write Python and gotten burned by something specific — hallucinated API, silent type bug, environment-setup hell — open an issue with the example. That's the curriculum.

## License

MIT.
