# PENAPLAST — PENAPLAST ZAVODI

EPS penaplast ishlab chiqarish zavodining rasmiy veb-sayti.

**Tel:** [+998 99 513 22 22](tel:+998995132222)

---

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # ishlab chiqarish uchun (dist/)
npm run preview
```

## Texnologiyalar

- **React 19 + TypeScript + Vite**
- **three.js** — ultra-realistik EPS blok 3D ko'rgichi (kerak bo'lganda lazy-load qilinadi)
- Sof CSS dizayn tizimi — liquid glass, soft UI, dark/light mavzu

---

## Tez-tez tahrirlanadigan joylar

### 1. Narxlar va zichliklar

`src/data/products.ts` → `DENSITY_PRICES`

```ts
export const DENSITY_PRICES: Record<number, number> = {
  7: 32,  10: 40, 12: 50, 14: 62,
  15: 67, 16: 71, 18: 79, 20: 87,
}
```

Narxni o'zgartirish uchun faqat shu obyektni tahrirlang — kartalar, filtr,
qidiruv, mahsulot sahifasi va buyurtma formasi avtomatik yangilanadi.

### 2. Qalinliklar

`src/data/products.ts` → `THICKNESS_OPTIONS` (maksimal `MAX_THICKNESS_CM = 60`).

### 3. Aloqa ma'lumotlari

`src/data/products.ts` → `CONTACT`.

`email`, `telegram` va manzil hozircha **placeholder** — haqiqiy ma'lumot bilan
almashtiring. Xarita uchun `CONTACT.mapEmbedUrl` ga embed havolasini qo'ying,
shunda placeholder o'rniga haqiqiy xarita ko'rsatiladi.

### 4. Tarjimalar

`src/i18n/translations.ts` — `uz`, `ru`, `en` (uchalasida ham bir xil kalitlar).

---

## Buyurtma formasini backendga ulash

Hozircha **backend yo'q**: so'rov faqat brauzerda (`localStorage`) saqlanadi va
foydalanuvchiga zavodga yuborilgani haqida yolg'on ma'lumot berilmaydi.

Telegram bot / API / CRM ulash uchun `src/lib/submitOrder.ts`:

1. `HAS_BACKEND = true` qiling.
2. `.env` faylga endpoint qo'shing:
   ```
   VITE_ORDER_ENDPOINT=https://api.example.com/orders
   ```
3. Kerak bo'lsa `sendToBackend()` ichidagi so'rovni moslashtiring.

Qolgan kodni o'zgartirish shart emas — forma, validatsiya va muvaffaqiyat
holati o'zi ishlaydi.

---

## Tuzilma

```
src/
  app/AppContext.tsx      # til, mavzu, modal holatlari
  data/products.ts        # NARX, ZICHLIK, QALINLIK, ALOQA (tahrirlanadi)
  i18n/translations.ts    # uz / ru / en
  lib/submitOrder.ts      # buyurtma yuborish qatlami
  three/                  # 3D EPS blok (material + sahna)
  components/             # header, modal, qidiruv, karta, 3D ko'rgich
  sections/               # hero, mahsulotlar, 3D, ishlab chiqarish, aloqa…
public/images/            # mahsulot va zavod rasmlari
```

## Rasmlar

`public/images/` ichidagi fayl nomini saqlagan holda rasmni almashtirsangiz,
sayt avtomatik yangi rasmni ishlatadi.
