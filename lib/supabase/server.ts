import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./config";

export async function getSupabaseServerClient(): Promise<SupabaseClient | null> { const env = getSupabaseEnv(); if (!env) return null; const cookieStore = await cookies(); return createServerClient(env.url, env.key, { cookies: { getAll() { return cookieStore.getAll(); }, setAll(values) { try { values.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { /* Server Components cannot always write cookies. */ } } } }); }
export async function getCurrentUser() { const supabase = await getSupabaseServerClient(); if (!supabase) return null; const { data } = await supabase.auth.getUser(); return data.user; }
export async function isCurrentAdmin() { const supabase = await getSupabaseServerClient(); if (!supabase) return false; const { data, error } = await supabase.rpc("is_victoria_admin"); return !error && data === true; }
