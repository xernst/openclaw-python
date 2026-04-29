---
xp: 1
estSeconds: 75
concept: function-definition
code: |
  def double(n):
      return n * 2

  print(double(7))
runnable: true
---

# Functions — the unit AI organizes everything around

Once AI moves past three or four lines of code, it stops writing scripts
and starts writing **functions**. *Validate the email.* *Compute the
score.* *Format the response.* Each of those becomes a named bundle of
logic that takes inputs, does work, and hands back an answer.

This is the single biggest shift between "I can read variable
assignments" and "I can read AI's actual code." Almost every Python
file Cursor writes is a stack of functions calling other functions.
If you can read one, you can read the file.

## The four moving parts

Look at the editor on the right and find each piece:

```python
def double(n):
    return n * 2

print(double(7))
```

1. **`def double(n):`** — *the contract.* You're declaring a function
   named `double` that accepts one input, which it will call `n`. The
   colon opens the body.
2. **`return n * 2`** — *the deliverable.* When the function is called,
   it computes `n * 2` and hands that value back to whoever called it.
3. **`double(7)`** — *the call.* You're saying *run that function, and
   set `n` to `7` for this run.* Python evaluates the body, hits `return`,
   and replaces the whole `double(7)` expression with the returned value.
4. **`print(...)`** — wraps the call so you can see what came back.

Read it again, slower. The function definition is a *recipe*. The call
is *cooking with that recipe one specific time*. They are not the same
moment in the program's life.

## Why this is the move AI reaches for constantly

Functions are how AI deduplicates. The instant the same three-line
pattern needs to happen twice — even slightly differently — Cursor will
extract it into a function. That's why almost every AI-generated file
opens with a stack of `def` blocks before any "real" code runs.

Two reading habits to build now:

- **At the `def` line, read the parameters.** They tell you what the
  function needs. If you see `def fetch(url, headers, retries):`, you
  know the call site has to supply three things.
- **At the `return` line, read the type.** A function ending in
  `return result` where `result` is a list returns a list. That answers
  "what do I do with the value the function gave me?"

## Where AI specifically gets functions wrong

The most common AI bug in this chapter is forgetting `return`. Cursor
will write a function that *prints* the answer and assumes it's done —
but the caller gets back `None`, not the value. The next chapter
focuses on this exact trap, because you will see it in real code this
week.

Run the editor. `double(7)` returns `14`, and the `print` shows it.
