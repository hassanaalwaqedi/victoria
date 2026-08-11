"use client";

import Link from "next/link";
import { ArrowUpLeft, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  useEffect(() => { const controller = new AbortController(); fetch(`/api/products${query ? `?q=${encodeURIComponent(query)}` : ""}`, { signal: controller.signal }).then((response) => response.json()).then((data: { products?: Product[] }) => setResults(data.products ?? [])).catch(() => undefined); return () => controller.abort(); }, [query]);
  return <div className="fixed inset-0 z-50 bg-ink/60 p-4 backdrop-blur-sm sm:p-8" onClick={onClose}>
    <div className="mx-auto mt-4 max-w-3xl rounded-[2rem] bg-cream p-5 soft-shadow sm:mt-10 sm:p-8" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between"><p className="eyebrow">اكتشف مذاقك</p><button onClick={onClose} aria-label="إغلاق البحث"><X size={22} /></button></div>
      <div className="mt-6 flex items-center gap-3 border-b-2 border-ink/15 pb-3"><Search className="text-rose" size={22} /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن كيك، شوكولاتة أو هدية…" className="w-full bg-transparent text-lg outline-none placeholder:text-ink/35" /></div>
      <div className="mt-6 space-y-2">{results.map((product) => <Link key={product.slug} href={`/products/${product.slug}`} onClick={onClose} className="flex items-center justify-between rounded-2xl px-3 py-3 transition hover:bg-white"><span><span className="block text-sm font-medium">{product.name_ar}</span><span className="text-xs text-ink/50">{product.category?.name_ar}</span></span><ArrowUpLeft size={16} className="text-gold" /></Link>)}{!results.length && <p className="py-5 text-center text-sm text-ink/50">لم نجد ما يطابق بحثك، جرّب كلمة أخرى.</p>}</div>
    </div>
  </div>;
}
