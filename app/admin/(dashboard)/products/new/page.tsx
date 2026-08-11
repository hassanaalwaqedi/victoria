import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/content";

export default async function NewProductPage() { const [categories, settings] = await Promise.all([getCategories(true), getSiteSettings()]); return <><AdminPageHeading eyebrow="منتج جديد" title="إضافة منتج" description="أضيفي التفاصيل التي ستظهر للعملاء." /><ProductForm categories={categories} currencySymbol={settings?.currency_symbol ?? ""} /></>; }
