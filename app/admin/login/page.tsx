import { AdminLogin } from "@/components/admin/admin-login";
import { getSiteSettings } from "@/lib/content";
import { isCurrentAdmin } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ setup?: string }> }) { const [params, settings, admin] = await Promise.all([searchParams, getSiteSettings(), isCurrentAdmin()]); if (admin) redirect("/admin"); return <AdminLogin setupRequired={params.setup === "required"} storeName={settings?.store_name ?? "المتجر"} />; }
