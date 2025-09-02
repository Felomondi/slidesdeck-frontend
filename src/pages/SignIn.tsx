// src/pages/SignIn.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { TopBar } from "@/components/topbar";

const USERNAME_RE = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/; // 3–20 chars, start with letter
const EDU_EMAIL_RE = /^[^\s@]+@[^\s@]+\.edu$/i;     // ends with .edu

export default function SignInPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/";

  const usernameValid = useMemo(() => USERNAME_RE.test(username), [username]);
  const emailIsEdu = useMemo(() => EDU_EMAIL_RE.test(email.trim()), [email]);

  // If already signed in, route to main page; also ensure profile row exists if you use a `profiles` table.
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      const session = data.session;
      if (session) {
        await ensureProfile(session.user.user_metadata?.username || username);
        navigate(from, { replace: true });
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, session) => {
      if (session) {
        await ensureProfile(session.user.user_metadata?.username || username);
        navigate(from, { replace: true });
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, navigate]);

  // Try to see if the username is taken in `profiles.username` if that table exists.
  async function assertUsernameAvailable(name: string) {
    try {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("username", name);

      if (error) {
        // If table doesn't exist (42P01), just skip uniqueness check gracefully.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const code = (error as any).code;
        if (code === "42P01") return;
        throw error;
      }
      if ((count ?? 0) > 0) {
        throw new Error("That username is already taken. Please choose another.");
      }
    } catch (e) {
      throw e;
    }
  }

  // After we have a session, try to upsert a `profiles` row (if the table exists).
  async function ensureProfile(name?: string) {
    if (!name) return;
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,                 // assumes `profiles.id` is UUID PK matching auth.user.id
            username: name,
            email: user.email,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      // If table doesn't exist or RLS blocks, we silently ignore for now.
    } catch {
      /* no-op */
    }
  }

  async function handleEmailPassword() {
    setErr(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        // SIGN UP: require valid username AND .edu email.
        if (!usernameValid) throw new Error("Please enter a valid username.");
        if (!emailIsEdu) throw new Error("SlidesDeck is currently for students only. Please use a .edu email.");

        await assertUsernameAvailable(username);

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } }, // store desired username
        });
        if (error) throw error;

        navigate("/check-email", { state: { email }, replace: true });

        // If email confirmation is enabled, user will see your “check your email” page once session exists.
      }
    } catch (e: any) {
      setErr(e.message || (mode === "signin" ? "Sign in failed" : "Sign up failed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-app">
      <TopBar />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mx-auto max-w-md glass rounded-2xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500" />
            <h1 className="text-lg font-semibold text-black dark:text-white">
              {mode === "signin" ? "Sign in to SlidesDeck" : "Create your SlidesDeck account"}
            </h1>
          </div>

          <div className="my-4 hr rounded" />

          {mode === "signup" && (
            <>
              <label className="block text-xs font-medium opacity-70 mb-1">Username</label>
              <input
                type="text"
                className="input-glass w-full text-black dark:text-white placeholder:opacity-60"
                placeholder="e.g. felix_omondi"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                autoComplete="username"
              />
              <p
                className={`mt-1 text-xs ${
                  username.length === 0
                    ? "opacity-60"
                    : usernameValid
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                3–20 chars, letters/numbers/underscore; must start with a letter.
              </p>
            </>
          )}

          <label className="block text-xs font-medium opacity-70 mt-3 mb-1">
            {mode === "signup" ? "School email (.edu only)" : "Email"}
          </label>
          <input
            type="email"
            className="input-glass w-full text-black dark:text-white placeholder:opacity-60"
            placeholder={mode === "signup" ? "you@university.edu" : "you@example.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {mode === "signup" && email.length > 0 && !emailIsEdu && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              SlidesDeck is currently for students only — please use a <strong>.edu</strong> email.
            </p>
          )}

          <label className="block text-xs font-medium opacity-70 mt-3 mb-1">Password</label>
          <input
            type="password"
            className="input-glass w-full text-black dark:text-white placeholder:opacity-60"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
          />

          {err && <div className="mt-3 text-sm text-red-600 dark:text-red-400">{err}</div>}

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={handleEmailPassword}
              disabled={
                busy ||
                !email ||
                !password ||
                (mode === "signup" && (!username || !usernameValid || !emailIsEdu))
              }
              className="btn-glass border rounded-xl px-3 py-2 text-sm font-medium disabled:opacity-50"
            >
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode((m) => (m === "signin" ? "signup" : "signin"));
                setErr(null);
              }}
              className="text-sm opacity-80 hover:opacity-100 underline"
            >
              {mode === "signin" ? "Create an account" : "Have an account? Sign in"}
            </button>
          </div>

          {mode === "signup" && (
            <p className="mt-2 text-[11px] opacity-60">
              We currently accept <strong>.edu</strong> emails for early access.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}