import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/page-hero";
import { getHomepageSections, getSection, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = { title: "عن المتجر" };
export default async function AboutPage() { const [sections, settings] = await Promise.all([getHomepageSections(), getSiteSettings()]); const about = getSection(sections, "about"); return <><PageHero eyebrow="عن المتجر" title={about?.title_ar ?? settings?.store_name_ar ?? "عن المتجر"} description={about?.subtitle_ar ?? settings?.description_ar ?? undefined} />{about && <section className="container-wide grid gap-12 py-14 sm:py-24 lg:grid-cols-2 lg:items-center">{about.image_url && <div className="relative aspect-[.86] overflow-hidden rounded-[2rem]"><Image src={about.image_url} alt={about.title_ar ?? "عن المتجر"} fill sizes="50vw" className="object-cover" /></div>}<div><p className="eyebrow">{settings?.store_name_ar}</p><h2 className="mt-4 font-serif text-5xl leading-tight">{about.title_ar}</h2>{about.subtitle_ar && <p className="mt-6 text-sm leading-8 text-ink/60">{about.subtitle_ar}</p>}</div></section>}</>; }
