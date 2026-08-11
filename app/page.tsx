import { HomePage } from "@/components/home/home-page";
import { getProducts } from "@/lib/catalog";
import { getCategories } from "@/lib/catalog";
import { getActivePromotions, getGalleryItems, getHomepageSections, getSiteSettings } from "@/lib/content";

export default async function Page() { const [products, categories, settings, sections, gallery, promotions] = await Promise.all([getProducts({}), getCategories(), getSiteSettings(), getHomepageSections(), getGalleryItems(), getActivePromotions("homepage")]); return <HomePage products={products} categories={categories} settings={settings} sections={sections} gallery={gallery} promotions={promotions} />; }
