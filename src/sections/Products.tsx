import { useMemo, useState } from 'react'
import { useApp } from '../app/AppContext'
import ProductCard from '../components/ProductCard'
import { IconSliders } from '../components/icons'
import {
  DENSITY_OPTIONS,
  PRODUCTS,
  THICKNESS_OPTIONS,
  type ProductCategoryId,
} from '../data/products'
import './Products.css'

type CatFilter = 'all' | ProductCategoryId

export default function Products() {
  const { t, densityLabel, thicknessLabel } = useApp()
  const [cat, setCat] = useState<CatFilter>('all')
  const [density, setDensity] = useState<number>(15)
  const [thickness, setThickness] = useState<number>(20)

  const list = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (cat !== 'all' && p.id !== cat) return false
      if (!p.densities.includes(density)) return false
      if (!p.thicknesses.includes(thickness)) return false
      return true
    })
  }, [cat, density, thickness])

  const cats: { id: CatFilter; label: string }[] = [
    { id: 'all', label: t('products.all') },
    ...PRODUCTS.map((p) => ({ id: p.id as CatFilter, label: t(p.nameKey) })),
  ]

  const reset = () => {
    setCat('all')
    setDensity(15)
    setThickness(20)
  }

  const isDefault = cat === 'all' && density === 15 && thickness === 20

  return (
    <section id="products" className="section prods">
      <div className="container">
        <div className="section-head section-head--center" data-reveal>
          <span className="eyebrow">{t('brand.sub')}</span>
          <h2 className="h-section">{t('products.title')}</h2>
          <p className="lead">{t('products.desc')}</p>
        </div>

        {/* ---- Filters ---- */}
        <div className="prods__filters glass glass--sheen" data-reveal>
          <div className="prods__cats" role="group" aria-label={t('products.title')}>
            {cats.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`chip ${cat === c.id ? 'is-active' : ''}`}
                onClick={() => setCat(c.id)}
                aria-pressed={cat === c.id}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="prods__selects">
            <div className="field prods__field">
              <label className="field-label" htmlFor="filter-density">
                {t('products.filterDensity')}
              </label>
              <div className="select-wrap">
                <select
                  id="filter-density"
                  className="select"
                  value={density}
                  onChange={(e) => setDensity(Number(e.target.value))}
                >
                  {DENSITY_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {densityLabel(d)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field prods__field">
              <label className="field-label" htmlFor="filter-thickness">
                {t('products.filterThickness')}
              </label>
              <div className="select-wrap">
                <select
                  id="filter-thickness"
                  className="select"
                  value={thickness}
                  onChange={(e) => setThickness(Number(e.target.value))}
                >
                  {THICKNESS_OPTIONS.map((th) => (
                    <option key={th} value={th}>
                      {thicknessLabel(th)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              className="btn btn--ghost btn--sm prods__reset"
              onClick={reset}
              disabled={isDefault}
            >
              <IconSliders size={15} />
              {t('products.reset')}
            </button>
          </div>
        </div>

        <p className="prods__count" aria-live="polite">
          <strong>{list.length}</strong> {t('products.found')}
        </p>

        {list.length > 0 ? (
          <div className="prods__grid">
            {list.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                initialDensity={density}
                initialThickness={thickness}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="prods__empty glass" data-reveal>
            <p className="prods__emptytitle">{t('products.notFound')}</p>
            <p className="prods__emptyhint">{t('products.notFoundHint')}</p>
            <button type="button" className="btn btn--glass btn--sm" onClick={reset}>
              {t('products.reset')}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
