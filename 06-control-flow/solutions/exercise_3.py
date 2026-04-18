code = 404
match code:
    case 200: print("OK")
    case 201: print("Created")
    case 301 | 302: print("Redirect")
    case 400: print("Bad Request")
    case 401 | 403: print("Unauthorized")
    case 404: print("Not Found")
    case c if 500 <= c <= 599: print("Server Error")
    case _: print("Unknown")
