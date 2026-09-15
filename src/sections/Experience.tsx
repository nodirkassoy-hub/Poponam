import { useState } from 'react'
import { useApp } from '../app/AppContext'
import FoamViewer from '../components/FoamViewer'
import { PRODUCTS, SHEET_SIZE_LABEL, getProduct, type ProductCategoryId } from '../data/products'
import './Experience.css'

export default function Experience() {
  const { t, densityLabel, thicknessLabel } = useApp()
  const [material, setMaterial] = useState<ProductCategoryId>('white')

  const product = getProduct(material)

  const specs = [
    { label: 'EPS', value: t('tech.materialValue') },
    { label: t('label.density').toUpperCase(), value: densityLabel(15) },
    { label: t('label.thickness').toUpperCase(), value: thicknessLabel(20) },
    { label: t('label.size').toUpperCase(), value: SHEET_SIZE_LABEL },
  ]

  return (
    <section id="experience" className="section exp">
      <div className="container">
        <div className="section-head section-head--center" data-reveal>
          <span className="eyebrow">3D</span>
          <h2 className="h-section">{t('exp.title')}</h2>
          <p className="lead">{t('exp.desc')}</p>
        </div>

        <div className="exp__stage glass glass--sheen" data-reveal="scale">
          <div className="exp__glow" aria-hidden="true" />

          <FoamViewer
            className="exp__viewer"
            color={product.viewerColor}
            dims={[2.3, 0.66, 1.45]}
            quality="high"
            autoRotate
            controls
            loadingLabel={t('exp.loading')}
            labels={{
              rotate: t('exp.rotate'),
              zoom: t('exp.zoom'),
              reset: t('exp.reset'),
              auto: t('exp.autorotate'),
            }}
            fallbackImage={product.image}
            fallbackAlt={t(product.nameKey)}
          />

          {/* Material tanlash */}
          <div className="exp__materials">
            <span className="exp__matlabel">{t('exp.material')}</span>
            <div className="exp__matrow">
              {PRODUCTS.filter((p) => p.id !== 'crushed').map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`exp__mat ${material === p.id ? 'is-active' : ''}`}
                  onClick={() => setMaterial(p.id)}
                  aria-pressed={material === p.id}
                >
                  <span
                    className="exp__swatch"
                    style={{ background: p.viewerColor }}
                    aria-hidden="true"
                  />
                  {t(p.nameKey)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Belgilar */}
        <dl className="exp__specs">
          {specs.map((s, i) => (
            <div
              key={s.label}
              className="exp__spec card"
              data-reveal
              style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
            >
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
