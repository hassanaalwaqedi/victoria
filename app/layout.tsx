import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartProvider } from "@/components/cart/cart-provider";
import { getCategories } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://victoria-navy.vercel.app";
const brandTitle = "Victoria | كيك وشوكولاتة للمناسبات";
const brandDescription = "Victoria للكيك والشوكولاتة والهدايا، نصنع تفاصيل مميزة لأعياد الميلاد والحفلات والمناسبات الخاصة في صنعاء.";

export async function generateMetadata(): Promise<Metadata> { const settings = await getSiteSettings(); const title = settings?.store_name ? `${settings.store_name} | كيك وشوكولاتة للمناسبات` : brandTitle; const description = settings?.description_ar || brandDescription; return { metadataBase: new URL(siteUrl), title: { default: title, template: `%s | ${settings?.store_name ?? "Victoria"}` }, description, alternates: { canonical: "/" }, icons: { icon: [{ url: "/favicon.ico", type: "image/x-icon" }, { url: "/icon.png", type: "image/png", sizes: "512x512" }], apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }] }, openGraph: { title, description, siteName: settings?.store_name ?? "Victoria", url: "/", locale: "ar_YE", type: "website", images: [{ url: "/og/victoria-og.jpg", width: 1200, height: 630, alt: "Victoria Cake & Chocolate" }] }, twitter: { card: "summary_large_image", title, description, images: ["/og/victoria-og.jpg"] } }; }

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { const [settings, categories] = await Promise.all([getSiteSettings(), getCategories()]); return <html lang="ar" dir="rtl" suppressHydrationWarning><body><CartProvider><SiteHeader settings={settings} categories={categories} />{children}<SiteFooter settings={settings} categories={categories} /></CartProvider></body></html>; }
