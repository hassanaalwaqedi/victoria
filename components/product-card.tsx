"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/cart/cart-utils";

export function ProductCard({ product, currencySymbol }: { product: Product; currencySymbol: string }) {
  const { addItem } = useCart();
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const image = product.primary_image_url ?? product.images[0]?.image_url ?? null;
  return <article className="group"><div className="relative aspect-[0.92] overflow-hidden rounded-[1.55rem] bg-[#eee7dc]"><Link href={`/products/${product.slug}`} className="block h-full">{image ? <Image src={image} alt={product.name_ar} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" /> : <span className="flex h-full items-center justify-center text-xs text-ink/35">الصورة غير متاحة</span>}</Link>{product.is_best_seller && <span className="absolute right-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[10px] text-burgundy backdrop-blur-sm">الأكثر طلباً</span>}<button onClick={() => setLiked(!liked)} aria-label={liked ? "إزالة من المفضلة" : "إضافة للمفضلة"} className={`absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition ${liked ? "bg-burgundy text-white" : "bg-cream/80 text-ink"}`}><Heart size={16} fill={liked ? "currentColor" : "none"} /></button><button disabled={!product.is_available} onClick={() => { addItem({ productId: product.id, slug: product.slug, name: product.name_ar, image, quantity: 1, unitPrice: product.price, currencySymbol }); setAdded(true); }} className="absolute bottom-3 left-3 flex h-10 items-center gap-2 rounded-full bg-cream px-3 text-xs font-medium text-ink opacity-0 transition group-hover:opacity-100 focus:opacity-100 disabled:cursor-not-allowed disabled:opacity-50">{!product.is_available ? "غير متوفر حالياً" : added ? "أضيفت للسلة" : "أضف للسلة"}<Plus size={15} /></button></div><div className="px-1 pt-4"><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-medium sm:text-base">{product.name_ar}</h3><p className="mt-1 text-xs leading-5 text-ink/50">{product.short_description_ar ?? product.description_ar}</p></div><span className="shrink-0 text-sm text-burgundy">{formatPrice(product.price, currencySymbol)}</span></div></div></article>;
}
