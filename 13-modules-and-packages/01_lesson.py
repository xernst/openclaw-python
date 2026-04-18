"""Chapter 13 — using the local `mylib` package.

Run from this chapter folder:
    cd 13-modules-and-packages
    python3 01_lesson.py
"""
from mylib import clamp, lerp, slugify
from mylib.text_utils import slugify as slug2

print(clamp(150, 0, 100))        # 100
print(lerp(0, 100, 0.25))        # 25.0
print(slugify("Hello, World\! 2026"))   # hello-world-2026
print(slug2("Another Title"))

if __name__ == "__main__":
    print("running as script")
