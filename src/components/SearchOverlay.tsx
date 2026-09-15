import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useApp } from '../app/AppContext'
import {
  DENSITY_OPTIONS,
  PRODUCTS,
  THICKNESS_OPTIONS,
  formatPrice,
  priceForDensity,
  type ProductCategory,
} from '../data/products'
import { IconClose, IconSearch } from './icons'
import './SearchOverlay.css'

interface Hit {
  product: ProductCategory
  density: number
  thickness: number
  score: number
}

/** Qidiruv: nom, tur, zichlik va qalinlik bo'yicha. */
function search(query: string, t: (k: string) => string): Hit[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const tokens = q.split(/[\s,]+/).filter(Boolean)
  const numbers = tokens.map((x) => parseFloat(x.replace(',', '.'))).filter((n) => !Number.isNaN(n))

  // So'ralgan zichlik / qalinlik
  const wantsCm = /(cm|см|sm)/.test(q)
  const densityHit = numbers.find((n) => DENSITY_OPTIONS.includes(n))
  const thicknessHit = numbers.find((n) => THICKNESS_OPTIONS.includes(n))

  const hits: Hit[] = []

  /** So'zning boshidan mos kelishi (substring emas) — "oq" ≠ "qadoqlash". */
  const words = (s: string) => s.split(/[^\p{L}\p{N}]+/u).filter(Boolean)

  for (const p of PRODUCTS) {
    const name = t(p.nameKey).toLowerCase()
    const short = t(p.shortKey).toLowerCase()
    const desc = t(p.descKey).toLowerCase()

    const nameWords = words(name)
    const bagWords = [...nameWords, ...words(short), ...words(desc), p.id, ...p.keywords]

    let score = 0
    let textMatch = false

    for (const tok of tokens) {
      if (Number.isFinite(parseFloat(tok)) && /^\d/.test(tok)) continue
      if (name.startsWith(tok) || nameWords.some((w) => w.startsWith(tok))) {
        score += 10
        textMatch = true
      } else if (bagWords.some((w) => w.startsWith(tok))) {
        score += 5
        textMatch = true
      }
    }

    const numericOnly = tokens.every((tok) => /^[\d.,]+$/.test(tok) || /(cm|см|sm|kg|кг)/.test(tok))
    const matched = textMatch || (numericOnly && numbers.length > 0)
    if (!matched) continue

    if (densityHit) score += 6
    if (thicknessHit) score += 4

    const density = densityHit ?? 15
    const thickness = wantsCm && thicknessHit ? thicknessHit : (thicknessHit ?? 20)

    hits.push({ product: p, density, thickness, score })
  }

  return hits.sort((a, b) => b.score - a.score)
}

export default function SearchOverlay() {
  const { searchOpen, closeSearch, t, openDetail, densityLabel, thicknessLabel } = useApp()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => search(query, t), [query, t])

  useEffect(() => {
    if (!searchOpen) return
    const id = window.setTimeout(() => inputRef.current?.focus(), 90)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('keydown', onKey)
    }
  }, [searchOpen, closeSearch])

  useEffect(() => {
    if (!searchOpen) setQuery('')
  }, [searchOpen])

  if (!searchOpen) return null

  const open = (hit: Hit) => {
    closeSearch()
    openDetail(hit.product.id, { density: hit.density, thickness: hit.thickness })
  }

  const trimmed = query.trim()

  return createPortal(
    <div className="srch" role="presentation">
      <div className="srch__scrim" onClick={closeSearch} />
      <div className="srch__panel" role="dialog" aria-modal="true" aria-label={t('search.title')}>
        <div className="srch__bar">
          <IconSearch size={19} className="srch__icon" />
          <input
            ref={inputRef}
            type="search"
            className="srch__input"
            placeholder={t('search.ph')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t('search.title')}
            autoComplete="off"
          />
          <button type="button" className="icon-btn srch__close" onClick={closeSearch} aria-label={t('nav.close')}>
            <IconClose size={17} />
          </button>
        </div>

        <div className="srch__body">
          {!trimmed && (
            <div className="srch__empty">
              <p className="srch__emptytitle">{t('search.start')}</p>
              <p className="srch__hint">{t('search.hint')}</p>
              <div className="srch__quick">
                {[t('product.white.name'), t('product.black.name'), '15', '20 cm'].map((s) => (
                  <button key={s} type="button" className="chip" onClick={() => setQuery(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {trimmed && results.length === 0 && (
            <div className="srch__empty">
              <p className="srch__emptytitle">{t('search.empty')}</p>
              <p className="srch__hint">{t('search.emptyHint')}</p>
            </div>
          )}

          {trimmed && results.length > 0 && (
            <>
              <p className="srch__count">
                <strong>{results.length}</strong> {t('search.results')}
              </p>
              <ul className="srch__list">
                {results.map((hit) => (
                  <li key={hit.product.id}>
                    <button type="button" className="srch__item" onClick={() => open(hit)}>
                      <img
                        className="srch__thumb"
                        src={hit.product.image}
                        alt={t(hit.product.nameKey)}
                        loading="lazy"
                        width={72}
                        height={72}
                      />
                      <span className="srch__info">
                        <span className="srch__name">{t(hit.product.nameKey)}</span>
                        <span className="srch__meta">
                          <span>
                            {t('label.density')}: <b>{densityLabel(hit.density)}</b>
                          </span>
                          <span className="srch__dot" />
                          <span>
                            {t('label.thickness')}: <b>{thicknessLabel(hit.thickness)}</b>
                          </span>
                        </span>
                      </span>
                      <span className="srch__price">{formatPrice(priceForDensity(hit.density))}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="srch__foot">
          <span className="srch__kbd-row">
            <kbd>Esc</kbd> {t('search.close')}
          </span>
          <span className="srch__kbd-row srch__kbd-row--desktop">
            <kbd>Ctrl</kbd>
            <kbd>K</kbd> {t('search.open')}
          </span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
