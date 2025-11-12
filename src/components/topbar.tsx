// src/components/topbar.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export function TopBar() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const displayName =
    (user?.user_metadata as { username?: string } | undefined)?.username ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="glass rounded-2xl mt-3 mb-2 h-14 border transition-all duration-300 flex items-center justify-between px-3 sm:px-4">
          {/* Make the logo/title clickable */}
          <Link
            to={user ? "/app" : "/"}
            className="flex items-center gap-2 font-semibold tracking-tight"
            aria-label="Go to main page"
          >
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-sm" />
            <span className="text-sm sm:text-base">SlidesDeck</span>
          </Link>

          {/* Right side: Sign in OR Hi, username */}
          <div>
            {!user ? (
              <button
                onClick={() => navigate("/signin")}
                className="btn-glass border rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium hover:opacity-90"
              >
                Sign in
              </button>
            ) : (
              <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                Hi, {displayName}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}