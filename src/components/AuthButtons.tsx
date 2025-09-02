// src/components/AuthButtons.tsx
import { supabase } from "@/lib/supabase";
import { LogIn, LogOut, Mail, Github } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function AuthButtons() {
  const { session } = useAuth();

  async function signInGoogle() {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  }
  async function signOut() {
    await supabase.auth.signOut();
  }

  // Optional email auth helpers
  async function signInEmail() {
    const email = prompt("Email:");
    const password = prompt("Password:");
    if (!email || !password) return;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  }
  async function signUpEmail() {
    const email = prompt("Email:");
    const password = prompt("Password (min 6):");
    if (!email || !password) return;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email to confirm.");
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs opacity-70">{session.user.email}</span>
        <button onClick={signOut} className="btn-glass inline-flex items-center gap-1 text-xs">
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={signInGoogle} className="btn-glass inline-flex items-center gap-1 text-xs">
        <Github className="h-3.5 w-3.5" /> Google
      </button>
      <button onClick={signInEmail} className="btn-glass inline-flex items-center gap-1 text-xs">
        <Mail className="h-3.5 w-3.5" /> Sign in
      </button>
      <button onClick={signUpEmail} className="btn-glass inline-flex items-center gap-1 text-xs">
        <LogIn className="h-3.5 w-3.5" /> Sign up
      </button>
    </div>
  );
}