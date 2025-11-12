// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { loadPresentations } from "@/lib/presentations";
import { FileText, Calendar, Clock, ExternalLink, Trash2, Sparkles } from "lucide-react";
import type { OutlineResponse } from "@/types";

type PresentationRow = {
  id: string;
  title: string;
  version?: number;
  created_at: string;
  updated_at: string;
  outline_json: unknown;
};

export default function Profile() {
  const [items, setItems] = useState<PresentationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("there");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        // --- friendly greeting name ---
        const nameFromMeta =
          (session?.user?.user_metadata as { username?: string } | undefined)?.username;
        const nameFromEmail = session?.user?.email?.split("@")[0];
        if (mounted) setDisplayName(nameFromMeta || nameFromEmail || "there");

        if (!session) {
          setErr("Not signed in");
          setLoading(false);
          return;
        }

        // Load presentations using the helper function (tries Supabase first, falls back to API)
        const data = await loadPresentations();
        if (!mounted) return;
        
        // Ensure data is an array and sort newest first
        const presentations = Array.isArray(data) ? data : [];
        presentations.sort((a, b) => {
          const dateA = new Date(a.created_at || a.updated_at || 0).getTime();
          const dateB = new Date(b.created_at || b.updated_at || 0).getTime();
          return dateB - dateA;
        });
        
        setItems(presentations as PresentationRow[]);
      } catch (e: unknown) {
        if (!mounted) return;
        setErr(e instanceof Error ? e.message : "Failed to load presentations");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this presentation?")) return;

    try {
      const { error } = await supabase
        .from("presentations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Remove from local state
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      alert("Failed to delete presentation. Please try again.");
      console.error("Delete error:", error);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function getSlideCount(outline: unknown): number {
    try {
      const parsed = outline as OutlineResponse;
      return parsed?.slides?.length || 0;
    } catch {
      return 0;
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Hello, {displayName} 👋
          </h1>
          <p className="text-gray-800 dark:text-gray-400 mt-2">
            Manage and access your saved presentations
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="glass rounded-xl border px-6 py-4 inline-flex items-center gap-3">
              <div className="h-5 w-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-900 dark:text-gray-300">Loading presentations...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {err && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-6 py-4"
          >
            <p className="text-red-700 dark:text-red-400 font-medium">{err}</p>
          </motion.div>
        )}

        {/* Presentations Grid */}
        {!loading && !err && (
          <>
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl border p-12 text-center"
              >
                <FileText className="mx-auto h-16 w-16 text-gray-600 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No presentations yet
                </h3>
                <p className="text-gray-800 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Generate your first presentation outline and save it to see it here.
                </p>
                <button
                  onClick={() => navigate("/app")}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white
                             bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700
                             shadow-lg transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  Create Presentation
                </button>
              </motion.div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-gray-800 dark:text-gray-400">
                    {items.length} {items.length === 1 ? "presentation" : "presentations"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((p, index) => {
                    const slideCount = getSlideCount(p.outline_json);
                    const outline = p.outline_json as OutlineResponse | undefined;
                    const topic = outline?.topic || p.title;

                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group glass rounded-2xl border p-6 hover:shadow-xl transition-all duration-300
                                   bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                      >
                        {/* Card Header */}
                        <div className="mb-4">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 flex-1">
                              {p.title}
                            </h3>
                            {p.version && (
                              <span className="text-xs font-medium px-2 py-1 rounded-md
                                             bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300
                                             shrink-0">
                                v{p.version}
                              </span>
                            )}
                          </div>
                          {topic && topic !== p.title && (
                            <p className="text-sm text-gray-700 dark:text-gray-400 line-clamp-1">
                              {topic}
                            </p>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mb-4 text-xs text-gray-700 dark:text-gray-400">
                          {slideCount > 0 && (
                            <div className="flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5" />
                              <span>{slideCount} {slideCount === 1 ? "slide" : "slides"}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(p.created_at)}</span>
                          </div>
                        </div>

                        {/* Last Updated */}
                        {p.updated_at !== p.created_at && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-400 mb-4">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Updated {formatDate(p.updated_at)}</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => {
                              // Navigate to app with presentation data
                              navigate("/app", { state: { presentation: p } });
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
                                       bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700
                                       text-white shadow-sm transition-all"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
                                       text-slate-700 dark:text-slate-300
                                       bg-transparent hover:bg-slate-100/50 dark:hover:bg-slate-800/50
                                       border border-slate-300 dark:border-slate-600 transition-all"
                            title="Delete presentation"
                          >
                            <Trash2 className="h-4 w-4 text-slate-500 hover:text-slate-700 dark:text-slate-300" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
    </main>
  );
}
