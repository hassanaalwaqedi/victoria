"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/lib/types";

type CartContextValue = { items: CartItem[]; addItem: (item: Omit<CartItem, "lineId">) => void; updateQuantity: (lineId: string, quantity: number) => void; removeItem: (lineId: string) => void; clearCart: () => void; total: number; };
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => { try { const saved = window.localStorage.getItem("victoria-cart-v1"); if (saved) setItems(JSON.parse(saved) as CartItem[]); } catch { /* Ignore malformed local cart data. */ } }, []);
  useEffect(() => { window.localStorage.setItem("victoria-cart-v1", JSON.stringify(items)); }, [items]);
  const value = useMemo<CartContextValue>(() => ({ items, addItem(item) { setItems((current) => { const existing = current.find((entry) => entry.productId === item.productId && entry.size === item.size && entry.flavor === item.flavor && entry.customMessage === item.customMessage); if (existing) return current.map((entry) => entry.lineId === existing.lineId ? { ...entry, quantity: entry.quantity + item.quantity } : entry); return [...current, { ...item, lineId: `${item.productId}-${Date.now()}` }]; }); }, updateQuantity(lineId, quantity) { setItems((current) => quantity <= 0 ? current.filter((item) => item.lineId !== lineId) : current.map((item) => item.lineId === lineId ? { ...item, quantity } : item)); }, removeItem(lineId) { setItems((current) => current.filter((item) => item.lineId !== lineId)); }, clearCart() { setItems([]); }, total: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const value = useContext(CartContext); if (!value) throw new Error("useCart must be used inside CartProvider"); return value; }
