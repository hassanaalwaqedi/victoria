import { UserRound } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
export default function AccountPage() { return <><PageHero eyebrow="مرحباً بكم" title="حسابكم" /><section className="container-wide flex min-h-[350px] items-center justify-center py-20"><div className="text-center"><UserRound className="mx-auto text-gold" size={30} /><p className="mt-5 text-sm leading-7 text-ink/60">سيكون بإمكانكم متابعة طلباتكم وحفظ عناوينكم قريباً.</p></div></section></>; }
