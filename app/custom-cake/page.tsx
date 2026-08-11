import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { CustomCakeWizard } from "@/components/custom-cake-wizard";
import { getHomepageSections, getSection } from "@/lib/content";

export const metadata: Metadata = { title: "صمم كيكك" };
export default async function CustomCakePage() { const section = getSection(await getHomepageSections(), "custom_cake"); return <><PageHero eyebrow="تجربة مخصصة" title={section?.title_ar ?? "صمم كيكك"} description={section?.subtitle_ar ?? undefined} /><CustomCakeWizard /></>; }
