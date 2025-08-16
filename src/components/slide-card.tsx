import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

export type Slide = {
  slideTitle: string;
  talkingPoints: string[];
  visualSuggestion?: string | null;
  notes?: string | null;
};

export function SlideCard({ initial, resetKey = 0 }: { initial: Slide; resetKey?: number }) {
  const [title, setTitle] = useState(initial.slideTitle);
  const [points, setPoints] = useState<string[]>(initial.talkingPoints);
  const [editing, setEditing] = useState(false);

  // 🔁 Whenever the parent bumps resetKey, re-hydrate local state from props.
  useEffect(() => {
    setTitle(initial.slideTitle);
    setPoints(initial.talkingPoints);
    setEditing(false);
  }, [resetKey, initial.slideTitle, initial.talkingPoints]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 p-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 px-3 py-2 text-sm"
          />
        ) : (
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        )}

        <button
          onClick={() => setEditing((v) => !v)}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
          title="Edit"
        >
          <Pencil className="h-3.5 w-3.5" />
          {editing ? "Done" : "Edit"}
        </button>
      </div>

      <div className="mt-3 space-y-1.5">
        {editing ? (
          points.map((p, i) => (
            <input
              key={i}
              value={p}
              onChange={(e) => {
                const next = [...points];
                next[i] = e.target.value;
                setPoints(next);
              }}
              className="w-full rounded-md bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 px-3 py-1.5 text-sm"
            />
          ))
        ) : (
          <ul className="list-disc pl-5 text-sm leading-relaxed">
            {points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        )}
      </div>

      {initial.visualSuggestion && (
        <div className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">
          <span className="font-medium">Visual:</span> {initial.visualSuggestion}
        </div>
      )}
      {initial.notes && (
        <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
          <span className="font-medium">Notes:</span> {initial.notes}
        </div>
      )}
    </motion.div>
  );
}