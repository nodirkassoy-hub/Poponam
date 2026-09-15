import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DICTS, UNITS, type Lang } from '../i18n/translations'
import {
  DENSITY_OPTIONS,
  THICKNESS_OPTIONS,
  type ProductCategoryId,
} from '../data/products'

export type Theme = 'dark' | 'light'

export interface OrderPrefill {
  productId: ProductCategoryId
  density: number
  thickness: number
}

interface AppState {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
  units: { density: string; thickness: string }
  densityLabel: (d: number) => string
  thicknessLabel: (t: number) => string

  theme: Theme
  toggleTheme: () => void

  searchOpen: boolean
  openSearch: () => void
  closeSearch: () => void

  orderOpen: boolean
  orderPrefill: OrderPrefill
  openOrder: (prefill?: Partial<OrderPrefill>) => void
  closeOrder: () => void

  detailId: ProductCategoryId | null
  openDetail: (id: ProductCategoryId, prefill?: Partial<OrderPrefill>) => void
  closeDetail: () => void
  detailPrefill: OrderPrefill
}

const Ctx = createContext<AppState | null>(null)

const DEFAULT_PREFILL: OrderPrefill = {
  productId: 'white',
  density: 15,
  thickness: 20,
}

function readTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const saved = window.localStorage.getItem('penaplast-theme')
  if (saved === 'light' || saved === 'dark') return saved
  return 'dark'
}

function readLang(): Lang {
  if (typeof window === 'undefined') return 'uz'
  const saved = window.localStorage.getItem('penaplast-lang')
  if (saved === 'uz' || saved === 'ru' || saved === 'en') return saved
  return 'uz'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang)
  const [theme, setTheme] = useState<Theme>(readTheme)
  const [searchOpen, setSearchOpen] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const [orderPrefill, setOrderPrefill] = useState<OrderPrefill>(DEFAULT_PREFILL)
  const [detailId, setDetailId] = useState<ProductCategoryId | null>(null)
  const [detailPrefill, setDetailPrefill] = useState<OrderPrefill>(DEFAULT_PREFILL)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem('penaplast-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
    window.localStorage.setItem('penaplast-lang', lang)
  }, [lang])

  // Scroll lock when any overlay is open
  const anyOverlay = searchOpen || orderOpen || detailId !== null
  useEffect(() => {
    if (!anyOverlay) return
    const prev = document.body.style.overflow
    const prevPad = document.body.style.paddingRight
    const sbw = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`
    return () => {
      document.body.style.overflow = prev
      document.body.style.paddingRight = prevPad
    }
  }, [anyOverlay])

  const t = useCallback(
    (key: string) => DICTS[lang][key] ?? DICTS.uz[key] ?? key,
    [lang],
  )

  const units = UNITS[lang]

  const value = useMemo<AppState>(
    () => ({
      lang,
      setLang: setLangState,
      t,
      units,
      densityLabel: (d: number) => `${d} ${units.density}`,
      thicknessLabel: (th: number) => `${th} ${units.thickness}`,
      theme,
      toggleTheme: () => setTheme((p) => (p === 'dark' ? 'light' : 'dark')),
      searchOpen,
      openSearch: () => setSearchOpen(true),
      closeSearch: () => setSearchOpen(false),
      orderOpen,
      orderPrefill,
      openOrder: (prefill) => {
        setOrderPrefill((prev) => ({
          productId: prefill?.productId ?? prev.productId,
          density: normalizeDensity(prefill?.density ?? prev.density),
          thickness: normalizeThickness(prefill?.thickness ?? prev.thickness),
        }))
        setOrderOpen(true)
      },
      closeOrder: () => setOrderOpen(false),
      detailId,
      detailPrefill,
      openDetail: (id, prefill) => {
        setDetailPrefill((prev) => ({
          productId: id,
          density: normalizeDensity(prefill?.density ?? prev.density),
          thickness: normalizeThickness(prefill?.thickness ?? prev.thickness),
        }))
        setDetailId(id)
      },
      closeDetail: () => setDetailId(null),
    }),
    [lang, t, units, theme, searchOpen, orderOpen, orderPrefill, detailId, detailPrefill],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

function normalizeDensity(d: number) {
  return DENSITY_OPTIONS.includes(d) ? d : DENSITY_OPTIONS[0]
}
function normalizeThickness(t: number) {
  return THICKNESS_OPTIONS.includes(t) ? t : THICKNESS_OPTIONS[0]
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
