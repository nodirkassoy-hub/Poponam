import { useApp } from '../app/AppContext'
import {
  IconFactory,
  IconGauge,
  IconLayers,
  IconShield,
  IconThermo,
  IconTruck,
} from '../components/icons'
import './Why.css'

const ITEMS = [
  { Icon: IconShield, k: 'why.1', d: 'why.1d' },
  { Icon: IconGauge, k: 'why.2', d: 'why.2d' },
  { Icon: IconLayers, k: 'why.3', d: 'why.3d' },
  { Icon: IconThermo, k: 'why.4', d: 'why.4d' },
  { Icon: IconFactory, k: 'why.5', d: 'why.5d' },
  { Icon: IconTruck, k: 'why.6', d: 'why.6d' },
]

export default function Why() {
  const { t } = useApp()

  return (
    <section className="section section--tight why">
      <div className="container">
        <div className="section-head section-head--center" data-reveal>
          <span className="eyebrow">PENAPLAST</span>
          <h2 className="h-section">{t('why.title')}</h2>
          <p className="lead">{t('why.desc')}</p>
        </div>

        <div className="why__grid">
          {ITEMS.map(({ Icon, k, d }, i) => (
            <article
              key={k}
              className="why__item card card--hover"
              data-reveal
              style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}
            >
              <span className="why__icon" aria-hidden="true">
                <Icon size={21} />
              </span>
              <h3 className="why__title">{t(k)}</h3>
              <p className="why__desc">{t(d)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
