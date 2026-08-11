import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ShopClient } from "@/components/shop-client";
import { getCategories, getProducts } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = { title: "تشكيلة فيكتوريا" };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) { const params = await searchParams; const [products, categories, settings] = await Promise.all([getProducts({}), getCategories(), getSiteSettings()]); return <><PageHero eyebrow="تشكيلة المتجر" title="كل ما يجعل لحظتكم أجمل" description={settings?.description_ar ?? undefined} /><ShopClient products={products} categories={categories} currencySymbol={settings?.currency_symbol ?? ""} initialCategory={params.category || "الكل"} /></>; }
