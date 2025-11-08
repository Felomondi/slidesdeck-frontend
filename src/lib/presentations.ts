// src/lib/presentations.ts
import { supabase } from "@/lib/supabaseClient";
import type { OutlineResponse } from "@/types";

/**
 * Saves a presentation directly to Supabase, associated with the current user.
 * Uses upsert to update existing presentations with the same title for the user.
 */
export async function savePresentation(title: string, outline: OutlineResponse) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    throw new Error(`Session error: ${sessionError.message}`);
  }
  
  if (!session || !session.user) {
    throw new Error("Not signed in");
  }

  const userId = session.user.id;

  // Try direct Supabase save first
  try {
    const now = new Date().toISOString();
    const trimmedTitle = title.trim();

    // First, try to find existing presentation with same title for this user
    const { data: existing, error: findError } = await supabase
      .from("presentations")
      .select("id, version")
      .eq("user_id", userId)
      .eq("title", trimmedTitle)
      .maybeSingle();

    // If find fails due to table/RLS issues, fall back to API
    if (findError && (findError.code === "42P01" || findError.code === "42501")) {
      return await savePresentationViaAPI(title, outline, session.access_token);
    }

    const presentationData = {
      user_id: userId,
      title: trimmedTitle,
      outline_json: outline,
      updated_at: now,
    };

    let result;

    if (existing?.id) {
      // Update existing presentation - increment version
      const { data, error } = await supabase
        .from("presentations")
        .update({
          ...presentationData,
          version: (existing.version || 1) + 1,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new presentation
      const { data, error } = await supabase
        .from("presentations")
        .insert({
          ...presentationData,
          version: 1,
          created_at: now,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return result;
  } catch (error) {
    // Fallback to API if Supabase direct save fails
    if (session.access_token) {
      return await savePresentationViaAPI(title, outline, session.access_token);
    }
    throw error;
  }
}

/**
 * Loads all presentations for the current user from Supabase
 */
export async function loadPresentations() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    throw new Error(`Session error: ${sessionError.message}`);
  }
  
  if (!session || !session.user) {
    throw new Error("Not signed in");
  }

  const userId = session.user.id;

  // Try direct Supabase load first
  try {
    const { data, error } = await supabase
      .from("presentations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      // If table doesn't exist or RLS blocks, fall back to API
      if (error.code === "42P01" || error.code === "42501") {
        return await loadPresentationsViaAPI(session.access_token);
      }
      throw error;
    }

    return data || [];
  } catch (error) {
    // Fallback to API if Supabase direct load fails
    if (session.access_token) {
      return await loadPresentationsViaAPI(session.access_token);
    }
    throw error;
  }
}

/**
 * Fallback: Save via backend API (for cases where direct Supabase access isn't available)
 */
async function savePresentationViaAPI(
  title: string,
  outline: OutlineResponse,
  accessToken: string
) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (!apiBaseUrl) {
    throw new Error("No API base URL configured and Supabase direct save failed");
  }

  const res = await fetch(`${apiBaseUrl}/api/presentations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ title, outline }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Save failed: ${res.status} ${res.statusText} — ${body}`);
  }
  
  return res.json();
}

/**
 * Fallback: Load via backend API (for cases where direct Supabase access isn't available)
 */
async function loadPresentationsViaAPI(accessToken: string) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const res = await fetch(`${apiBaseUrl}/api/presentations`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to load: ${res.status} ${res.statusText}`);
  }

  return res.json();
}