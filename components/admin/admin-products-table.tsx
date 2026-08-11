"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/types";
import { deleteProduct, toggleProductAvailability } from "@/lib/actions/admin";
import { formatPrice } from "@/lib/cart/cart-utils";

type Filter = "الكل" | "متوفر" | "غير متوفر" | "مميز" | "الأكثر طلباً";

export function AdminProductsTable({ products, categories, currencySymbol }: { products: Product[]; categories: Category[]; currencySymbol: string }) {
  const [items, setItems] = useState(products);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("الكل");
  const [categoryId, setCategoryId] = useState("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const filtered = useMemo(() => items.filter((item) => {
    const normalizedQuery = query.trim().toLowerCase();
    const textMatch = !normalizedQuery || item.name_ar.toLowerCase().includes(normalizedQuery) || item.slug.toLowerCase().includes(normalizedQuery) || item.category?.name_ar.toLowerCase().includes(normalizedQuery);
    const categoryMatch = categoryId === "all" || item.category_id === categoryId;
    const statusMatch = filter === "الكل" || (filter === "متوفر" && item.is_available) || (filter === "غير متوفر" && !item.is_available) || (filter === "مميز" && item.is_featured) || (filter === "الأكثر طلباً" && item.is_best_seller);
    return textMatch && categoryMatch && statusMatch;
  }), [categoryId, filter, items, query]);
  async function remove(product: Product) { if (!window.confirm(`هل أنت متأكد من حذف «${product.name_ar}»؟\n\nسيتم حذف المنتج من الموقع.`)) return; setPendingId(product.id); try { await deleteProduct(product.id); setItems((current) => current.filter((item) => item.id !== product.id)); setMessage("تم حذف المنتج"); } catch { setMessage("حدث خطأ أثناء حذف المنتج"); } finally { setPendingId(null); } }
  async function toggle(product: Product) { const nextAvailability = !product.is_available; setPendingId(product.id); setItems((current) => current.map((item) => item.id === product.id ? { ...item, is_available: nextAvailability } : item)); try { await toggleProductAvailability(product.id, nextAvailability); setMessage("تم تحديث حالة التوفر"); } catch { setItems((current) => current.map((item) => item.id === product.id ? { ...item, is_available: product.is_available } : item)); setMessage("تعذر تحديث حالة التوفر"); } finally { setPendingId(null); } }
  return <div className="rounded-[1.5rem] bg-cream p-4 sm:p-6"><div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto_auto]"><label className="flex items-center gap-3 rounded-full border hairline px-4 py-2 text-sm"><Search size={16} className="text-ink/35" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="البحث عن منتج..." className="w-full bg-transparent outline-none placeholder:text-ink/35" /></label><select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="rounded-full border hairline bg-transparent px-4 py-2 text-xs"><option value="all">كل التصنيفات</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name_ar}</option>)}</select><div className="flex gap-2 overflow-x-auto pb-1">{(["الكل", "متوفر", "غير متوفر", "مميز", "الأكثر طلباً"] as Filter[]).map((item) => <button type="button" key={item} onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-3 py-2 text-xs ${filter === item ? "bg-ink text-cream" : "bg-white/60 text-ink/55"}`}>{item}</button>)}</div></div>{message && <p role="status" className="mb-4 rounded-xl bg-gold/10 p-3 text-xs text-cocoa">{message}</p>}<div className="space-y-3">{filtered.map((product) => { const image = product.primary_image_url ?? product.images[0]?.image_url; const waiting = pendingId === product.id; return <article key={product.id} className="grid items-center gap-4 rounded-2xl border hairline p-3 sm:grid-cols-[60px_1fr_auto_auto]"><div className="relative h-14 w-14 overflow-hidden rounded-xl bg-[#eee7dc]">{image && <Image src={image} alt={product.name_ar} fill sizes="60px" className="object-cover" />}</div><div className="min-w-0"><Link href={`/admin/products/${product.id}/edit`} className="font-medium hover:text-rose">{product.name_ar}</Link><p className="mt-1 truncate text-xs text-ink/45">{product.category?.name_ar ?? "بدون تصنيف"} · {formatPrice(product.price, currencySymbol)}</p><div className="mt-2 flex gap-1">{product.is_featured && <span className="rounded-full bg-gold/15 px-2 py-1 text-[10px] text-cocoa">مميز</span>}{product.is_best_seller && <span className="rounded-full bg-rose/10 px-2 py-1 text-[10px] text-burgundy">الأكثر طلباً</span>}</div></div><button type="button" disabled={waiting} onClick={() => toggle(product)} className={`min-h-9 rounded-full px-3 py-2 text-xs disabled:opacity-60 ${product.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{waiting ? "جارٍ التحديث..." : product.is_available ? "متوفر" : "غير متوفر"}</button><div className="flex gap-1"><Link href={`/admin/products/${product.id}/edit`} className="rounded-full p-2 text-ink/50 hover:bg-ink/5" aria-label={`تعديل ${product.name_ar}`}><Pencil size={16} /></Link><button type="button" disabled={waiting} onClick={() => remove(product)} className="rounded-full p-2 text-ink/50 hover:bg-red-50 hover:text-red-700 disabled:opacity-60" aria-label={`حذف ${product.name_ar}`}><Trash2 size={16} /></button></div></article>; })}</div>{!filtered.length && <div className="py-12 text-center"><p className="text-sm text-ink/45">لا توجد منتجات مطابقة.</p><Link href="/admin/products/new" className="mt-3 inline-block text-sm text-burgundy">إضافة أول منتج</Link></div>}</div>;
}
