"""
Exercise 14.2 — Append JSONL event log.
Create ./workspace/logs/events.jsonl and append 3 events (one JSON object per line):
  {"ts":"09:00","level":"INFO","text":"started"}
  {"ts":"09:05","level":"WARN","text":"slow query"}
  {"ts":"09:06","level":"ERROR","text":"timeout"}
Then read it back and print each line.
"""
from pathlib import Path
import json
# TODO
