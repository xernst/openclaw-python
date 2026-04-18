def add_item(item, cart=None):
    cart = [] if cart is None else cart
    cart.append(item); return cart
print(add_item("apple"))
print(add_item("banana"))
