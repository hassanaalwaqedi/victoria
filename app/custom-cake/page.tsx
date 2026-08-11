import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { CustomCakeWizard } from "@/components/custom-cake-wizard";
import { getHomepageSections, getSection, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = { title: "صمم كيكك" };
export default async function CustomCakePage() { const [sections, settings] = await Promise.all([getHomepageSections(), getSiteSettings()]); const section = getSection(sections, "custom_cake"); return <><PageHero eyebrow="تجربة مخصصة" title={section?.title_ar ?? "صمم كيكك"} description={section?.subtitle_ar ?? undefined} /><CustomCakeWizard settings={settings} /></>; }
