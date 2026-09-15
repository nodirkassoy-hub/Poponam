/**
 * Buyurtma so'rovini yuborish qatlami.
 * ------------------------------------------------------------------
 * Hozircha backend YO'Q — so'rov faqat shu brauzerda (localStorage) saqlanadi.
 * Telegram bot / API / CRM ulash uchun quyidagi `sendToBackend` funksiyasini
 * to'ldiring va `HAS_BACKEND` ni true qiling. Qolgan kod o'zgarmaydi.
 */

export interface OrderRequest {
  name: string
  phone: string
  productId: string
  productName: string
  density: number
  thickness: number
  quantity: string
  note: string
  createdAt: string
  lang: string
}

/** Backend ulanganda true qiling. */
export const HAS_BACKEND = false

/** Misol uchun endpoint (ulanganda ishlatiladi). */
const ENDPOINT = (import.meta.env?.VITE_ORDER_ENDPOINT ?? undefined) as string | undefined

export type SubmitResult =
  | { ok: true; delivered: boolean }
  | { ok: false; error: string }

async function sendToBackend(payload: OrderRequest): Promise<boolean> {
  // ---- TELEGRAM / API / CRM integratsiyasi shu yerga ----
  // Masalan:
  // await fetch(ENDPOINT!, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // })
  if (!HAS_BACKEND || !ENDPOINT) return false
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res.ok
}

const STORAGE_KEY = 'penaplast-orders'

export function readStoredOrders(): OrderRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as OrderRequest[]) : []
  } catch {
    return []
  }
}

export async function submitOrder(payload: OrderRequest): Promise<SubmitResult> {
  // Har doim mahalliy nusxa saqlanadi
  try {
    const all = readStoredOrders()
    all.push(payload)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(-100)))
  } catch {
    // localStorage mavjud bo'lmasa ham davom etamiz
  }

  if (!HAS_BACKEND) {
    // Backend yo'q — yetkazilgani haqida yolg'on da'vo qilmaymiz
    return { ok: true, delivered: false }
  }

  try {
    const delivered = await sendToBackend(payload)
    return { ok: true, delivered }
  } catch (e) {
    console.warn('[submitOrder] backend error', e)
    return { ok: true, delivered: false }
  }
}
