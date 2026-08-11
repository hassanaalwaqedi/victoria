-- Development-only sample content. Replace every value through /admin/settings and /admin/homepage in production.
insert into public.site_settings (store_name, store_name_ar, tagline_ar, description_ar, whatsapp_number, phone_number, email, instagram_url, address_ar, google_maps_url, currency, currency_symbol, delivery_enabled, pickup_enabled, default_delivery_note_ar, opening_hours, footer_note_ar)
select 'Victoria', 'فيكتوريا', 'لحظاتكم تستحق طعماً لا يُنسى', 'كيك وشوكولاتة مصنوعة بعناية لتصبح مناسباتكم أكثر جمالاً.', '966500000000', '0500000000', 'hello@victoria.example', 'https://instagram.com/victoria.bakery', 'الرياض، المملكة العربية السعودية', 'https://maps.google.com', 'SAR', 'ر.س', true, true, 'التوصيل داخل نطاق المتجر بحسب الموعد المتاح.', '[{"label_ar":"السبت — الخميس","value_ar":"١٠ صباحاً — ١١ مساءً"},{"label_ar":"الجمعة","value_ar":"٤ مساءً — ١١ مساءً"}]'::jsonb, 'كل لحظة تستحق الاحتفال.'
where not exists (select 1 from public.site_settings);

insert into public.homepage_sections (section_key, title_ar, subtitle_ar, button_text_ar, button_link, secondary_button_text_ar, secondary_button_link, image_url, is_active, sort_order) values
('hero', 'لحظاتكم تستحق طعماً لا يُنسى', 'كيك وشوكولاتة مصنوعة بعناية لتصبح مناسباتكم أكثر جمالاً.', 'اكتشف تشكيلتنا', '/shop', 'صمم كيكك', '/custom-cake', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=2200&q=90', true, 1),
('custom_cake', 'كيكتك… بتفاصيلك', 'اختر المناسبة، النكهة، الحجم والتصميم، واترك لنا الباقي.', 'ابدأ تصميم كيكك', '/custom-cake', null, null, 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1000&q=88', true, 2),
('chocolate', 'تفاصيل صغيرة… تصنع فرقاً كبيراً', 'بوكسات شوكولاتة فاخرة وتغليف يُفتح على مهل.', 'استكشف عالم الشوكولاتة', '/shop?category=chocolate', null, null, 'https://images.unsplash.com/photo-1548907040-4d42bfc66b38?auto=format&fit=crop&w=1100&q=88', true, 3),
('gift', 'اصنع هديتك', 'اختَر البوكس وأضف كلماتك، لنصنع هدية تشبه ذوقك.', 'صمم هديتك', '/custom-gift', null, null, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1100&q=88', true, 4),
('about', 'من فيكتوريا… إلى أجمل لحظاتكم', 'نؤمن أن التفاصيل الصغيرة هي التي تجعل اللحظات الكبيرة لا تُنسى.', 'تعرف على فيكتوريا', '/about', null, null, 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=1200&q=88', true, 5)
on conflict (section_key) do nothing;

insert into public.gallery_items (image_url, caption_ar, sort_order, is_active)
select source.image_url, source.caption_ar, source.sort_order, source.is_active
from (values
  ('https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=88', 'كيك من Victoria', 1, true),
  ('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=88', 'هدية بتفاصيل دافئة', 2, true),
  ('https://images.unsplash.com/photo-1548907040-4d42bfc66b38?auto=format&fit=crop&w=900&q=88', 'شوكولاتة مختارة بعناية', 3, true)
) as source(image_url, caption_ar, sort_order, is_active)
where not exists (select 1 from public.gallery_items);
