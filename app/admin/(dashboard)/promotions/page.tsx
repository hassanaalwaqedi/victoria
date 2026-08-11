import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { PromotionManager } from "@/components/admin/promotion-manager";
import { getActivePromotions } from "@/lib/content";

export default async function PromotionsAdminPage() { const promotions = await getActivePromotions(undefined, true); return <><AdminPageHeading eyebrow="عروض المتجر" title="العروض" description="أضيفي عرضاً أو عدّلي عرضه من دون تغيير تصميم الموقع." /><PromotionManager promotions={promotions} /></>; }
