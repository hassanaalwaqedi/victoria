import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartProvider } from "@/components/cart/cart-provider";
import { getCategories } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> { const settings = await getSiteSettings(); const storeName = settings?.store_name ?? "المتجر"; const description = settings?.description_ar ?? "متجر للحلويات والمنتجات المختارة بعناية."; return { title: { default: storeName, template: `%s | ${storeName}` }, description, openGraph: { title: storeName, description, type: "website" } }; }

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { const [settings, categories] = await Promise.all([getSiteSettings(), getCategories()]); return <html lang="ar" dir="rtl"><body><CartProvider><SiteHeader settings={settings} categories={categories} />{children}<SiteFooter settings={settings} categories={categories} /></CartProvider></body></html>; }
