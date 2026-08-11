import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { getProductBySlug, getProducts } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/content";

export const dynamic = "force-dynamic";
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const [product, settings] = await Promise.all([getProductBySlug(slug), getSiteSettings()]); if (!product) notFound(); const recommendations = (await getProducts({ bestSeller: true })).filter((item) => item.slug !== slug).slice(0, 3); return <ProductDetail product={product} recommendations={recommendations} currencySymbol={settings?.currency_symbol ?? ""} deliveryNote={settings?.default_delivery_note_ar ?? null} />; }
