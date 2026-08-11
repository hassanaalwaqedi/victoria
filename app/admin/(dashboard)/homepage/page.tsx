import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { HomepageEditor } from "@/components/admin/homepage-editor";
import { getHomepageSections } from "@/lib/content";

export default async function HomepageAdminPage() { const sections = await getHomepageSections(true); return <><AdminPageHeading eyebrow="محتوى الواجهة" title="الصفحة الرئيسية" description="عدّلي النصوص والصور الظاهرة للزوار مع الحفاظ على تصميم الموقع." /><HomepageEditor sections={sections} /></>; }
