import type { CartItem } from "@/lib/types";

export function getCartTotal(items: CartItem[]) { return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0); }
export function formatPrice(value: number, currencySymbol: string) { return `${new Intl.NumberFormat("ar-SA").format(value)}${currencySymbol ? ` ${currencySymbol}` : ""}`; }
