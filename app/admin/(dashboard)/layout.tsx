import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { isCurrentAdmin } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/content";

export const dynamic = "force-dynamic";
export default async function AdminLayout({ children }: { children: React.ReactNode }) { if (!await isCurrentAdmin()) redirect("/admin/login"); const settings = await getSiteSettings(); return <AdminShell storeName={settings?.store_name ?? "المتجر"}>{children}</AdminShell>; }
