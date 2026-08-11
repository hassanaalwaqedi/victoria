"use client";

import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { Category, Product } from "@/lib/types";

export function ShopClient({ products, categories, currencySymbol, initialCategory = "الكل" }: { products: Product[]; categories: Category[]; currencySymbol: string; initialCategory?: string }) {
  const [category, setCategory] = useState(initialCategory || "الكل");
  const [sort, setSort] = useState("الأكثر طلباً");
  const filters = [{ label: "الكل", value: "الكل" }, ...categories.map((item) => ({ label: item.name_ar, value: item.slug }))];
  const visible = useMemo(() => { const list = category === "الكل" ? [...products] : products.filter((p) => p.category?.slug === category || p.category?.name_ar === category); return sort === "السعر من الأقل" ? list.sort((a, b) => a.price - b.price) : sort === "السعر من الأعلى" ? list.sort((a, b) => b.price - a.price) : list; }, [category, products, sort]);
  return <section className="container-wide py-12 sm:py-20"><div className="mb-9 flex flex-col gap-5 border-b hairline pb-6 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]"><SlidersHorizontal size={17} className="ml-2 shrink-0 text-gold" />{filters.map((filter) => <button key={filter.value} onClick={() => setCategory(filter.value)} className={`shrink-0 rounded-full px-4 py-2 text-xs transition ${category === filter.value ? "bg-ink text-cream" : "bg-white/60 text-ink/60 hover:bg-white"}`}>{filter.label}</button>)}</div><label className="flex items-center gap-3 text-xs text-ink/50">ترتيب حسب <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border hairline bg-transparent px-3 py-2 text-ink outline-none"><option>الأكثر طلباً</option><option>الأحدث</option><option>السعر من الأقل</option><option>السعر من الأعلى</option></select></label></div><div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">{visible.map((product) => <ProductCard key={product.slug} product={product} currencySymbol={currencySymbol} />)}</div>{!visible.length && <div className="py-20 text-center text-ink/50">لا توجد منتجات في هذا التصنيف حالياً.</div>}</section>;
}
