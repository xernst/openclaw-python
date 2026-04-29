base_config={"theme":"light","fontsize":12,"debug":False}
user_config={"theme":"dark","debug":True,"autosave":True}
final = base_config | user_config
print(final); print("autosave" in final)
