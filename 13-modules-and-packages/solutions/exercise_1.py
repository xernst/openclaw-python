from mylib import clamp, lerp, slugify
print(clamp(150,0,100), clamp(-1,0,100), clamp(50,0,100))
print(lerp(0,100,0), lerp(0,100,0.5), lerp(0,100,1))
print(slugify("Hello"), slugify(" Hello, World\!"), slugify("I ❤ Python"))
