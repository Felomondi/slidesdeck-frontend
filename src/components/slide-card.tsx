import { useEffect, useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, Plus, Trash2 } from "lucide-react";

export type Slide = {
  slideTitle: string;
  talkingPoints: string[];
  visualSuggestion?: string | null;
  notes?: string | null;
};

type Props = {
  initial: Slide;
  resetKey?: number;
  onChange?: (s: Slide) => void; // <-- added
};

export function SlideCard({ initial, resetKey, onChange }: Props) {
  const [title, setTitle] = useState(initial.slideTitle);
  const [points, setPoints] = useState<string[]>(initial.talkingPoints ?? []);
  const [notes, setNotes] = useState<string>(initial.notes ?? "");
  const [visual, setVisual] = useState<string>(initial.visualSuggestion ?? "");

  useEffect(() => {
    setTitle(initial.slideTitle);
    setPoints(initial.talkingPoints ?? []);
    setNotes(initial.notes ?? "");
    setVisual(initial.visualSuggestion ?? "");
  }, [initial.slideTitle, initial.talkingPoints, initial.notes, initial.visualSuggestion, resetKey]);

  // NEW: report edits upward so App.tsx can save the latest version
  useEffect(() => {
    onChange?.({
      slideTitle: title,
      talkingPoints: points,
      visualSuggestion: visual || null,
      notes: notes || null,
    });
    // We intentionally omit `onChange` from deps to avoid extra calls when parent re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, points, visual, notes]);

  const uid = useId();
  const fade = useMemo(
    () => ({
      initial: { opacity: 0, y: 6 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.18 },
    }),
    []
  );

  function updatePoint(i: number, v: string) {
    setPoints((arr) => arr.map((p, idx) => (idx === i ? v : p)));
  }

  function addPoint() {
    setPoints((arr) => [...arr, ""]);
  }

  function removePoint(i: number) {
    setPoints((arr) => arr.filter((_, idx) => idx !== i));
  }

  return (
    <motion.div
      {...fade}
      className="glass rounded-2xl border p-4 sm:p-5 transition-all duration-300 hover:glass-hover
                 border-sky-200/70 dark:border-sky-500/50"
    >
      {/* Title */}
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 opacity-50" />
        <input
          aria-label="Slide title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent outline-none text-base sm:text-lg font-semibold tracking-tight 
                     text-slate-900 dark:text-white"
        />
      </div>

      <div className="my-3 hr rounded" />

      {/* Talking points */}
      <ul className="space-y-2">
        {points.map((p, i) => (
          <li key={`${uid}-${i}`} className="group flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 shrink-0" />
            <input
              value={p}
              onChange={(e) => updatePoint(i, e.target.value)}
              placeholder={`Talking point ${i + 1}`}
              className="w-full bg-transparent outline-none text-sm sm:text-[0.95rem] py-1 
                         text-slate-900 dark:text-white
                         placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
            <button
              aria-label="Remove point"
              onClick={() => removePoint(i)}
              className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Trash2 className="h-4 w-4 text-slate-500 hover:text-slate-700 dark:text-slate-300" />
            </button>
          </li>
        ))}
      </ul>

      {/* Add point (your version kept) */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={addPoint}
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium
                     text-slate-800 dark:text-white
                     bg-white/70 dark:bg-white/10
                     border border-sky-300 dark:border-sky-500/60 hover:bg-white/80 dark:hover:bg-white/15"
        >
          <Plus className="h-3.5 w-3.5" />
          Add point
        </button>
      </div>

      {(visual?.trim() || notes?.trim()) && <div className="my-4 hr rounded" />}

      {/* Visual suggestion */}
      {visual?.trim() && (
        <div
          className="mt-3 rounded-xl p-2
                     border-2 border-sky-200/80 bg-white/45
                     dark:border-sky-500/50 dark:bg-white/5"
        >
          <div className="flex items-center gap-2 text-xs font-medium">
            {/* FORCE light/dark colors via your CSS helper */}
            <span className="legend-title uppercase tracking-wide">Visual suggestion</span>
          </div>
          <textarea
            value={visual}
            onChange={(e) => setVisual(e.target.value)}
            rows={2}
            className="mt-1.5 w-full rounded-md bg-transparent border-0 px-2 py-1.5 text-sm
                       outline-none focus:ring-2 ring-sky-300/50 dark:ring-sky-600/40
                       text-slate-900 dark:text-white
                       placeholder:text-slate-500 dark:placeholder:text-slate-400"
          />
        </div>
      )}

      {/* Speaker notes */}
      {notes?.trim() && (
        <div
          className="mt-3 rounded-xl p-2
                     border-2 border-sky-200/80 bg-white/45
                     dark:border-sky-500/50 dark:bg-white/5"
        >
          <div className="flex items-center gap-2 text-xs font-medium">
            {/* FORCE light/dark colors via your CSS helper */}
            <span className="legend-title uppercase tracking-wide">Speaker notes</span>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-md bg-transparent border-0 px-2 py-1.5 text-sm
                       outline-none focus:ring-2 ring-sky-300/50 dark:ring-sky-600/40
                       text-slate-900 dark:text-white
                       placeholder:text-slate-500 dark:placeholder:text-slate-400"
          />
        </div>
      )}
    </motion.div>
  );
}