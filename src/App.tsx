import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TopBar } from "./components/topbar";
import { SlideCard, type Slide } from "./components/slide-card";
import { SlideSkeleton } from "./components/skeletons";
import { ProgressBar } from "./components/progress-bar";
import { postJSON } from "./lib/api";
import { Sparkles, FilePlus2, SlidersHorizontal } from "lucide-react";

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
  const [deckKey, setDeckKey] = useState(0);

  const canGenerate = useMemo(() => brief.trim().length > 0 && !loading, [brief, loading]);

  async function generate() {
    if (!canGenerate) return;
    setError(null);
    setLoading(true);
    setOutline(null);

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
    <div className="min-h-screen bg-app">
      <TopBar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        {/* Generator panel */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl border p-4 sm:p-6 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Generate an outline</h1>
              <p className="text-xs sm:text-sm opacity-70 mt-1">
                Paste a detailed brief. The AI will produce clean, scannable slides.
              </p>
            </div>

            <button
              onClick={generate}
              disabled={!canGenerate}
              className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed
                         bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating…" : "Generate"}
            </button>
          </div>

          <div className="mt-4">
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={6}
              placeholder="Describe your talk: audience, tone, must-include points, examples, constraints…"
              className="w-full rounded-xl bg-white/60 border border-white/80 px-4 py-3 text-sm outline-none focus:ring-2 ring-sky-300/60 placeholder:opacity-60"
            />
          </div>

          {/* Settings with clear blue borders */}
          <fieldset className="mt-4 rounded-xl border-2 border-sky-200/80 bg-white/45 p-4">
            <legend className="px-2">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-sky-800">
                <SlidersHorizontal className="h-4 w-4" />
                Slide settings
              </div>
            </legend>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Slide count */}
              <label className="text-sm block">
                <span className="opacity-80 mb-1 block">Slide count</span>
                <input
                  type="number"
                  min={3}
                  max={20}
                  value={slideCount}
                  onChange={(e) => setSlideCount(Number(e.target.value))}
                  aria-label="Slide count"
                  className="w-full rounded-lg bg-white/70 px-3 py-2 text-sm outline-none
                             border-2 border-sky-300/80 focus:border-sky-500 focus:ring-2 ring-sky-300/60"
                />
                <span className="mt-1 block text-xs opacity-60">Number of slides to generate.</span>
              </label>

              {/* Max bullets */}
              <label className="text-sm block">
                <span className="opacity-80 mb-1 block">Max bullets / slide</span>
                <input
                  type="number"
                  min={3}
                  max={8}
                  value={maxBullets}
                  onChange={(e) => setMaxBullets(Number(e.target.value))}
                  aria-label="Max bullets per slide"
                  className="w-full rounded-lg bg-white/70 px-3 py-2 text-sm outline-none
                             border-2 border-sky-300/80 focus:border-sky-500 focus:ring-2 ring-sky-300/60"
                />
                <span className="mt-1 block text-xs opacity-60">Keeps points short and scannable.</span>
              </label>

              {/* Options */}
              <label className="text-sm flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeVisuals}
                  onChange={(e) => setIncludeVisuals(e.target.checked)}
                  className="h-4 w-4 accent-sky-600"
                />
                <span className="opacity-80">Include visual suggestions</span>
              </label>

              <label className="text-sm flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="h-4 w-4 accent-sky-600"
                />
                <span className="opacity-80">Include speaker notes</span>
              </label>
            </div>
          </fieldset>

          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        </motion.section>

        {/* Progress bar between brief and slides */}
        <AnimatePresence>{loading && <ProgressBar key="local-bar" />}</AnimatePresence>

        {/* Deck */}
        <section className="mt-4 relative" aria-busy={loading}>
          <AnimatePresence mode="wait">
            {loading ? (
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
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-2xl border p-10 text-center"
              >
                <FilePlus2 className="mx-auto h-8 w-8 opacity-60" />
                <h3 className="mt-3 font-medium">No slides yet</h3>
                <p className="mt-1 text-sm opacity-70">
                  Paste a rich brief and click <span className="font-medium">Generate</span> to create your deck.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}