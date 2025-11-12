import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { AuthenticatedLayout } from "./AuthenticatedLayout";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
 
  useEffect(() => {
    let stale = false;

    async function init() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (stale) return;
        if (error) console.error("getSession error:", error);

        if (session) {
          setAuthed(true);
          setLoading(false);
          // if they somehow landed on /signin or /check-email while signed in, bounce to app
          if (loc.pathname === "/signin" || loc.pathname === "/check-email") {
            nav("/app", { replace: true });
          }
        } else {
          setAuthed(false);
          setLoading(false);
          // redirect to landing page instead of signin
          if (loc.pathname !== "/signin" && loc.pathname !== "/check-email" && loc.pathname !== "/") {
            nav("/", { replace: true });
          }
        }
      } catch (e) {
        console.error("RequireAuth init failed:", e);
        setLoading(false);
        // redirect to landing page instead of signin
        if (loc.pathname !== "/signin" && loc.pathname !== "/check-email" && loc.pathname !== "/") {
          nav("/", { replace: true });
        }
      }
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (stale) return;
      if (session) {
        setAuthed(true);
        if (loc.pathname === "/signin" || loc.pathname === "/check-email") {
          nav("/app", { replace: true });
        }
      } else {
        setAuthed(false);
        // redirect to landing page instead of signin
        if (loc.pathname !== "/signin" && loc.pathname !== "/check-email" && loc.pathname !== "/") {
          nav("/", { replace: true });
        }
      }
    });

    // Failsafe so the UI never spins forever
    const timeout = setTimeout(() => setLoading(false), 4000);

    return () => {
      stale = true;
      clearTimeout(timeout);
      sub?.subscription.unsubscribe();
    };
  }, [nav, loc.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center">
        <div className="glass rounded-xl px-4 py-2 border">Checking session...</div>
      </div>
    );
  }

  if (!authed) return null; // we just redirected to /
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}