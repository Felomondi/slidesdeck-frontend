import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TopBar } from "./components/topbar";
import { SlideCard, type Slide } from "./components/slide-card";
import { SlideSkeleton } from "./components/skeletons";
import { ProgressBar } from "./components/progress-bar";
import { postJSON } from "./lib/api";
import { Sparkles, FilePlus2 } from "lucide-react";

type OutlineResponse = { topic: string; slides: Slide[] };

export default function App() {
  const [brief, setBrief] = useState("");
  const [slideCount, setSlideCount] = useState(8);
  const [maxBullets, setMaxBullets] = useState(5);
  const [includeVisuals, setIncludeVisuals] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);

  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState<OutlineResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deckKey, setDeckKey] = useState(0); // force remount on new data

  const canGenerate = useMemo(() => brief.trim().length > 0 && !loading, [brief, loading]);

  async function generate() {
    if (!canGenerate) return;
    setError(null);
    setLoading(true);
    setOutline(null);            // clear the deck so we show skeletons only after clicking

    try {
      const data = await postJSON<OutlineResponse>("/api/generate", {
        brief,
        slideCount,
        maxBulletsPerSlide: maxBullets,
        includeVisualSuggestions: includeVisuals,
        includeNotes,
      });
      setDeckKey((k) => k + 1);
      setOutline(data);
    } catch {
      setError("Failed to generate outline.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-app text-neutral-900 dark:text-white">
      <TopBar />

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* Generator */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-900/70 backdrop-blur p-5 sm:p-7 shadow-sm"
        >
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Generate an outline</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Paste a rich brief. The AI will craft clean, scannable slides.
          </p>

          <div className="mt-4">
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={6}
              placeholder="Describe your talk in detail (audience, tone, must-include points, examples, constraints)…"
              className="w-full rounded-xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 px-4 py-3 text-sm outline-none focus:ring-2 ring-sky-300/60 placeholder:text-neutral-400"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <label className="text-sm">
              <div className="text-neutral-600 dark:text-neutral-400 mb-1">Slide count</div>
              <input
                type="number"
                min={3}
                max={20}
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                className="w-full rounded-lg bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 px-3 py-2 text-sm focus:ring-2 ring-sky-300/60"
              />
            </label>
            <label className="text-sm">
              <div className="text-neutral-600 dark:text-neutral-400 mb-1">Max bullets/slide</div>
              <input
                type="number"
                min={3}
                max={8}
                value={maxBullets}
                onChange={(e) => setMaxBullets(Number(e.target.value))}
                className="w-full rounded-lg bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 px-3 py-2 text-sm focus:ring-2 ring-sky-300/60"
              />
            </label>
            <label className="text-sm flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeVisuals}
                onChange={(e) => setIncludeVisuals(e.target.checked)}
                className="h-4 w-4 accent-sky-600"
              />
              <span className="text-neutral-700 dark:text-neutral-300">Include visual suggestions</span>
            </label>
            <label className="text-sm flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeNotes}
                onChange={(e) => setIncludeNotes(e.target.checked)}
                className="h-4 w-4 accent-sky-600"
              />
              <span className="text-neutral-700 dark:text-neutral-300">Include speaker notes</span>
            </label>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={generate}
              disabled={!canGenerate}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed
                         bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating…" : "Generate Outline"}
            </button>
            {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
          </div>
        </motion.section>

        {/* Slide deck area */}
        <section className="mt-8 relative" aria-busy={loading}>
          <AnimatePresence>{loading && <ProgressBar key="bar" />}</AnimatePresence>

          <AnimatePresence mode="wait">
            {loading ? (
              // 🟦 Only show skeletons while loading (i.e., after clicking Generate)
              <motion.div
                key="skeletons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {Array.from({ length: Math.max(slideCount, 4) }).map((_, i) => (
                  <SlideSkeleton key={i} />
                ))}
              </motion.div>
            ) : outline ? (
              // ✅ Show slides only when we have an outline
              <motion.div
                key={`deck-${deckKey}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {outline.slides.map((s, i) => (
                  <SlideCard key={`${deckKey}-${i}`} initial={s} resetKey={deckKey} />
                ))}
              </motion.div>
            ) : (
              // 💤 Initial state: placeholder, no skeletons until the first click
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 rounded-2xl border border-dashed border-black/10 dark:border-white/15 bg-white/60 dark:bg-neutral-900/60 p-10 text-center"
              >
                <FilePlus2 className="mx-auto h-8 w-8 text-neutral-400" />
                <h3 className="mt-3 font-medium">No slides yet</h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Describe your presentation and generate an outline to get started.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}