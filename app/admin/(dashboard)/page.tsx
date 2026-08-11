import { DashboardOverview } from "@/components/admin/dashboard-overview";
import { getCategories, getProducts } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/content";

export default async function AdminPage() {
  const [products, categories, settings] = await Promise.all([getProducts({ includeUnavailable: true }), getCategories(true), getSiteSettings()]);
  const stats = [
    { label: "إجمالي المنتجات", value: products.length },
    { label: "المنتجات المتوفرة", value: products.filter((product) => product.is_available).length },
    { label: "غير المتوفرة", value: products.filter((product) => !product.is_available).length },
    { label: "المنتجات المميزة", value: products.filter((product) => product.is_featured).length },
    { label: "عدد التصنيفات", value: categories.length },
  ];
  return <DashboardOverview storeName={settings?.store_name ?? "المتجر"} stats={stats} products={products.slice(0, 6)} currencySymbol={settings?.currency_symbol ?? ""} />;
}
