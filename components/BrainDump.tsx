"use client";
// One-keypress tangent inbox. ADHD rule #6 — capture intrusive thoughts and
// keep going. Stored in localStorage; can be exported to Obsidian later.

import { useEffect, useState } from "react";
import { Brain, X } from "lucide-react";
import { loadProgress, updateProgress } from "@/lib/storage";

export default function BrainDump() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(loadProgress().brainDump);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function add() {
    const text = draft.trim();
    if (!text) return;
    const stamped = `[${new Date().toISOString().slice(0, 16).replace("T", " ")}] ${text}`;
    updateProgress((p) => ({ ...p, brainDump: [stamped, ...p.brainDump] }));
    setItems((cur) => [stamped, ...cur]);
    setDraft("");
  }

  function exportToFile() {
    const md = `# Brain dump from code-killa\n\n${items.map((i) => `- ${i}`).join("\n")}\n`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code-killa-braindump-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Brain dump (⌘⇧B)"
        className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-1.5 rounded-full border border-ink-800 bg-ink-900 px-3 py-2 text-xs text-ink-400 shadow-lg hover:bg-ink-800 hover:text-ink-200 transition"
      >
        <Brain size={14} />
        Park a thought
      </button>
      {open && (
        <div className="fixed bottom-16 right-4 z-30 w-80 rounded-lg border border-ink-800 bg-ink-950 shadow-xl">
          <div className="flex items-center justify-between border-b border-ink-800 px-3 py-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-ink-300">
              <Brain size={12} /> Brain dump
            </div>
            <button onClick={() => setOpen(false)} className="text-ink-500 hover:text-ink-300">
              <X size={14} />
            </button>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder="Park a thought, then get back to the lesson. ⌘↵ to save."
            className="w-full resize-none bg-transparent px-3 py-2 text-sm text-ink-100 placeholder:text-ink-600 outline-none"
            rows={3}
          />
          <div className="border-t border-ink-800 px-3 py-2 flex gap-2">
            <button onClick={add} className="flex-1 rounded bg-ember-600 px-2 py-1 text-xs font-medium text-white hover:bg-ember-500">
              Save
            </button>
            <button onClick={exportToFile} className="rounded border border-ink-700 px-2 py-1 text-xs text-ink-300 hover:bg-ink-800">
              Export .md
            </button>
          </div>
          {items.length > 0 && (
            <div className="max-h-48 overflow-auto border-t border-ink-800 px-3 py-2 text-xs text-ink-400">
              {items.slice(0, 8).map((it, i) => (
                <div key={i} className="py-0.5 truncate" title={it}>
                  {it}
                </div>
              ))}
              {items.length > 8 && <div className="text-ink-600 mt-1">+ {items.length - 8} more</div>}
            </div>
          )}
        </div>
      )}
    </>
  );
}
