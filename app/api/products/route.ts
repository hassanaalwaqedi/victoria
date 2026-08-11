import { NextResponse } from "next/server";
import { getProducts } from "@/lib/catalog";

export async function GET(request: Request) { const query = new URL(request.url).searchParams.get("q")?.trim().toLowerCase(); const products = await getProducts(); const filtered = query ? products.filter((product) => `${product.name_ar} ${product.short_description_ar ?? ""} ${product.category?.name_ar ?? ""}`.toLowerCase().includes(query)) : products.slice(0, 3); return NextResponse.json({ products: filtered }); }
