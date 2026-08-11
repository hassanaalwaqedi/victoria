import type { SiteSettings } from "@/lib/types";

export type CustomCakeRequest = {
  occasion: string;
  size: string;
  flavor: string;
  design: string;
  customerName: string;
  customerPhone: string;
  fulfillment: string;
  address?: string;
  pickupDate?: string;
  pickupTime?: string;
  notes?: string;
};

const hasValue = (value: string | undefined | null) => Boolean(value?.trim());
const line = (label: string, value: string | undefined | null) => hasValue(value) ? `${label}: ${value!.trim()}` : null;

function formatArabicDate(value: string | undefined) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("ar-YE", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function buildCustomCakeWhatsAppMessage(request: CustomCakeRequest, settings: SiteSettings | null) {
  const details = [line("الحجم", request.size), line("النكهة", request.flavor), line("التصميم", request.design)].filter(Boolean);
  const schedule = [line("التاريخ", formatArabicDate(request.pickupDate)), line("الوقت المفضل", request.pickupTime)].filter(Boolean);
  const needsReferenceImage = request.design.includes("صورة مرجعية");
  const sections = [
    "🎂 *طلب تصميم كيك خاص — Victoria*",
    "مرحباً Victoria،\nأرغب في طلب كيكة بتصميم خاص، وهذه التفاصيل:",
    ["👤 *بيانات العميل*", line("الاسم", request.customerName), line("رقم الهاتف", request.customerPhone)].filter(Boolean).join("\n"),
    ["🎉 *المناسبة*", request.occasion].filter(Boolean).join("\n"),
    details.length ? ["🎂 *تفاصيل الكيكة*", ...details].join("\n") : null,
    schedule.length ? ["📅 *موعد الاستلام*", ...schedule].join("\n") : null,
    ["📍 *طريقة الاستلام*", request.fulfillment, request.fulfillment === "توصيل" ? line("العنوان", request.address) : null].filter(Boolean).join("\n"),
    hasValue(request.notes) ? ["📝 *ملاحظات إضافية*", request.notes!.trim()].join("\n") : null,
    needsReferenceImage ? "📷 *صورة مرجعية*\nسأرسل صورة التصميم في هذه المحادثة." : null,
    "💰 *السعر*\nيتم تحديد السعر بعد مراجعة التصميم والتفاصيل من فريق Victoria.",
    "شكراً لكم 🤎",
  ];

  return sections.filter(Boolean).join("\n\n");
}
