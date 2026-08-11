import Link from "next/link";
import { Heart } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
export default function FavoritesPage() { return <><PageHero eyebrow="اختياراتكم المحفوظة" title="المفضلة" /><section className="container-wide flex min-h-[360px] flex-col items-center justify-center py-20 text-center"><Heart size={28} className="text-rose" /><h2 className="mt-5 font-serif text-3xl">لم تحفظوا شيئاً بعد</h2><p className="mt-3 text-sm text-ink/50">احتفظوا بما تحبون لتجدوه بسهولة لاحقاً.</p><Link href="/shop" className="mt-6 border-b border-gold pb-1 text-sm">اكتشفوا التشكيلة ←</Link></section></>; }
