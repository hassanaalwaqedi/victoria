import { LockKeyhole } from "lucide-react";
import { getInternalRouteOption } from "@/lib/navigation/internal-routes";

export function LockedRoute({ href, label = "وجهة الزر" }: { href: string | null; label?: string }) {
  const route = getInternalRouteOption(href);
  return <div className="text-xs text-ink/55"><span>{label}</span><div className="mt-2 flex min-h-11 items-center gap-2 rounded-xl border border-cocoa/10 bg-ink/5 px-3 text-sm text-cocoa"><LockKeyhole size={15} className="shrink-0 text-gold" /><span>{route?.label ?? "صفحة داخل الموقع"}</span></div><p className="mt-2 leading-5 text-ink/40">هذا الرابط مرتبط بصفحة داخل الموقع ولا يمكن تعديله.</p></div>;
}
