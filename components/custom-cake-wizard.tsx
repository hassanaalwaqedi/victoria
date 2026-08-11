"use client";

import { ArrowLeft, Check, ChevronRight, MessageCircle, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { buildCustomCakeWhatsAppMessage } from "@/lib/whatsapp/custom-cake-message";
import { buildWhatsAppUrl } from "@/lib/whatsapp/utils";
import type { SiteSettings } from "@/lib/types";

const steps = [
  { key: "occasion", title: "المناسبة", options: ["عيد ميلاد", "تخرج", "زفاف", "خطوبة", "طفل جديد", "مناسبة خاصة"] },
  { key: "size", title: "الحجم", options: ["صغير — ٤ أشخاص", "متوسط — ٨ أشخاص", "كبير — ١٢ شخصاً"] },
  { key: "flavor", title: "النكهة", options: ["شوكولاتة داكنة", "فانيلا وفراولة", "ريد فيلفت", "كراميل مملح"] },
  { key: "design", title: "التصميم", options: ["أتركها لذوقكم", "سأرفق صورة مرجعية", "تصميم بسيط وأنيق"] },
] as const;

type SelectionKey = (typeof steps)[number]["key"];
type Selections = Record<SelectionKey, string>;
type CustomerDetails = { name: string; phone: string; fulfillment: string; address: string; date: string; time: string; notes: string };

const emptySelections: Selections = { occasion: "", size: "", flavor: "", design: "" };
const emptyCustomer: CustomerDetails = { name: "", phone: "", fulfillment: "", address: "", date: "", time: "", notes: "" };

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-5 border-b hairline py-3 text-sm last:border-0"><span className="text-ink/45">{label}</span><span className="text-left font-medium text-ink">{value}</span></div>;
}

export function CustomCakeWizard({ settings }: { settings: SiteSettings | null }) {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Selections>(emptySelections);
  const [customer, setCustomer] = useState<CustomerDetails>(() => ({ ...emptyCustomer, fulfillment: settings?.pickup_enabled ? "استلام من المحل" : settings?.delivery_enabled ? "توصيل" : "" }));
  const [error, setError] = useState("");
  const [isOpeningWhatsApp, setIsOpeningWhatsApp] = useState(false);
  const done = step >= steps.length;
  const current = steps[Math.min(step, steps.length - 1)];
  const fulfillmentOptions = [settings?.pickup_enabled && "استلام من المحل", settings?.delivery_enabled && "توصيل"].filter(Boolean) as string[];
  const hasReferenceImage = selections.design.includes("صورة مرجعية");

  function select(option: string) {
    setSelections((currentSelections) => ({ ...currentSelections, [current.key]: option }));
  }

  function startNew() {
    setStep(0);
    setSelections(emptySelections);
    setCustomer({ ...emptyCustomer, fulfillment: settings?.pickup_enabled ? "استلام من المحل" : settings?.delivery_enabled ? "توصيل" : "" });
    setError("");
  }

  function openWhatsApp(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!customer.name.trim() || !customer.phone.trim()) { setError("يرجى إدخال الاسم ورقم الهاتف قبل فتح واتساب."); return; }
    if (!customer.fulfillment) { setError("يرجى اختيار طريقة الاستلام."); return; }
    if (customer.fulfillment === "توصيل" && !customer.address.trim()) { setError("يرجى إدخال عنوان التوصيل."); return; }
    const message = buildCustomCakeWhatsAppMessage({ occasion: selections.occasion, size: selections.size, flavor: selections.flavor, design: selections.design, customerName: customer.name, customerPhone: customer.phone, fulfillment: customer.fulfillment, address: customer.address, pickupDate: customer.date, pickupTime: customer.time, notes: customer.notes }, settings);
    const url = buildWhatsAppUrl(settings?.whatsapp_number, message);
    if (!url) { setError("تعذر فتح واتساب حالياً، يرجى المحاولة مرة أخرى."); return; }
    setIsOpeningWhatsApp(true);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => setIsOpeningWhatsApp(false), 700);
  }

  return <section className="container-wide py-12 sm:py-20"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><aside><p className="eyebrow">رحلة تصميم كيكك</p><h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">نصنع الفكرة<br /><em className="text-rose">كما تتخيلينها</em></h2><p className="mt-5 max-w-sm text-sm leading-8 text-ink/60">أخبرينا عن مناسبتك، وسنحولها إلى قطعة حلوى تشبهك.</p><div className="mt-10 hidden space-y-4 lg:block">{steps.map((item, index) => <div key={item.title} className={`flex items-center gap-3 text-sm ${index === step || (done && index === steps.length - 1) ? "text-ink" : "text-ink/35"}`}><span className={`flex h-8 w-8 items-center justify-center rounded-full border ${index < step ? "border-burgundy bg-burgundy text-white" : "hairline"}`}>{index < step ? <Check size={15} /> : `0${index + 1}`}</span>{item.title}</div>)}</div></aside><div className="rounded-[2rem] bg-white/60 p-5 sm:p-9"><div className="mb-8 flex items-center justify-between text-xs text-ink/40"><span>{done ? "مراجعة التصميم" : `الخطوة ${step + 1} من ${steps.length}`}</span><span className="h-1 w-32 overflow-hidden rounded-full bg-ink/10"><span className="block h-full rounded-full bg-rose transition-all" style={{ width: `${(Math.min(step + 1, steps.length) / steps.length) * 100}%` }} /></span></div>{done ? <form onSubmit={openWhatsApp}><div className="text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-burgundy text-white"><Sparkles size={23} /></span><h3 className="mt-6 font-serif text-4xl">تصميمك جاهز ✨</h3><p className="mx-auto mt-4 max-w-md text-sm leading-7 text-ink/60">راجعي تفاصيل كيكك ثم أرسليها إلى فريق Victoria عبر واتساب.</p></div><section className="mt-8 rounded-[1.5rem] border hairline bg-white/70 p-5 sm:p-7"><h4 className="font-serif text-2xl">تفاصيل كيكك</h4><div className="mt-4"><SummaryRow label="المناسبة" value={selections.occasion} /><SummaryRow label="الحجم" value={selections.size} /><SummaryRow label="النكهة" value={selections.flavor} /><SummaryRow label="التصميم" value={selections.design} /></div></section><section className="mt-5 rounded-[1.5rem] border hairline bg-white/70 p-5 sm:p-7"><h4 className="font-serif text-2xl">بيانات التواصل والاستلام</h4><div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="text-xs text-ink/55">الاسم<input required value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} className="form-input" placeholder="الاسم الكامل" /></label><label className="text-xs text-ink/55">رقم الهاتف<input required value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} className="form-input" inputMode="tel" placeholder="77…" /></label>{fulfillmentOptions.length > 0 && <label className="text-xs text-ink/55 sm:col-span-2">طريقة الاستلام<select value={customer.fulfillment} onChange={(event) => setCustomer({ ...customer, fulfillment: event.target.value })} className="form-input">{fulfillmentOptions.map((option) => <option key={option}>{option}</option>)}</select></label>}{customer.fulfillment === "توصيل" && <label className="text-xs text-ink/55 sm:col-span-2">عنوان التوصيل<input required value={customer.address} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} className="form-input" placeholder="الحي، الشارع، رقم المبنى" /></label>}<label className="text-xs text-ink/55">تاريخ الاستلام<input type="date" value={customer.date} onChange={(event) => setCustomer({ ...customer, date: event.target.value })} className="form-input" /></label><label className="text-xs text-ink/55">الوقت المفضل<input value={customer.time} onChange={(event) => setCustomer({ ...customer, time: event.target.value })} className="form-input" placeholder="مثال: ٥ مساءً" /></label><label className="text-xs text-ink/55 sm:col-span-2">ملاحظات إضافية<textarea value={customer.notes} onChange={(event) => setCustomer({ ...customer, notes: event.target.value })} rows={4} className="form-input resize-none" placeholder="أي تفاصيل إضافية تودين مشاركتها…" /></label></div></section>{hasReferenceImage && <p className="mt-5 rounded-2xl bg-gold/10 p-4 text-xs leading-6 text-cocoa">بعد فتح واتساب، أرسلي صورة التصميم المرجعية في نفس المحادثة.</p>}{error && <p className="mt-5 rounded-xl bg-burgundy/10 p-3 text-xs text-burgundy">{error}</p>}<Button disabled={isOpeningWhatsApp} className="mt-7 w-full bg-[#25D366] text-white hover:bg-[#1ebe5d] sm:w-auto" type="submit"><MessageCircle size={17} />{isOpeningWhatsApp ? "جارٍ تجهيز الطلب..." : "إرسال الطلب عبر واتساب"}</Button><div className="mt-5 flex flex-wrap gap-4"><button type="button" onClick={() => setStep(0)} className="text-sm text-ink/60 underline-offset-4 hover:underline">تعديل التصميم</button><button type="button" onClick={startNew} className="inline-flex items-center gap-2 text-sm text-ink/45 underline-offset-4 hover:underline"><RotateCcw size={14} />ابدأ تصميماً جديداً</button></div><p className="mt-6 text-xs leading-6 text-ink/45">سيتم فتح واتساب مع تفاصيل طلبك جاهزة للإرسال. لن يتم حفظ الطلب في الموقع أو Supabase.</p></form> : <><h3 className="font-serif text-3xl">اختيار {current.title}</h3><div className="mt-7 grid gap-3 sm:grid-cols-2">{current.options.map((option) => <button type="button" key={option} onClick={() => select(option)} className={`flex items-center justify-between rounded-2xl border p-4 text-right text-sm transition ${selections[current.key] === option ? "border-burgundy bg-burgundy text-white" : "hairline hover:border-rose"}`}>{option}<ChevronRight size={16} className="rotate-180 opacity-50" /></button>)}</div><div className="mt-9 flex justify-between"><button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} className="text-sm text-ink/50 disabled:opacity-20">رجوع</button><Button type="button" disabled={!selections[current.key]} onClick={() => setStep(step + 1)}>التالي <ArrowLeft size={16} /></Button></div></>}</div></div></section>;
}
