// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TopBar } from "@/components/topbar";
import { Footer } from "@/components/footer";

type PresentationRow = {
  id: string;
  title: string;
  version: number;
  created_at: string;
  updated_at: string;
  outline_json: unknown;
};

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export default function Profile() {
  const [items, setItems] = useState<PresentationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("there");

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
        const token = session.access_token;

        const res = await fetch(`${API_BASE}/api/presentations`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Failed to load: ${res.status} ${res.statusText}`);
        }

        const data = (await res.json()) as PresentationRow[];
        if (!mounted) return;
        // Sort newest first
        data.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
        setItems(data);
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

  return (
    <div className="min-h-screen bg-app flex flex-col">
      <TopBar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-xl font-semibold text-black dark:text-white">
          Hello, {displayName}
        </h1>
        <p className="opacity-70 text-sm mt-1">Saved presentations</p>

        <div className="mt-4 hr rounded" />

        {loading && (
          <div className="glass rounded-xl border px-4 py-3 inline-block">Loading…</div>
        )}

        {err && !loading && (
          <div className="glass rounded-xl border px-4 py-3 text-red-600 dark:text-red-400 inline-block">
            {err}
          </div>
        )}

        {!loading && !err && (
          <>
            {items.length === 0 ? (
              <div className="glass rounded-xl border p-6 mt-4">
                <p className="opacity-75">
                  You don’t have any saved presentations yet. Generate an outline and hit <b>Save</b>.
                </p>
              </div>
            ) : (
              <ul className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((p) => (
                  <li key={p.id} className="glass rounded-2xl border p-4 hover:glass-hover transition">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-semibold text-black dark:text-white truncate">{p.title}</h2>
                      <span className="text-[11px] opacity-70">v{p.version}</span>
                    </div>
                    <div className="mt-1 text-xs opacity-70">
                      {new Date(p.created_at).toLocaleString()}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        className="btn-glass text-sm px-3 py-1.5 rounded-xl"
                        title="Open in editor"
                        onClick={() => {
                          window.location.href = "/";
                        }}
                      >
                        Open
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
