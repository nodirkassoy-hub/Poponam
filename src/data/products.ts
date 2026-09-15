/**
 * PENAPLAST — mahsulot va narx ma'lumotlari.
 * ------------------------------------------------------------------
 * Bu fayl narxlarni tahrirlash uchun yagona manba (single source of truth).
 * Narxni o'zgartirish uchun faqat DENSITY_PRICES ni tahrirlang.
 * Qalinliklarni o'zgartirish uchun THICKNESS_OPTIONS ni tahrirlang.
 */

export type ProductCategoryId = 'white' | 'black' | 'crushed'

/** Zichlik (kg/m³) -> narx (USD). Tahrirlash uchun shu yerni o'zgartiring. */
export const DENSITY_PRICES: Record<number, number> = {
  7: 32,
  10: 40,
  12: 50,
  14: 62,
  15: 67,
  16: 71,
  18: 79,
  20: 87,
}

/** Mavjud zichliklar ro'yxati (tartib bo'yicha). */
export const DENSITY_OPTIONS: number[] = Object.keys(DENSITY_PRICES)
  .map(Number)
  .sort((a, b) => a - b)

/** Maksimal qalinlik — 60 cm dan oshmasligi kerak. */
export const MAX_THICKNESS_CM = 60

/** Mavjud qalinliklar (cm). Tahrirlash uchun shu yerni o'zgartiring. */
export const THICKNESS_OPTIONS: number[] = [1, 2, 3, 5, 10, 15, 20, 30, 40, 50, 60].filter(
  (t) => t <= MAX_THICKNESS_CM,
)

/** Standart o'lcham (mm). */
export const SHEET_SIZE = { width: 1000, length: 2000 }
export const SHEET_SIZE_LABEL = `${SHEET_SIZE.width} × ${SHEET_SIZE.length} mm`

export function priceForDensity(density: number): number {
  return DENSITY_PRICES[density] ?? DENSITY_PRICES[DENSITY_OPTIONS[0]]
}

export function formatPrice(value: number): string {
  return `$${value}`
}

export interface ProductCategory {
  id: ProductCategoryId
  image: string
  /** i18n kalitlari */
  nameKey: string
  shortKey: string
  descKey: string
  /** foydalanish sohalari i18n kalitlari */
  useKeys: string[]
  densities: number[]
  thicknesses: number[]
  /** 3D ko'rgichdagi material rangi */
  viewerColor: string
  /** qidiruv uchun qo'shimcha kalit so'zlar */
  keywords: string[]
}

export const PRODUCTS: ProductCategory[] = [
  {
    id: 'white',
    image: '/images/product-white-eps.jpg',
    nameKey: 'product.white.name',
    shortKey: 'product.white.short',
    descKey: 'product.white.desc',
    useKeys: ['use.roofFloor', 'use.buildings', 'use.thermal'],
    densities: DENSITY_OPTIONS,
    thicknesses: THICKNESS_OPTIONS,
    viewerColor: '#f4f5f7',
    keywords: ['oq', 'white', 'белый', 'eps', 'penaplast', 'пенопласт', 'пеноплast', 'block', 'blok'],
  },
  {
    id: 'black',
    image: '/images/product-black-eps.jpg',
    nameKey: 'product.black.name',
    shortKey: 'product.black.short',
    descKey: 'product.black.desc',
    useKeys: ['use.facade', 'use.thermal', 'use.buildings'],
    densities: DENSITY_OPTIONS,
    thicknesses: THICKNESS_OPTIONS,
    viewerColor: '#2a2d33',
    keywords: ['qora', 'black', 'чёрный', 'черный', 'grafit', 'graphite', 'eps', 'penaplast'],
  },
  {
    id: 'crushed',
    image: '/images/product-crushed-eps.jpg',
    nameKey: 'product.crushed.name',
    shortKey: 'product.crushed.short',
    descKey: 'product.crushed.desc',
    useKeys: ['use.lightConcrete', 'use.packaging', 'use.filling'],
    densities: DENSITY_OPTIONS,
    thicknesses: THICKNESS_OPTIONS,
    viewerColor: '#eef0f3',
    keywords: [
      'maydalangan',
      'crushed',
      'дроблёный',
      'дробленый',
      'kroshka',
      'крошка',
      'granula',
      'гранула',
      'beads',
      'shariklar',
      'eps',
      'penaplast',
      'пенопласт',
    ],
  },
]

export function getProduct(id: ProductCategoryId): ProductCategory {
  return PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0]
}

/** Zavod aloqa ma'lumotlari — tahrirlanadigan. */
export const CONTACT = {
  phone: '+998 99 513 22 22',
  phoneHref: 'tel:+998995132222',
  telegram: '@penaplast',
  telegramHref: 'https://t.me/penaplast',
  /** Quyidagilar hozircha placeholder — haqiqiy ma'lumot bilan almashtiring. */
  email: 'info@penaplast.uz',
  emailHref: 'mailto:info@penaplast.uz',
  mapEmbedUrl: '', // haqiqiy zavod lokatsiyasi ulanganda shu yerga embed URL qo'yiladi
}
