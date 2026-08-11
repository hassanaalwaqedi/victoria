import type { HomepageSection } from "@/lib/types";

export const INTERNAL_ROUTE_OPTIONS = [
  { href: "/shop", label: "المتجر" },
  { href: "/shop?category=chocolate", label: "تشكيلة الشوكولاتة" },
  { href: "/custom-cake", label: "صفحة تصميم الكيك" },
  { href: "/custom-gift", label: "صفحة تصميم الهدية" },
  { href: "/occasions", label: "المناسبات" },
  { href: "/about", label: "عن المتجر" },
  { href: "/contact", label: "تواصل معنا" },
  { href: "/checkout", label: "إرسال الطلب عبر واتساب" },
] as const;

type RouteField = "button_link" | "secondary_button_link";

const HOMEPAGE_SECTION_ROUTES: Record<HomepageSection["section_key"], Record<RouteField, string | null>> = {
  hero: { button_link: "/shop", secondary_button_link: "/custom-cake" },
  custom_cake: { button_link: "/custom-cake", secondary_button_link: null },
  chocolate: { button_link: "/shop?category=chocolate", secondary_button_link: null },
  gift: { button_link: "/custom-gift", secondary_button_link: null },
  about: { button_link: "/about", secondary_button_link: null },
};

export function getHomepageSectionRoute(sectionKey: HomepageSection["section_key"], field: RouteField) {
  return HOMEPAGE_SECTION_ROUTES[sectionKey][field];
}

export function getInternalRouteOption(href: string | null | undefined) {
  return INTERNAL_ROUTE_OPTIONS.find((route) => route.href === href) ?? null;
}

export function isInternalApplicationRoute(href: string | null | undefined) {
  return Boolean(href?.trim().startsWith("/"));
}

export function getTrustedInternalRoute(href: string | null | undefined) {
  return getInternalRouteOption(href)?.href ?? null;
}
