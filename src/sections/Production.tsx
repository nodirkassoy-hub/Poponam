import { useApp } from '../app/AppContext'
import './Production.css'

const STEPS = [
  { n: '01', k: 'prod.s1', d: 'prod.s1d' },
  { n: '02', k: 'prod.s2', d: 'prod.s2d' },
  { n: '03', k: 'prod.s3', d: 'prod.s3d' },
  { n: '04', k: 'prod.s4', d: 'prod.s4d' },
  { n: '05', k: 'prod.s5', d: 'prod.s5d' },
  { n: '06', k: 'prod.s6', d: 'prod.s6d' },
]

export default function Production() {
  const { t } = useApp()

  return (
    <section id="production" className="section prd">
      <div className="prd__bg" aria-hidden="true">
        <img src="/images/factory-hall.jpg" alt="" loading="lazy" decoding="async" />
      </div>
      <div className="prd__veil" aria-hidden="true" />

      <div className="container prd__inner">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{t('brand.sub')}</span>
          <h2 className="h-section">{t('prod.title')}</h2>
          <p className="lead">{t('prod.desc')}</p>
        </div>

        <div className="prd__layout">
          <ol className="prd__steps">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                className="prd__step card card--hover"
                data-reveal="left"
                style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}
              >
                <span className="prd__num">{s.n}</span>
                <div className="prd__text">
                  <h3 className="prd__steptitle">{t(s.k)}</h3>
                  <p className="prd__stepdesc">{t(s.d)}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="prd__media" data-reveal="right">
            <figure className="prd__shot card">
              <img
                src="/images/production-line.jpg"
                alt={t('prod.s4')}
                loading="lazy"
                decoding="async"
                width={1000}
                height={667}
              />
              <figcaption>
                <span className="prd__shotnum">04</span>
                {t('prod.s4')}
              </figcaption>
            </figure>

            <figure className="prd__shot card">
              <img
                src="/images/hero-factory.jpg"
                alt={t('prod.s3')}
                loading="lazy"
                decoding="async"
                width={1000}
                height={667}
              />
              <figcaption>
                <span className="prd__shotnum">03</span>
                {t('prod.s3')}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
