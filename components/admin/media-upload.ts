"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export async function uploadVictoriaMedia(file: File, folder: string) { if (!(["image/jpeg", "image/png", "image/webp"].includes(file.type)) || file.size > 5 * 1024 * 1024) throw new Error("الصور المسموحة JPG وPNG وWEBP وبحجم أقصى 5MB"); const client = getSupabaseBrowserClient(); if (!client) throw new Error("أضيفي بيانات Supabase أولاً"); const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-"); const path = `${folder}/${crypto.randomUUID()}-${safeName}`; const { error } = await client.storage.from("product-images").upload(path, file, { contentType: file.type, upsert: false }); if (error) throw new Error("تعذر رفع الصورة"); const { data } = client.storage.from("product-images").getPublicUrl(path); return { path, url: data.publicUrl }; }
