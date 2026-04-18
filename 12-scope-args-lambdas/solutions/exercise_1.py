def log_event(event_type, **fields):
    print(f"[{event_type}]")
    for k,v in fields.items(): print(f"{k}={v}")
log_event("click", user="ava", page="/home")
log_event("signup", user="bea", source="ref")
