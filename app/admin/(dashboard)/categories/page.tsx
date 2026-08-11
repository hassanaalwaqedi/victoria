import { getCategories } from "@/lib/catalog";
import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { CategoryManager } from "@/components/admin/category-manager";

export default async function AdminCategoriesPage() { const categories = await getCategories(true); return <><AdminPageHeading eyebrow="تنظيم المتجر" title="التصنيفات" description="رتّبي الأقسام التي تظهر في الكتالوج." /><CategoryManager categories={categories} /></>; }
