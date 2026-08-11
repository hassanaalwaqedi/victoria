import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { getCategories } from "@/lib/catalog";

export const metadata: Metadata = { title: "التصنيفات" };
export default async function OccasionsPage() { const categories = await getCategories(); return <><PageHero eyebrow="التصنيفات" title="لكل مناسبة حكاية" />{categories.length > 0 ? <section className="container-wide grid gap-4 py-12 sm:grid-cols-2 sm:py-20 lg:grid-cols-3">{categories.map((category, i) => <Link href={`/shop?category=${category.slug}`} key={category.id} className={`group relative aspect-[.9] overflow-hidden rounded-[2rem] bg-cocoa ${i === 1 ? "sm:translate-y-12" : ""}`}>{category.image_url && <Image src={category.image_url} alt={category.name_ar} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />}<div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" /><div className="absolute bottom-0 p-7 text-cream"><p className="mb-2 text-xs text-cream/60">{category.description_ar}</p><h2 className="font-serif text-3xl">{category.name_ar}</h2><span className="mt-4 inline-flex items-center gap-2 text-xs">استكشف المنتجات <ArrowLeft size={14} /></span></div></Link>)}</section> : <p className="container-wide py-20 text-center text-sm text-ink/50">لا توجد تصنيفات ظاهرة حالياً.</p>}</>; }
