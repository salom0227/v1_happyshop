# Saytdagi API lar — xulosa

Bu hujjat backend (Django) API lari va ularning frontend (Next.js) da qayerda ishlatilishini ko‘rsatadi.

---

## 1. Backend API tuzilishi

- **Asosiy URL:** `NEXT_PUBLIC_API_URL` (default: `http://localhost:8000`)
- **Prefix:** `/api` (store va auth), `/api/services/` (xizmatlar)

---

## 2. Store API (`/api/`) — barchasi frontendda ishlatiladi

| Backend endpoint | Method | Frontendda qayerda | Izoh |
|------------------|--------|--------------------|------|
| `categories/` | GET | Header, Footer (kategoriyalar ro‘yxati) | `getCategories()` → `categoryApi` / `categories-client` |
| `categories/<slug>/products/` | GET | Katalog sahifa (`/catalog/[slug]`) | `getCategoryProducts(slug)` → `productApi` |
| `promo-categories/` | GET | Bosh sahifa (Kim uchun sovg‘a), Aksiyalar, Gift-for | `getPromoCategories()` → `categoryApi` |
| `promo-categories/<slug>/products/` | GET | Aksiyalar/[slug], Gift-for/[slug] | `getPromoCategoryProducts(slug)` → `productApi` |
| `banners/` | GET | Bosh sahifa (hero slayder) | `getBanners()` → `categoryApi`, `app/page.tsx` |
| `products/` | GET | Umuman mahsulotlar ro‘yxati | `getProducts()` → `productApi` |
| `products/<slug>/` | GET | Mahsulot sahifasi `/product/[slug]` | `getProduct(slug)` → `productApi` |
| `products/search/?q=` | GET | Qidiruv (search bar, `/qidiruv`) | `searchProducts(q)` → `productApi` |
| `products/view/` | POST | Mahsulot sahifasi ko‘rilganda | `recordProductView(productId)` → `productApi` |
| `featured-products/` | GET | Bosh sahifa (xit savdo) | `getFeaturedProducts()` → `productApi` |
| `new-products/` | GET | Bosh sahifa (yangi mahsulotlar) | `getNewProducts()` → `productApi` |
| `best-sellers/` | GET | Bosh sahifa (eng ko‘p sotilganlar) | `getBestSellers()` → `productApi` |
| `cart/?session_id=` | GET | Savatcha, checkout, cart count | `getCart(sessionId)` → `cartApi` |
| `cart/add/` | POST | Mahsulot kartochka / mahsulot sahifasi «Savatga» | `addToCart()` → `cartApi` |
| `cart/update/` | PATCH | Savatcha sahifasida miqdorni o‘zgartirish | `updateCartItem()` → `cartApi` |
| `cart/remove/` | POST | Savatchada o‘chirish | `removeFromCart()` → `cartApi` |
| `order/` | POST | Savatcha «Buyurtma berish» modal | `createOrder()` → `orderApi` |
| `newsletter/` | POST | Footer «Yangiliklardan xabardor» forma | `subscribeNewsletter()` → `newsletterApi` |
| `wishlist/?session_id=` | GET | Sevimlilar, mahsulot kartochka/sahifa | `getWishlist()` → `wishlistApi` |
| `wishlist/add/` | POST | Mahsulotda yurak tugmasi | `addToWishlist()` → `wishlistApi` |
| `wishlist/remove/` | POST | Sevimlilar sahifasi / kartochkada olib tashlash | `removeFromWishlist()` → `wishlistApi` |

**Eslatma:** `cart/<session_id>/` — GET savatcha uchun alternativ URL; frontend hozir faqat `cart/?session_id=` ishlatadi. View bitta, URL ikki xil.

---

## 3. Auth API (`/api/auth/`) — barchasi frontendda ishlatiladi

| Backend endpoint | Method | Frontendda qayerda | Izoh |
|------------------|--------|--------------------|------|
| `register` | POST | Ro‘yxatdan o‘tish (login/register UI) | `register()` → `authApi` |
| `login` | POST | Kirish | `login()` → `authApi` |
| `profile` | GET | Profil sahifasi | `getProfile(accessToken)` → `authApi` |
| `profile` | PATCH | Profil sahifasida tahrirlash | `updateProfile()` → `authApi` |
| `token/refresh` | POST | Access token yangilash | `refreshAccessToken()` → `authApi` |

Ishlatiladigan joylar: `app/profile/profile-content.tsx`, login/register modallari yoki sahifalar (auth storage bilan).

---

## 4. Services API (`/api/services/`) — frontendda ishlatiladi

| Backend endpoint | Method | Frontendda qayerda | Izoh |
|------------------|--------|--------------------|------|
| `` (list) | GET | Bosh sahifa «Xizmatlar» bloki, `/xizmatlar` | `getServicePages()` → `analyticsApi` |
| `<slug>/` | GET | `/xizmatlar/[slug]` (xizmat sahifasi) | `getServicePage(slug)` → `analyticsApi` |

---

## 5. Xulosa: qaysilari ishlayapti, qaysilari ko‘rinmaydi

- **Barcha backend API lar frontendda ishlatiladi.** Hech qanday endpoint faqat backendda qolib, saytda chaqirilmaydigan yo‘q.
- **Frontend** `services/api/` dagi `categoryApi`, `productApi`, `cartApi`, `orderApi`, `newsletterApi`, `wishlistApi`, `authApi`, `analyticsApi` orqali xuddi shu endpoint larni chaqiradi.
- **Admin panel** (`/admin/`) — bu API emas; Django admin, brauzerda kirish orqali ishlatiladi. Sayt (frontend) unga so‘rov yubormaydi.

Agar biror API ishlamasa (masalan, 404 yoki CORS), tekshirish uchun:
1. Backend ishlayotganini: `python manage.py runserver`
2. `NEXT_PUBLIC_API_URL` ning to‘g‘ri (backend manziliga) o‘rnatilganini
3. Brauzer yoki Next.js loglarida qaysi URL ga so‘rov ketayotganini

---

## 6. Qisqa reference: frontend API fayllari

| Fayl | Vazifasi |
|------|----------|
| `services/api/config.ts` | `getApiBaseUrl()`, `getApiUrl()` — base URL va `/api` prefix |
| `services/api/client.ts` | `apiRequest()` — barcha so‘rovlar shu orqali |
| `services/api/categoryApi.ts` | Kategoriyalar, bannerlar, promo kategoriyalar |
| `services/api/productApi.ts` | Mahsulotlar, qidiruv, ko‘rilish, featured/new/best-sellers, kategoriya/promo mahsulotlari |
| `services/api/cartApi.ts` | Savatcha: get, add, update, remove |
| `services/api/orderApi.ts` | Buyurtma yaratish |
| `services/api/newsletterApi.ts` | Footer email obuna |
| `services/api/wishlistApi.ts` | Sevimlilar: get, add, remove |
| `services/api/authApi.ts` | Ro‘yxatdan o‘tish, login, profil, token refresh |
| `services/api/analyticsApi.ts` | Xizmatlar sahifalari (GET /api/services/ va /api/services/<slug>/) |
