import { useApp } from '../app/AppContext'
import { CONTACT, DENSITY_OPTIONS, MAX_THICKNESS_CM } from '../data/products'
import { IconCube, IconFactory, IconPhone } from '../components/icons'
import './About.css'

export default function About() {
  const { t, openOrder } = useApp()

  const facts = [
    { Icon: IconFactory, k: 'about.f1', d: 'about.f1d' },
    { Icon: IconCube, k: 'about.f2', d: 'about.f2d' },
    { Icon: IconPhone, k: 'about.f3', d: 'about.f3d' },
  ]

  return (
    <section id="about" className="section abt">
      <div className="container abt__inner">
        <div className="abt__text" data-reveal="left">
          <span className="eyebrow">{t('brand.sub')}</span>
          <h2 className="h-section">{t('about.title')}</h2>
          <p className="abt__lead">{t('about.lead')}</p>
          <p className="abt__p">{t('about.p1')}</p>
          <p className="abt__p">{t('about.p2')}</p>

          <div className="abt__facts">
            {facts.map(({ Icon, k, d }) => (
              <div key={k} className="abt__fact">
                <span className="abt__facticon" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <div>
                  <h3>{t(k)}</h3>
                  <p>{t(d)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="abt__cta">
            <button type="button" className="btn btn--primary" onClick={() => openOrder()}>
              {t('btn.order')}
            </button>
            <a href={CONTACT.phoneHref} className="btn btn--glass abt__phone">
              <IconPhone size={16} />
              {CONTACT.phone}
            </a>
          </div>
        </div>

        <div className="abt__visual" data-reveal="right">
          <figure className="abt__photo card">
            <img
              src="/images/factory-hall.jpg"
              alt={t('prod.title')}
              loading="lazy"
              decoding="async"
              width={1000}
              height={667}
            />
          </figure>

          <div className="abt__badges">
            <div className="abt__badge glass">
              <strong>{DENSITY_OPTIONS[0]}–{DENSITY_OPTIONS[DENSITY_OPTIONS.length - 1]}</strong>
              <span>kg/m³</span>
            </div>
            <div className="abt__badge glass">
              <strong>≤ {MAX_THICKNESS_CM}</strong>
              <span>cm</span>
            </div>
            <div className="abt__badge glass">
              <strong>EPS</strong>
              <span>{t('tech.materialValue')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
