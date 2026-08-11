import { notFound } from "next/navigation";
import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { ProductForm } from "@/components/admin/product-form";
import { getCategories, getProductById } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/content";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const [product, categories, settings] = await Promise.all([getProductById(id), getCategories(true), getSiteSettings()]); if (!product) notFound(); return <><AdminPageHeading eyebrow="تعديل المنتج" title={product.name_ar} description="غيّري المعلومات أو الصور ثم احفظي التغييرات." /><ProductForm categories={categories} product={product} currencySymbol={settings?.currency_symbol ?? ""} /></>; }
