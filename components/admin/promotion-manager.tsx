"use client";

import Image from "next/image";
import { ImagePlus, Pencil, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { Promotion } from "@/lib/types";
import { deletePromotion, savePromotion } from "@/lib/actions/admin";
import { getInternalRouteOption, INTERNAL_ROUTE_OPTIONS, isInternalApplicationRoute } from "@/lib/navigation/internal-routes";
import { uploadVictoriaMedia } from "@/components/admin/media-upload";
import { LockedRoute } from "@/components/admin/locked-route";
import { Button } from "@/components/ui/button";

type Draft = { id?: string; title_ar: string; description_ar: string; image_url: string | null; storage_path: string | null; button_text_ar: string; button_link: string; placement: Promotion["placement"]; start_at: string; end_at: string; is_active: boolean; sort_order: number };
const empty: Draft = { title_ar: "", description_ar: "", image_url: null, storage_path: null, button_text_ar: "", button_link: "", placement: "homepage", start_at: "", end_at: "", is_active: true, sort_order: 0 };

export function PromotionManager({ promotions }: { promotions: Promotion[] }) {
  const [draft, setDraft] = useState<Draft>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [externalLinkMode, setExternalLinkMode] = useState(false);
  const setField = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const selectedInternalRoute = getInternalRouteOption(draft.button_link);
  const showExternalLink = externalLinkMode || Boolean(draft.button_link && !isInternalApplicationRoute(draft.button_link));
  const destinationValue = selectedInternalRoute?.href ?? (showExternalLink ? "external" : "");

  function changeDestination(value: string) {
    setStatus("");
    if (value === "external") { setExternalLinkMode(true); if (isInternalApplicationRoute(draft.button_link)) setField("button_link", ""); return; }
    setExternalLinkMode(false);
    setField("button_link", value);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      if (!draft.title_ar) throw new Error("أضيفي عنوان العرض");
      let imageUrl = draft.image_url;
      let storagePath = draft.storage_path;
      if (file) { const upload = await uploadVictoriaMedia(file, "promotions"); imageUrl = upload.url; storagePath = upload.path; }
      await savePromotion({ id: draft.id, title_ar: draft.title_ar, description_ar: draft.description_ar || null, image_url: imageUrl, storage_path: storagePath, button_text_ar: draft.button_text_ar || null, button_link: draft.button_link || null, placement: draft.placement, start_at: draft.start_at ? new Date(draft.start_at).toISOString() : null, end_at: draft.end_at ? new Date(draft.end_at).toISOString() : null, is_active: draft.is_active, sort_order: draft.sort_order });
      window.location.reload();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "تعذر حفظ العرض");
    } finally {
      setSaving(false);
    }
  }

  function edit(item: Promotion) {
    const buttonLink = item.button_link ?? "";
    setDraft({ id: item.id, title_ar: item.title_ar, description_ar: item.description_ar ?? "", image_url: item.image_url, storage_path: item.storage_path, button_text_ar: item.button_text_ar ?? "", button_link: buttonLink, placement: item.placement, start_at: item.start_at?.slice(0, 16) ?? "", end_at: item.end_at?.slice(0, 16) ?? "", is_active: item.is_active, sort_order: item.sort_order });
    setExternalLinkMode(Boolean(buttonLink && !isInternalApplicationRoute(buttonLink)));
  }

  async function remove(item: Promotion) {
    if (!window.confirm("هل تريدين حذف هذا العرض؟")) return;
    try { await deletePromotion(item.id, item.storage_path); window.location.reload(); } catch { setStatus("تعذر حذف العرض"); }
  }

  return <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]"><form onSubmit={save} className="rounded-[1.5rem] bg-cream p-6"><div className="flex items-center justify-between"><h2 className="font-serif text-3xl">{draft.id ? "تعديل العرض" : "عرض جديد"}</h2>{draft.id && <button type="button" onClick={() => { setDraft(empty); setFile(null); setExternalLinkMode(false); }} aria-label="إلغاء"><X size={18} /></button>}</div><div className="mt-6 space-y-4"><label className="text-xs text-ink/55">العنوان<input required value={draft.title_ar} onChange={(event) => setField("title_ar", event.target.value)} className="form-input" /></label><label className="text-xs text-ink/55">الوصف<textarea value={draft.description_ar} onChange={(event) => setField("description_ar", event.target.value)} rows={3} className="form-input resize-none" /></label><div className="grid grid-cols-2 gap-3"><label className="text-xs text-ink/55">نص الزر<input value={draft.button_text_ar} onChange={(event) => setField("button_text_ar", event.target.value)} className="form-input" /></label><label className="text-xs text-ink/55">وجهة الزر<select value={destinationValue} onChange={(event) => changeDestination(event.target.value)} className="form-input"><option value="">بدون رابط</option>{INTERNAL_ROUTE_OPTIONS.map((route) => <option value={route.href} key={route.href}>{route.label}</option>)}<option value="external">رابط خارجي</option></select></label></div>{selectedInternalRoute && <LockedRoute href={selectedInternalRoute.href} />}{showExternalLink && <label className="text-xs text-ink/55">رابط خارجي<input type="url" value={draft.button_link} onChange={(event) => { const value = event.target.value; if (value.trim().startsWith("/")) { setStatus("اختاري صفحة داخلية من القائمة بدلاً من كتابة رابط يدوي."); return; } setField("button_link", value); }} className="form-input" placeholder="https://…" /></label>}<div className="grid grid-cols-2 gap-3"><label className="text-xs text-ink/55">الموضع<select value={draft.placement} onChange={(event) => setField("placement", event.target.value as Promotion["placement"])} className="form-input"><option value="homepage">الصفحة الرئيسية</option><option value="cakes">الكيك</option><option value="chocolate">الشوكولاتة</option></select></label><label className="text-xs text-ink/55">الترتيب<input type="number" value={draft.sort_order} onChange={(event) => setField("sort_order", Number(event.target.value))} className="form-input" /></label></div><div className="grid grid-cols-2 gap-3"><label className="text-xs text-ink/55">يبدأ في<input type="datetime-local" value={draft.start_at} onChange={(event) => setField("start_at", event.target.value)} className="form-input" /></label><label className="text-xs text-ink/55">ينتهي في<input type="datetime-local" value={draft.end_at} onChange={(event) => setField("end_at", event.target.value)} className="form-input" /></label></div><label className="toggle-label"><input type="checkbox" checked={draft.is_active} onChange={(event) => setField("is_active", event.target.checked)} /> العرض ظاهر للزوار</label><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border hairline px-4 py-3 text-xs"><ImagePlus size={16} /> رفع أو استبدال الصورة<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label></div>{status && <p className="mt-4 text-xs text-burgundy">{status}</p>}<Button disabled={saving} className="mt-6">{saving ? "جارٍ الحفظ..." : <><Save size={16} /> حفظ العرض</>}</Button></form><div className="space-y-4">{promotions.map((item) => <div key={item.id} className="flex gap-4 rounded-2xl bg-cream p-4"><div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#eee7dc]">{item.image_url && <Image src={item.image_url} alt={item.title_ar} fill sizes="80px" className="object-cover" />}</div><div className="min-w-0 flex-1"><p className="font-medium">{item.title_ar}</p><p className="mt-1 text-xs text-ink/45">{item.placement === "homepage" ? "الصفحة الرئيسية" : item.placement} · {item.is_active ? "ظاهر" : "مخفي"}</p><div className="mt-3 flex gap-1"><button type="button" onClick={() => edit(item)} className="rounded-full p-2 text-ink/50 hover:bg-ink/5" aria-label="تعديل"><Pencil size={15} /></button><button type="button" onClick={() => remove(item)} className="rounded-full p-2 text-ink/50 hover:bg-red-50 hover:text-red-700" aria-label="حذف"><Trash2 size={15} /></button></div></div></div>)}{!promotions.length && <p className="rounded-2xl bg-cream p-8 text-center text-sm text-ink/45">لا توجد عروض حالياً.</p>}</div></div>;
}
