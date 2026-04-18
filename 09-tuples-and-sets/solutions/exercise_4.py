def stats(nums):
    return min(nums), max(nums), sum(nums)/len(nums)
mn,mx,av = stats([3,1,4,1,5,9,2,6])
print(mn,mx,av)
