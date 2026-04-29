---
xp: 1
estSeconds: 50
concept: closure-introduction
code: |
  def make_greeter(prefix):
      def greet(name):
          return f"{prefix}, {name}"
      return greet

  hi = make_greeter("hi")
  hello = make_greeter("hello")

  print(hi("maya"))
  print(hello("marcus"))
runnable: true
---

# A closure is a function that remembers

When AI writes a route handler, a retry wrapper, or a rate-limit guard, it
often defines a function *inside* another function and returns it. The
inner function "remembers" the outer function's arguments — that memory
is called a **closure**.

In the editor, `make_greeter("hi")` returns the inner `greet` function.
But the returned function still knows what `prefix` was, even though
`make_greeter` already finished running.

You'll see this constantly in framework code: FastAPI dependencies, Flask
view decorators, LangChain tool-binding. They all lean on closures.

Run the editor. Two greeters, two different prefixes, neither leaks into
the other.
