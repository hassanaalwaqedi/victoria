"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Category, SiteSettings } from "@/lib/types";
import { SearchOverlay } from "./search-overlay";
import { useCart } from "@/components/cart/cart-provider";

export function SiteHeader({ settings, categories }: { settings: SiteSettings | null; categories: Category[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const { items } = useCart();
  const nav = useMemo(() => [["الرئيسية", "/"], ...categories.slice(0, 3).map((category) => [category.name_ar, `/shop?category=${category.slug}`]), ["المناسبات", "/occasions"], ["صمم كيكك", "/custom-cake"], ["عن المتجر", "/about"], ["تواصل معنا", "/contact"]] as Array<[string, string]>, [categories]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => href === "/" ? pathname === "/" : !href.includes("?") && pathname === href;
  const navLinkClass = (href: string) => `relative py-2 text-[13px] font-medium transition-colors after:absolute after:inset-x-1 after:bottom-0 after:h-px after:origin-right after:bg-burgundy after:transition-transform ${isActive(href) ? "text-burgundy after:scale-x-100" : "text-cocoa/90 after:scale-x-0 hover:text-burgundy hover:after:scale-x-100"}`;
  const mobileNavLinkClass = (href: string) => `border-b hairline pb-3 text-base font-medium transition-colors ${isActive(href) ? "text-burgundy" : "text-cocoa hover:text-burgundy"}`;
  const headerSurface = scrolled ? "border-b border-cocoa/15 bg-cream/95 shadow-[0_12px_30px_rgba(45,32,29,0.10)] backdrop-blur-xl" : "border-b border-cocoa/10 bg-cream/85 shadow-[0_8px_24px_rgba(45,32,29,0.07)] backdrop-blur-lg";

  return <><header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${headerSurface}`}><div className="container-wide flex h-[78px] items-center justify-between gap-3 sm:gap-6"><Link href="/" className="group shrink-0 text-cocoa" aria-label="الصفحة الرئيسية"><span className="font-serif text-[1.7rem] leading-none tracking-[-0.07em] sm:text-[2.2rem]">{settings?.store_name ?? "المتجر"}</span>{settings?.store_name_ar && <span className="mr-2 hidden align-top text-[9px] font-semibold tracking-[0.25em] text-gold sm:inline">{settings.store_name_ar}</span>}</Link><nav className="hidden items-center gap-5 xl:flex" aria-label="التنقل الرئيسي">{nav.map(([label, href]) => <Link key={href} href={href} className={navLinkClass(href)}>{label}</Link>)}</nav><div className="flex items-center gap-0 text-cocoa sm:gap-2"><button className="icon-btn text-cocoa hover:text-burgundy" aria-label="البحث" onClick={() => setSearch(true)}><Search size={18} strokeWidth={1.8} /></button><Link className="icon-btn hidden text-cocoa hover:text-burgundy sm:inline-flex" href="/favorites" aria-label="المفضلة"><Heart size={18} strokeWidth={1.8} /></Link><Link className="icon-btn text-cocoa hover:text-burgundy" href="/cart" aria-label="السلة"><ShoppingBag size={18} strokeWidth={1.8} />{items.length > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[8px] font-semibold text-white ring-2 ring-cream">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>}</Link><button className="icon-btn text-cocoa hover:text-burgundy xl:hidden" aria-label="القائمة" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={21} strokeWidth={1.8} /> : <Menu size={21} strokeWidth={1.8} />}</button></div></div>{open && <div className="border-t border-cocoa/10 bg-cream/98 px-5 pb-7 pt-4 shadow-[0_16px_30px_rgba(45,32,29,0.08)] backdrop-blur-xl xl:hidden"><nav className="flex flex-col gap-4" aria-label="التنقل على الهاتف">{nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className={mobileNavLinkClass(href)}>{label}</Link>)}</nav></div>}</header>{search && <SearchOverlay onClose={() => setSearch(false)} />}</>;
}
