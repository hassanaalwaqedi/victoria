# إعداد Supabase لـ Victoria

## 1. إنشاء المشروع

أنشئ مشروعاً جديداً في Supabase، ثم انسخ عنوان المشروع وPublishable key إلى ملف `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

لا تضع Service Role key في الواجهة أو ملفات البيئة العامة.

## 2. تشغيل قاعدة البيانات

من SQL Editor شغّل الملفين بالترتيب: `supabase/migrations/001_victoria_catalog.sql` ثم `supabase/migrations/002_victoria_content.sql`، ثم شغّل `supabase/seed.sql` و`supabase/seed_content.sql` عند الحاجة لبيانات تطوير.

ينشئ ذلك جداول الكتالوج والمحتوى والإعدادات، إضافة إلى سياسات RLS وBucket باسم `product-images`.

## 3. مستخدم الإدارة

من Authentication → Users أنشئ مستخدم Email/Password للمالك. بعدها شغّل `supabase/admin-setup.sql` من SQL Editor لربطه تلقائياً بجدول `admin_users`. لا تحفظ كلمة المرور في ملفات المشروع أو SQL. لا توجد صفحة تسجيل عامة؛ تسجيل الدخول متاح فقط من `/admin/login`.

## 4. اختبار الصلاحيات

- الزائر المجهول يستطيع قراءة التصنيفات النشطة والمنتجات المتوفرة فقط.
- الإدارة مقصورة على مستخدم Auth موجود معرفه في `admin_users`؛ تسجيل الدخول وحده لا يكفي.
- الرفع والحذف في Storage مسموحان للمشرف فقط، بينما صور المتجر عامة للعرض.

## 5. تشغيل المشروع

```bash
npm install
npm run dev
```

بعد تسجيل الدخول افتح `/admin`. حدّث رقم واتساب من «إعدادات الموقع». الطلبات لا تُحفظ في Supabase؛ السلة محلية، والطلب النهائي يُرسل إلى الرقم المخزن في `site_settings`.
