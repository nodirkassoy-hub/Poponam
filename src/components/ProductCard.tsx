import { useState } from 'react'
import { useApp } from '../app/AppContext'
import {
  SHEET_SIZE_LABEL,
  THICKNESS_OPTIONS,
  formatPrice,
  priceForDensity,
  type ProductCategory,
} from '../data/products'
import { IconArrowRight } from './icons'
import './ProductCard.css'

interface Props {
  product: ProductCategory
  /** filtrdan kelgan boshlang'ich qiymatlar */
  initialDensity: number
  initialThickness: number
  index: number
}

export default function ProductCard({ product, initialDensity, initialThickness, index }: Props) {
  const { t, openDetail, openOrder, densityLabel, thicknessLabel } = useApp()
  const [density, setDensity] = useState(initialDensity)
  const [thickness, setThickness] = useState(initialThickness)

  // Filtr o'zgarganda kartani sinxronlash
  const [lastInit, setLastInit] = useState(`${initialDensity}-${initialThickness}`)
  const currentInit = `${initialDensity}-${initialThickness}`
  if (currentInit !== lastInit) {
    setLastInit(currentInit)
    setDensity(initialDensity)
    setThickness(initialThickness)
  }

  const price = priceForDensity(density)
  const thicknessList = product.thicknesses.length ? product.thicknesses : THICKNESS_OPTIONS

  return (
    <article
      className="pcard card card--hover"
      data-reveal="scale"
      style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
    >
      <div className="pcard__media">
        <img
          src={product.image}
          alt={t(product.nameKey)}
          loading="lazy"
          decoding="async"
          width={800}
          height={534}
        />
        <span className="pcard__tag">{t(product.shortKey)}</span>
      </div>

      <div className="pcard__body">
        <h3 className="pcard__name">{t(product.nameKey)}</h3>
        <p className="pcard__desc">{t(product.descKey)}</p>

        <div className="pcard__selectors">
          <div className="field">
            <label className="field-label" htmlFor={`d-${product.id}`}>
              {t('label.density')}
            </label>
            <div className="select-wrap">
              <select
                id={`d-${product.id}`}
                className="select"
                value={density}
                onChange={(e) => setDensity(Number(e.target.value))}
              >
                {product.densities.map((d) => (
                  <option key={d} value={d}>
                    {densityLabel(d)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor={`th-${product.id}`}>
              {t('label.thickness')}
            </label>
            <div className="select-wrap">
              <select
                id={`th-${product.id}`}
                className="select"
                value={thickness}
                onChange={(e) => setThickness(Number(e.target.value))}
              >
                {thicknessList.map((th) => (
                  <option key={th} value={th}>
                    {thicknessLabel(th)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pcard__specs">
          <div>
            <span>{t('label.size')}</span>
            <b>{SHEET_SIZE_LABEL}</b>
          </div>
          <div className="pcard__pricebox">
            <span>{t('label.price')}</span>
            <b className="pcard__price">{formatPrice(price)}</b>
          </div>
        </div>

        <div className="pcard__actions">
          <button
            type="button"
            className="btn btn--glass btn--sm pcard__btn"
            onClick={() => openDetail(product.id, { density, thickness })}
          >
            {t('btn.details')}
            <IconArrowRight size={14} />
          </button>
          <button
            type="button"
            className="btn btn--primary btn--sm pcard__btn"
            onClick={() => openOrder({ productId: product.id, density, thickness })}
          >
            {t('btn.order')}
          </button>
        </div>
      </div>
    </article>
  )
}
