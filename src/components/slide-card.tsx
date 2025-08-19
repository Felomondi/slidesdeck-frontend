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
  resetKey?: number; // forces internal state reset when deck remounts
};

export function SlideCard({ initial, resetKey }: Props) {
  const [title, setTitle] = useState(initial.slideTitle);
  const [points, setPoints] = useState<string[]>(initial.talkingPoints ?? []);
  const [notes, setNotes] = useState<string>(initial.notes ?? "");
  const [visual, setVisual] = useState<string>(initial.visualSuggestion ?? "");

  useEffect(() => {
    // when parent remounts deck, reset fields
    setTitle(initial.slideTitle);
    setPoints(initial.talkingPoints ?? []);
    setNotes(initial.notes ?? "");
    setVisual(initial.visualSuggestion ?? "");
  }, [initial.slideTitle, initial.talkingPoints, initial.notes, initial.visualSuggestion, resetKey]);

  const uid = useId();
  const fade = useMemo(
    () => ({ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.18 } }),
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
    <motion.div {...fade} className="glass rounded-2xl border p-4 sm:p-5 transition-all duration-300 hover:glass-hover">
      {/* Card header */}
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 opacity-50" />
        <input
          aria-label="Slide title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent outline-none text-base sm:text-lg font-semibold tracking-tight"
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
              className="w-full bg-transparent outline-none text-sm sm:text-[0.95rem] py-1"
            />
            <button
              aria-label="Remove point"
              onClick={() => removePoint(i)}
              className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-white/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex gap-2">
        <button
          onClick={addPoint}
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium
                     bg-white/15 hover:bg-white/25 border border-white/20"
        >
          <Plus className="h-3.5 w-3.5" />
          Add point
        </button>
      </div>

      {/* Optional sections */}
      {(visual?.trim() || notes?.trim()) && <div className="my-4 hr rounded" />}

      {visual?.trim() && (
        <div className="mt-3">
          <div className="text-xs uppercase tracking-wide opacity-60 mb-1.5">Visual suggestion</div>
          <textarea
            value={visual}
            onChange={(e) => setVisual(e.target.value)}
            rows={2}
            className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm outline-none focus:ring-2 ring-sky-300/50"
          />
        </div>
      )}

      {notes?.trim() && (
        <div className="mt-3">
          <div className="text-xs uppercase tracking-wide opacity-60 mb-1.5">Speaker notes</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm outline-none focus:ring-2 ring-sky-300/50"
          />
        </div>
      )}
    </motion.div>
  );
}