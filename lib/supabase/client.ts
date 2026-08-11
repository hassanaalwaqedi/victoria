"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./config";

let browserClient: SupabaseClient | null = null;
export function getSupabaseBrowserClient() { if (browserClient) return browserClient; const env = getSupabaseEnv(); if (!env) return null; browserClient = createBrowserClient(env.url, env.key); return browserClient; }
