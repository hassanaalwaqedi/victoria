"use client";

import Image from "next/image";
import { ImagePlus, Save } from "lucide-react";
import { useState } from "react";
import type { HomepageSection } from "@/lib/types";
import { saveHomepageSection } from "@/lib/actions/admin";
import { getHomepageSectionRoute } from "@/lib/navigation/internal-routes";
import { uploadVictoriaMedia } from "@/components/admin/media-upload";
import { LockedRoute } from "@/components/admin/locked-route";
import { Button } from "@/components/ui/button";

const sectionLabels: Record<HomepageSection["section_key"], string> = { hero: "القسم الرئيسي", custom_cake: "الكيك المخصص", chocolate: "الشوكولاتة", gift: "الهدايا", about: "عن المتجر" };
const keys = Object.keys(sectionLabels) as HomepageSection["section_key"][];

function blank(key: HomepageSection["section_key"], sortOrder: number): HomepageSection {
  return { id: "", section_key: key, title_ar: "", subtitle_ar: "", button_text_ar: "", button_link: getHomepageSectionRoute(key, "button_link"), secondary_button_text_ar: "", secondary_button_link: getHomepageSectionRoute(key, "secondary_button_link"), image_url: null, mobile_image_url: null, storage_path: null, is_active: true, sort_order: sortOrder };
}

export function HomepageEditor({ sections }: { sections: HomepageSection[] }) {
  const [items, setItems] = useState(() => keys.map((key, index) => sections.find((item) => item.section_key === key) ?? blank(key, index + 1)));
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  function update(index: number, patch: Partial<HomepageSection>) {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  }

  async function save(index: number) {
    const item = items[index];
    const buttonLink = getHomepageSectionRoute(item.section_key, "button_link");
    const secondaryButtonLink = getHomepageSectionRoute(item.section_key, "secondary_button_link");
    setSaving(item.section_key);
    setStatus("");
    try {
      let imageUrl = item.image_url;
      let storagePath = item.storage_path;
      const file = files[item.section_key];
      if (file) {
        const upload = await uploadVictoriaMedia(file, `homepage/${item.section_key}`);
        imageUrl = upload.url;
        storagePath = upload.path;
      }
      await saveHomepageSection({ ...item, id: item.id || undefined, button_link: buttonLink, secondary_button_link: secondaryButtonLink, image_url: imageUrl, storage_path: storagePath });
      update(index, { button_link: buttonLink, secondary_button_link: secondaryButtonLink, image_url: imageUrl, storage_path: storagePath });
      setStatus("تم حفظ القسم بنجاح");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "حدث خطأ أثناء حفظ القسم");
    } finally {
      setSaving(null);
    }
  }

  return <div className="space-y-6">{status && <p className="rounded-xl bg-gold/10 p-3 text-xs text-cocoa">{status}</p>}{items.map((item, index) => { const primaryRoute = getHomepageSectionRoute(item.section_key, "button_link"); const secondaryRoute = getHomepageSectionRoute(item.section_key, "secondary_button_link"); return <section key={item.section_key} className="rounded-[1.5rem] bg-cream p-5 sm:p-7"><div className="mb-6 flex items-center justify-between"><h2 className="font-serif text-3xl">{sectionLabels[item.section_key]}</h2><label className="toggle-label"><input type="checkbox" checked={item.is_active} onChange={(event) => update(index, { is_active: event.target.checked })} /> ظاهر للزوار</label></div><div className="grid gap-5 lg:grid-cols-[1fr_220px]"><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs text-ink/55 sm:col-span-2">العنوان<input value={item.title_ar ?? ""} onChange={(event) => update(index, { title_ar: event.target.value })} className="form-input" /></label><label className="text-xs text-ink/55 sm:col-span-2">الوصف<textarea value={item.subtitle_ar ?? ""} onChange={(event) => update(index, { subtitle_ar: event.target.value })} rows={3} className="form-input resize-none" /></label><label className="text-xs text-ink/55">نص الزر الرئيسي<input value={item.button_text_ar ?? ""} onChange={(event) => update(index, { button_text_ar: event.target.value })} className="form-input" /></label><LockedRoute href={primaryRoute} label="وجهة الزر الرئيسي" />{item.section_key === "hero" && <><label className="text-xs text-ink/55">نص الزر الثانوي<input value={item.secondary_button_text_ar ?? ""} onChange={(event) => update(index, { secondary_button_text_ar: event.target.value })} className="form-input" /></label><LockedRoute href={secondaryRoute} label="وجهة الزر الثانوي" /></>}</div><div><div className="relative aspect-[1.1] overflow-hidden rounded-2xl bg-[#eee7dc]">{item.image_url ? <Image src={item.image_url} alt={item.title_ar ?? sectionLabels[item.section_key]} fill sizes="220px" className="object-cover" /> : <span className="flex h-full items-center justify-center text-xs text-ink/35">لا توجد صورة</span>}</div><label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border hairline px-3 py-2 text-xs"><ImagePlus size={15} /> رفع أو استبدال<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => setFiles({ ...files, [item.section_key]: event.target.files?.[0] ?? null })} /></label></div></div><Button disabled={saving === item.section_key} onClick={() => save(index)} className="mt-6">{saving === item.section_key ? "جارٍ الحفظ..." : <><Save size={16} /> حفظ القسم</>}</Button></section>; })}</div>;
}
