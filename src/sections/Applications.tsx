import { useApp } from '../app/AppContext'
import './Applications.css'

const APPS = [
  { k: 'app.1', img: '/images/app-residential.jpg', wide: true },
  { k: 'app.2', img: '/images/app-buildings.jpg' },
  { k: 'app.3', img: '/images/app-wall.jpg' },
  { k: 'app.4', img: '/images/app-roof.jpg' },
  { k: 'app.5', img: '/images/app-floor.jpg' },
  { k: 'app.6', img: '/images/app-cold.jpg' },
  { k: 'app.7', img: '/images/app-packaging.jpg' },
]

export default function Applications() {
  const { t } = useApp()

  return (
    <section className="section apps">
      <div className="container">
        <div className="section-head section-head--center" data-reveal>
          <span className="eyebrow">EPS</span>
          <h2 className="h-section">{t('app.title')}</h2>
          <p className="lead">{t('app.desc')}</p>
        </div>

        <div className="apps__grid">
          {APPS.map((a, i) => (
            <article
              key={a.k}
              className={`apps__card ${a.wide ? 'apps__card--wide' : ''}`}
              data-reveal="scale"
              style={{ '--reveal-delay': `${i * 60}ms` } as React.CSSProperties}
            >
              <img src={a.img} alt={t(a.k)} loading="lazy" decoding="async" width={800} height={600} />
              <span className="apps__veil" aria-hidden="true" />
              <h3 className="apps__name">{t(a.k)}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
