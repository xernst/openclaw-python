---
xp: 1
estSeconds: 35
concept: positional-arguments
code: |
  def send_email(to, subject, body):
      print(f"to: {to}")
      print(f"subject: {subject}")
      print(f"body: {body}")

  send_email("sam@example.com", "lunch?", "1pm okay?")
runnable: true
---

# Arguments are positional by default

When you call a function, the values you pass in line up with the parameters
**in order**. First value goes to the first parameter, second to the second,
and so on.

The shape on the right is what AI writes whenever you ask for "send an email"
or "log a request" — three parameters, three arguments, matched left to right.

- `to` gets `"sam@example.com"`
- `subject` gets `"lunch?"`
- `body` gets `"1pm okay?"`

Hit **Run**. Now imagine reversing two of those arguments by accident. Python
won't catch it — the email goes out with the body in the subject line.
That's the bug we're learning to spot.
