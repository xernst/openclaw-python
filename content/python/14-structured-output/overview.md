## The model is a liar and your prod will break — until you make it speak in shapes

You ask Claude to extract the company name and price from a receipt. It returns:

```json
{"company_name": "Acme Corp", "price": "$42.99"}
```

You ship it. Three weeks later, on a customer's receipt, Claude returns:

```json
{"vendor": "Acme Corp", "total": 42.99}
```

Different keys. Different types. Your downstream code expected `company_name` and a string price. It gets `vendor` and a float. Things crash. Your customer sees a 500 page. Your team's only signal is "Claude must have hallucinated."

This is the bug class structured output exists to kill. It's the bug that breaks more shipped AI features than any other, because it doesn't show up in dev — it shows up at scale, in prod, on inputs you didn't test.

## The fix in one sentence

You don't ask the model for "JSON about this receipt." You define a Pydantic schema with the exact fields you require, you pass it as the schema for the model to fill, the API enforces the shape on its side, and Pydantic validates on yours. If the model deviates — wrong key, wrong type, missing required field — you catch it before any of your code runs.

That's the whole chapter.

## Why this lives in the wedge

Standard Python courses teach JSON parsing. They don't teach *defending against hallucinated JSON*, because before LLMs the JSON came from your own backend and you trusted it. AI changes the contract. Now the JSON might come from a model that's confidently wrong about your schema, and validation is no longer optional — it's the whole reason your AI feature stays up.

Pydantic is the de facto standard for this. Anthropic's tool-use system uses JSON Schema. OpenAI's Structured Outputs uses JSON Schema. They both speak Pydantic via `model_json_schema()`. Learning Pydantic well in this chapter pays off everywhere downstream.

## The mental model: contracts at the boundary

Imagine a customs officer at a border. Every package coming in gets opened, checked against a manifest, rejected if it doesn't match. That's what Pydantic's `model_validate_json` does at the LLM/your-code boundary. The model can lie all it wants on its side. The moment the response crosses into your code, Pydantic checks every field, type, and constraint. Wrong shape: `ValidationError`, your code never runs. Right shape: typed object, `Receipt(company_name="Acme Corp", price=Decimal("42.99"))`, IDE autocomplete works, downstream code can rely on it.

You can build the same thing by hand with `if isinstance(...)` checks, but you won't, because it's tedious. Pydantic makes the validation declarative — *here's the shape I want* — and that's why everyone uses it.

## What AI specifically gets wrong about structured output

Four patterns:

1. **Pydantic v1 versus v2 confusion.** Pydantic v2 launched in 2023 and the v1 syntax (`@validator`, `.dict()`, `.parse_obj()`) is deprecated. AI's training data has both. Cursor sometimes ships you `.dict()` (v1) when you want `.model_dump()` (v2). It looks right; it crashes when you upgrade.

2. **Catching `ValidationError` too broadly.** AI writes `try: ... except: pass` around the validation, which silently drops bad model outputs and hands you whatever default the schema fills in. This *masks* the bug, it doesn't fix it. The right move is to retry with the validation error in the prompt, so the model learns from its mistake.

3. **Skipping `response_format`.** On OpenAI, you have to pass `response_format={"type": "json_schema", ...}` for the API to actually enforce your schema. Without it, the model returns valid JSON but not your shape. Cursor skips this constantly.

4. **Defining schemas with optional fields when they should be required.** AI sees `Optional[str]` and adds it everywhere. Then the model drops the field, validation passes, your downstream code gets `None`, and you spend two hours debugging.

You'll see all four in this chapter, with concrete fix-the-bug exercises.

## What you'll be able to do at the end

Nine steps. By the end you'll be able to:

- Define a Pydantic v2 model for any data shape an LLM might return — required fields, optional fields, nested objects, enums, validators.
- Convert that model to a JSON Schema and pass it to Anthropic (via `tools` or the new `output_format` param) or OpenAI (via `response_format={"type": "json_schema", ...}`).
- Validate model responses with `model_validate_json` and handle `ValidationError` cleanly.
- Spot the four "AI ships this wrong" patterns and fix them in five seconds each.

The structured-output muscle pays off in chapter 15 (MCP, where tool inputs are JSON Schema), chapter 16 (agent loops, where tool dispatch needs validated arguments), and chapter 21 (evals, where eval cases are themselves typed records). This chapter compounds.

Press *Start chapter* below.
