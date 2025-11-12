import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SlideCard, type Slide } from "./components/slide-card";
import { SlideSkeleton } from "./components/skeletons";
import { ProgressBar } from "./components/progress-bar";
import { postJSON } from "./lib/api";
import { Sparkles, FilePlus2, SlidersHorizontal, Save as SaveIcon } from "lucide-react";
import { savePresentation } from "@/lib/presentations"; // ✅ use helper that POSTs (upsert)
import type { OutlineResponse as OutlineResponseType } from "@/types";

type OutlineResponse = { topic: string; slides: Slide[] };

type PresentationState = {
  presentation?: {
    id: string;
    title: string;
    outline_json: unknown;
  };
};

export default function App() {
  const location = useLocation();
  const state = location.state as PresentationState | null;

  const [brief, setBrief] = useState("");
  const [slideCount, setSlideCount] = useState(8);
  const [maxBullets, setMaxBullets] = useState(5);
  const [includeVisuals, setIncludeVisuals] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);

  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState<OutlineResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deckKey, setDeckKey] = useState(0);

  // Live edited slides + saving state
  const [liveSlides, setLiveSlides] = useState<Slide[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const canGenerate = useMemo(() => brief.trim().length > 0 && !loading, [brief, loading]);

  // Load presentation from navigation state (when coming from Profile page)
  useEffect(() => {
    if (state?.presentation) {
      try {
        const presentation = state.presentation;
        const outlineData = presentation.outline_json as OutlineResponseType;
        
        if (outlineData && outlineData.slides) {
          setOutline({
            topic: outlineData.topic || presentation.title,
            slides: outlineData.slides,
          });
          setLiveSlides(outlineData.slides);
          setSavedId(presentation.id);
          setDeckKey((k) => k + 1);
        }
      } catch (e) {
        console.error("Failed to load presentation from state:", e);
        setError("Failed to load presentation.");
      }
    }
  }, [state]);

  async function generate() {
    if (!canGenerate) return;
    setError(null);
    setLoading(true);
    setOutline(null);
    setSavedId(null); // reset any previous saved row id

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
      setLiveSlides(data.slides); // seed editable slides
    } catch {
      setError("Failed to generate outline.");
    } finally {
      setLoading(false);
    }
  }

  // If outline changes without running generate (rare), keep liveSlides in sync
  useEffect(() => {
    if (outline) setLiveSlides(outline.slides);
  }, [outline]);

  // Receive per-card edits
  function handleSlideChange(index: number, s: Slide) {
    setLiveSlides((prev) => {
      const base = prev.length ? prev : outline?.slides ?? [];
      const next = [...base];
      next[index] = s;
      return next;
    });
  }

  // Save (upsert) current deck by (user_id, title) on the server
  async function saveCurrent() {
    if (!outline) return;
    setError(null);
    setSaving(true);
    try {
      const title = (outline.topic || "Untitled presentation").trim();
      const outlinePayload: OutlineResponse = {
        topic: outline.topic,
        slides: liveSlides.length ? liveSlides : outline.slides,
      };

      // This POST hits /api/presentations and your backend upserts by (user_id, title)
      const saved = await savePresentation(title, outlinePayload);
      setSavedId(saved.id); // keep id to flip button label to “Save changes”
      // (optional) show a toast/snackbar here
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save presentation.");
    } finally {
      setSaving(false);
    }
  }

  return (
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
          <fieldset className="mt-4 rounded-xl border-2 border-sky-200/80 bg-white/45 p-4
                    dark:border-sky-500/60 dark:bg-white/5">
            <legend className="px-2">
              <div className="inline-flex items-center gap-2 text-sm font-medium">
                <SlidersHorizontal className="h-4 w-4 legend-title" />
                <span className="legend-title">Slide settings</span>
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
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {outline.slides.map((s, i) => (
                  <SlideCard
                    key={`${deckKey}-${i}`}
                    initial={s}
                    resetKey={deckKey}
                    onChange={(val) => handleSlideChange(i, val)} // keep edits live
                  />
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

          {/* Floating Save button (bottom-right) */}
          {outline && !loading && (
            <div className="fixed bottom-6 right-6">
              <button
                onClick={saveCurrent}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed
                           bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-sm"
                aria-busy={saving}
              >
                <SaveIcon className="h-4 w-4" />
                {saving ? "Saving…" : savedId ? "Save changes" : "Save presentation"}
              </button>
            </div>
          )}
        </section>
    </main>
  );
}