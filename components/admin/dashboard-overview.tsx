import Image from "next/image";
import Link from "next/link";
import { ImageUp, MessageCircle, PackagePlus, Pencil, Plus, Settings, Sparkles, Tags } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/cart/cart-utils";

type Stat = { label: string; value: number };

export function DashboardOverview({ storeName, stats, products, currencySymbol }: { storeName: string; stats: Stat[]; products: Product[]; currencySymbol: string }) {
  const actions = [
    ["إضافة منتج", "/admin/products/new", PackagePlus],
    ["إضافة تصنيف", "/admin/categories", Tags],
    ["تغيير صورة الصفحة الرئيسية", "/admin/homepage", ImageUp],
    ["تعديل رقم واتساب", "/admin/settings", MessageCircle],
    ["إضافة عرض", "/admin/promotions", Sparkles],
  ] as const;
  return <div className="space-y-8"><section><p className="eyebrow">لوحة الإدارة</p><h1 className="mt-3 font-serif text-4xl sm:text-5xl">مرحباً بك في {storeName}</h1><p className="mt-3 text-sm text-ink/55">إدارة المنتجات والمحتوى وإعدادات الموقع من مكان واحد.</p></section><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{stats.map((stat) => <div key={stat.label} className="rounded-[1.4rem] bg-cream p-5 soft-shadow"><p className="text-xs text-ink/50">{stat.label}</p><p className="mt-3 font-serif text-4xl">{stat.value}</p></div>)}</div><section className="rounded-[1.5rem] bg-cream p-5 sm:p-7"><div className="flex items-center justify-between"><h2 className="font-serif text-3xl">إجراءات سريعة</h2><Settings size={18} className="text-gold" /></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{actions.map(([label, href, Icon]) => <Link key={href} href={href} className="flex min-h-20 items-center gap-3 rounded-2xl border hairline px-4 text-sm transition hover:border-gold hover:bg-gold/5"><Icon size={18} className="text-burgundy" />{label}</Link>)}</div></section><section className="rounded-[1.5rem] bg-cream p-5 sm:p-7"><div className="flex items-center justify-between"><div><h2 className="font-serif text-3xl">آخر المنتجات</h2><p className="mt-1 text-xs text-ink/45">أحدث المنتجات المضافة إلى المتجر.</p></div><Link href="/admin/products" className="text-xs text-burgundy">عرض الكل</Link></div>{products.length ? <div className="mt-5 divide-y hairline">{products.map((product) => { const image = product.primary_image_url ?? product.images[0]?.image_url; return <div key={product.id} className="flex items-center gap-3 py-3"><div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#eee7dc]">{image && <Image src={image} alt={product.name_ar} fill sizes="56px" className="object-cover" />}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{product.name_ar}</p><p className="mt-1 text-xs text-ink/45">{formatPrice(product.price, currencySymbol)} · {product.is_available ? "متوفر" : "غير متوفر"}</p></div><Link href={`/admin/products/${product.id}/edit`} className="rounded-full p-2 text-ink/50 hover:bg-ink/5" aria-label={`تعديل ${product.name_ar}`}><Pencil size={16} /></Link></div>; })}</div> : <div className="mt-5 rounded-2xl bg-[#f3eee7] p-7 text-center"><p className="text-sm text-ink/55">لا توجد منتجات بعد.</p><Link href="/admin/products/new" className="mt-3 inline-flex items-center gap-1 text-sm text-burgundy"><Plus size={15} /> إضافة أول منتج</Link></div>}</section></div>;
}
