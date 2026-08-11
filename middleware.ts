import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/config";

export async function middleware(request: NextRequest) { if (!request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname === "/admin/login") return NextResponse.next(); const env = getSupabaseEnv(); if (!env) return NextResponse.redirect(new URL("/admin/login?setup=required", request.url)); let response = NextResponse.next({ request }); const supabase = createServerClient(env.url, env.key, { cookies: { getAll: () => request.cookies.getAll(), setAll(values) { values.forEach(({ name, value, options }) => { request.cookies.set(name, value); response.cookies.set(name, value, options); }); } } }); const { data: { user } } = await supabase.auth.getUser(); const { data: isAdmin } = user ? await supabase.rpc("is_victoria_admin") : { data: false }; if (!user || isAdmin !== true) return NextResponse.redirect(new URL("/admin/login", request.url)); return response; }
export const config = { matcher: ["/admin/:path*"] };
