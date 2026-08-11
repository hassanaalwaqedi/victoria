import Link from "next/link";
import { Plus } from "lucide-react";
import { getCategories, getProducts } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/content";
import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { AdminProductsTable } from "@/components/admin/admin-products-table";

export default async function AdminProductsPage() { const [products, categories, settings] = await Promise.all([getProducts({ includeUnavailable: true }), getCategories(true), getSiteSettings()]); return <><AdminPageHeading eyebrow="إدارة الكتالوج" title="المنتجات" description="إدارة المنتجات والأسعار والصور والتوفر." action={<Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm text-cream"><Plus size={16} /> إضافة منتج جديد</Link>} /><AdminProductsTable products={products} categories={categories} currencySymbol={settings?.currency_symbol ?? ""} /></>; }
