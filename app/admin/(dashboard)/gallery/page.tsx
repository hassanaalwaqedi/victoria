import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { getGalleryItems } from "@/lib/content";

export default async function GalleryAdminPage() { const gallery = await getGalleryItems(true); return <><AdminPageHeading eyebrow="صور المتجر" title="معرض الصور" description="ارفعي الصور، أخفي غير المناسب منها أو احذفيها." /><GalleryManager gallery={gallery} /></>; }
