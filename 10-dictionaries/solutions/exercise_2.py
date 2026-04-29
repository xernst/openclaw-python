text = "to be or not to be that is the question to be"
freq={}
for w in text.split(): freq[w] = freq.get(w,0)+1
print(freq)
