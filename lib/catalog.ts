import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/types";

type ProductFilters = { category?: string; featured?: boolean; bestSeller?: boolean; includeUnavailable?: boolean };
type ProductRow = Omit<Product, "category" | "images" | "options"> & { categories: Category | null; product_images: Product["images"]; product_options: Product["options"] };
const productSelect = "*, categories(*), product_images(*), product_options(*)";
function normalizeProduct(row: ProductRow): Product { return { ...row, category: row.categories, images: row.product_images ?? [], options: row.product_options ?? [] }; }

export async function getProducts(filters: ProductFilters = {}) { const supabase = await getSupabaseServerClient(); if (!supabase) return [] as Product[]; let query = supabase.from("products").select(productSelect).order("sort_order", { ascending: true }).order("created_at", { ascending: false }); if (!filters.includeUnavailable) query = query.eq("is_available", true); if (filters.featured) query = query.eq("is_featured", true); if (filters.bestSeller) query = query.eq("is_best_seller", true); if (filters.category) query = query.eq("categories.slug", filters.category); const { data, error } = await query; if (error || !data) return [] as Product[]; return (data as unknown as ProductRow[]).map(normalizeProduct); }
export async function getProductBySlug(slug: string) { const products = await getProducts(); return products.find((product) => product.slug === slug) ?? null; }
export async function getProductById(id: string) { const supabase = await getSupabaseServerClient(); if (!supabase) return null; const { data, error } = await supabase.from("products").select(productSelect).eq("id", id).maybeSingle(); return error || !data ? null : normalizeProduct(data as unknown as ProductRow); }
export async function getCategories(includeInactive = false) { const supabase = await getSupabaseServerClient(); if (!supabase) return [] as Category[]; let query = supabase.from("categories").select("*").order("sort_order", { ascending: true }); if (!includeInactive) query = query.eq("is_active", true); const { data } = await query; return (data ?? []) as Category[]; }
