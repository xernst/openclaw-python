class InvalidPosting(Exception): pass
def score_posting(title, salary):
    if not title: raise InvalidPosting("title must be non-empty")
    if not salary or salary<=0: raise InvalidPosting("salary must be positive")
    return 42
for t,s in [("",100_000),("PM",0),("AI PM",200_000)]:
    try: print(score_posting(t,s))
    except InvalidPosting as e: print("error:", e)
