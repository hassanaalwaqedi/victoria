import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { WhatsAppCheckout } from "@/components/cart/whatsapp-checkout";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = { title: "إرسال الطلب عبر واتساب" };
export default async function CheckoutPage() { const settings = await getSiteSettings(); return <><PageHero eyebrow="خطوة أخيرة" title="إرسال الطلب عبر واتساب" description={settings?.default_delivery_note_ar ?? undefined} /><WhatsAppCheckout settings={settings} /></>; }
