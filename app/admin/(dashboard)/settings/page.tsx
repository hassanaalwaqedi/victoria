import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { getSiteSettings } from "@/lib/content";

export default async function SettingsPage() { const settings = await getSiteSettings(); return <><AdminPageHeading eyebrow="إدارة المعلومات" title="إعدادات الموقع" description="هذه المعلومات تظهر تلقائياً في المتجر وطلبات واتساب وصفحة التواصل." /><SiteSettingsForm settings={settings} /></>; }
