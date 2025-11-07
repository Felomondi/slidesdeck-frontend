// src/lib/presentations.ts
import { supabase } from "@/lib/supabaseClient";
import type { OutlineResponse } from "@/types";

export async function savePresentation(title: string, outline: OutlineResponse) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not signed in");

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/presentations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    // Your backend computes next_version; the request model has a default 1,
    // so we can omit "version" and let Pydantic default it.
    body: JSON.stringify({ title, outline }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Save failed: ${res.status} ${res.statusText} — ${body}`);
  }
  return res.json();
}