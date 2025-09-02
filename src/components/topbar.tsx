// src/components/topbar.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export function TopBar() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load current session user and subscribe to auth changes
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
    });

    // Click outside to close dropdown
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
      document.removeEventListener("mousedown", onDocClick);
    };
  }, []);

  const displayName =
    (user?.user_metadata as any)?.username ||
    user?.email?.split("@")[0] ||
    "Account";

  async function handleSignOut() {
    await supabase.auth.signOut();
    setOpen(false);
    navigate("/signin");
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="glass rounded-2xl mt-3 mb-2 h-14 border transition-all duration-300 flex items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-sm" />
            <span className="text-sm sm:text-base">SlidesDeck</span>
          </div>

          {/* Right side: Sign in OR username dropdown */}
          <div className="relative" ref={menuRef}>
            {!user ? (
              <button
                onClick={() => navigate("/signin")}
                className="btn-glass border rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium hover:opacity-90"
              >
                Sign in
              </button>
            ) : (
              <>
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium
                             btn-glass border hover:opacity-90"
                >
                  <span className="truncate max-w-[10rem]">{displayName}</span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </button>
                {open && (
                  <div
                    className="absolute right-0 mt-2 w-44 glass rounded-xl border p-1 shadow-lg"
                    role="menu"
                  >
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/50 dark:hover:bg-white/10"
                      role="menuitem"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}