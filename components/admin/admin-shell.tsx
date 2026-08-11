"use client";

import Link from "next/link";
import { GalleryHorizontalEnd, LayoutDashboard, LogOut, Menu, Package, PanelsTopLeft, Settings, Tags, TicketPercent, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const links = [["الرئيسية", "/admin", LayoutDashboard], ["المنتجات", "/admin/products", Package], ["التصنيفات", "/admin/categories", Tags], ["الصفحة الرئيسية", "/admin/homepage", PanelsTopLeft], ["معرض الصور", "/admin/gallery", GalleryHorizontalEnd], ["العروض", "/admin/promotions", TicketPercent], ["إعدادات الموقع", "/admin/settings", Settings]] as const;

export function AdminShell({ children, storeName }: { children: React.ReactNode; storeName: string }) {
  const router = useRouter(); const pathname = usePathname(); const [open, setOpen] = useState(false);
  async function logout() { await getSupabaseBrowserClient()?.auth.signOut(); router.push("/admin/login"); router.refresh(); }
  const navigation = <><Link href="/admin" onClick={() => setOpen(false)} className="block border-b border-cream/10 px-3 pb-5"><span className="font-serif text-3xl">{storeName}</span><span className="mt-1 block text-[10px] text-gold">لوحة الإدارة</span></Link><nav className="mt-4 space-y-1">{links.map(([label, href, Icon]) => <Link href={href} onClick={() => setOpen(false)} key={href} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${pathname === href ? "bg-rose text-cream" : "text-cream/60 hover:bg-white/10 hover:text-cream"}`}><Icon size={17} />{label}</Link>)}</nav><button type="button" onClick={logout} className="mt-7 flex min-h-11 w-full items-center gap-3 border-t border-cream/10 px-3 pt-5 text-sm text-cream/50 transition hover:text-rose"><LogOut size={17} />تسجيل الخروج</button></>;
  return <div className="min-h-screen bg-[#f3eee7]"><header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b hairline bg-cream/95 px-5 backdrop-blur lg:hidden"><span className="font-serif text-2xl">{storeName}</span><button type="button" onClick={() => setOpen(true)} className="rounded-xl p-2 text-ink" aria-label="فتح القائمة"><Menu size={22} /></button></header>{open && <div className="fixed inset-0 z-50 bg-ink/35 lg:hidden" onClick={() => setOpen(false)}><aside className="h-full w-[min(82vw,320px)] bg-ink p-4 text-cream shadow-2xl" onClick={(event) => event.stopPropagation()}><button type="button" onClick={() => setOpen(false)} className="mr-auto block rounded-lg p-2 text-cream/70" aria-label="إغلاق القائمة"><X size={20} /></button>{navigation}</aside></div>}<div className="container-wide grid gap-8 py-6 pb-16 lg:grid-cols-[220px_1fr] lg:py-10"><aside className="hidden h-fit rounded-[1.5rem] bg-ink p-4 text-cream lg:sticky lg:top-8 lg:block">{navigation}</aside><main className="min-w-0">{children}</main></div></div>;
}
