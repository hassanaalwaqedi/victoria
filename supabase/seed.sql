insert into public.categories (name_ar, slug, description_ar, image_url, sort_order) values
('كيك أعياد الميلاد', 'birthday-cakes', 'كيكات تحتفل باللحظة كما تتمنونها.', 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=1200&q=88', 1),
('كيك المناسبات', 'occasion-cakes', 'تفاصيل حلوة لكل مناسبة كبيرة.', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1200&q=88', 2),
('الكيك المخصص', 'custom-cakes', 'فكرة لا تشبه غيرها.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=88', 3),
('الشوكولاتة', 'chocolate', 'قطع فاخرة مصنوعة بعناية.', 'https://images.unsplash.com/photo-1548907040-4d42bfc66b38?auto=format&fit=crop&w=1200&q=88', 4),
('بوكسات الهدايا', 'gift-boxes', 'هدية تقول الكثير دون كلمات.', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=88', 5),
('الزفاف والخطوبة', 'weddings', 'لبدايات تستحق الاحتفال.', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=88', 6)
on conflict (slug) do update set name_ar = excluded.name_ar, image_url = excluded.image_url;

insert into public.products (name_ar, slug, description_ar, short_description_ar, price, category_id, primary_image_url, is_featured, is_best_seller, allow_custom_message, allow_flavor_selection, allow_size_selection, sort_order)
values
('كيكة شوكولاتة فيكتوريا', 'victoria-chocolate-cake', 'طبقات غنية، غاناش داكن، ولمسة كاكاو ناعمة.', 'طبقات غنية وغاناش داكن.', 185, (select id from public.categories where slug = 'birthday-cakes'), 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=88', true, true, true, true, true, 1),
('كيكة الفراولة', 'strawberry-cloud-cake', 'كريمة مخملية وفراولة طازجة بطابع خفيف ومنعش.', 'كريمة مخملية وفراولة طازجة.', 165, (select id from public.categories where slug = 'birthday-cakes'), 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=88', true, true, false, true, true, 2),
('كيكة Red Velvet', 'red-velvet-story', 'مذاق كلاسيكي بلون فيكتوريا ولمسة كريمة جبن.', 'مذاق كلاسيكي بلمسة كريمة جبن.', 175, (select id from public.categories where slug = 'occasion-cakes'), 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?auto=format&fit=crop&w=1200&q=88', false, true, true, false, true, 3),
('بوكس شوكولاتة Signature', 'signature-chocolate-box', 'اختيار فاخر من قطع الشوكولاتة المصنوعة يدوياً.', 'قطع مختارة مصنوعة يدوياً.', 220, (select id from public.categories where slug = 'chocolate'), 'https://images.unsplash.com/photo-1548907040-4d42bfc66b38?auto=format&fit=crop&w=1200&q=88', true, true, true, false, false, 4),
('بوكس هدية Victoria', 'victoria-gift-box', 'قطعة مختارة بعناية لتقول الكثير دون كلمات.', 'قطعة مختارة بعناية.', 260, (select id from public.categories where slug = 'gift-boxes'), 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=88', true, false, true, false, false, 5),
('كيكة عيد ميلاد مخصصة', 'custom-birthday-cake', 'تصميم خاص يحتفل بالشخص الذي تحبونه.', 'تصميم خاص يحتفل بمن تحبون.', 240, (select id from public.categories where slug = 'custom-cakes'), 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=1200&q=88', true, false, true, true, true, 6)
on conflict (slug) do update set name_ar = excluded.name_ar, price = excluded.price, primary_image_url = excluded.primary_image_url;

insert into public.product_options (product_id, type, name_ar, price_modifier, sort_order)
select p.id, 'size', option.name_ar, option.price_modifier, option.sort_order from public.products p cross join (values ('صغير', -35, 1), ('متوسط', 0, 2), ('كبير', 55, 3)) as option(name_ar, price_modifier, sort_order) where p.slug in ('victoria-chocolate-cake', 'strawberry-cloud-cake', 'red-velvet-story', 'custom-birthday-cake') and not exists (select 1 from public.product_options po where po.product_id = p.id and po.type = 'size');
insert into public.product_options (product_id, type, name_ar, price_modifier, sort_order)
select p.id, 'flavor', option.name_ar, 0, option.sort_order from public.products p cross join (values ('شوكولاتة', 0, 1), ('فانيلا', 0, 2), ('فراولة', 10, 3), ('ريد فيلفت', 15, 4)) as option(name_ar, price_modifier, sort_order) where p.slug in ('victoria-chocolate-cake', 'strawberry-cloud-cake', 'custom-birthday-cake') and not exists (select 1 from public.product_options po where po.product_id = p.id and po.type = 'flavor');
