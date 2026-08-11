import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = { title: "السلة" };
export default function CartPage() { return <><PageHero eyebrow="خطوتكم التالية" title="سلة مشترياتكم" description="تفاصيل صغيرة في طريقها لتصبح لحظة جميلة." /><CartView /></>; }
