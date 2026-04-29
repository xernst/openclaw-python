def average(*nums):
    return sum(nums)/len(nums) if nums else 0
print(average(10,20,30)); print(average(4.5)); print(average())
