import { useEffect, useRef, useState } from 'react'
import { useApp } from '../app/AppContext'
import FoamViewer from '../components/FoamViewer'
import { IconArrowDown, IconArrowRight, IconPhone } from '../components/icons'
import { CONTACT, DENSITY_OPTIONS, MAX_THICKNESS_CM, PRODUCTS } from '../data/products'
import './Hero.css'

export default function Hero() {
  const { t, openOrder } = useApp()
  const heroRef = useRef<HTMLElement>(null)
  const [parallax, setParallax] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        if (y < window.innerHeight * 1.2) setParallax(y)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="home" className="hero" ref={heroRef}>
      {/* Zavod fon tasviri — real ishlab chiqarish muhiti */}
      <div
        className="hero__bg"
        style={{ transform: `translate3d(0, ${parallax * 0.28}px, 0) scale(1.08)` }}
        aria-hidden="true"
      >
        <img
          src="/images/hero-factory.jpg"
          alt=""
          fetchPriority="high"
          decoding="async"
          width={1536}
          height={1024}
        />
      </div>
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__beam" aria-hidden="true" />

      <div className="hero__inner container">
        <div className="hero__content">
          <span className="hero__badge glass">
            <span className="hero__dot" />
            {t('hero.badge')}
          </span>

          <h1 className="hero__brand">{t('hero.title')}</h1>

          <p className="hero__headline">
            <span>{t('hero.headline1')}</span>
            <span className="hero__headline-2">{t('hero.headline2')}</span>
          </p>

          <p className="hero__desc">{t('hero.desc')}</p>

          <div className="hero__cta">
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={() => scrollTo('products')}
            >
              {t('hero.cta1')}
              <IconArrowRight size={16} />
            </button>
            <button
              type="button"
              className="btn btn--glass btn--lg"
              onClick={() => openOrder()}
            >
              {t('hero.cta2')}
            </button>
          </div>

          <a href={CONTACT.phoneHref} className="hero__phone">
            <span className="hero__phoneicon">
              <IconPhone size={15} />
            </span>
            <span className="hero__phonetext">
              <span className="hero__phonelabel">{t('btn.call')}</span>
              <span className="hero__phonenum">{CONTACT.phone}</span>
            </span>
          </a>

          <dl className="hero__stats">
            <div>
              <dt>{DENSITY_OPTIONS.length}</dt>
              <dd>{t('hero.stat1')}</dd>
            </div>
            <div>
              <dt>{MAX_THICKNESS_CM}</dt>
              <dd>{t('hero.stat2')}</dd>
            </div>
            <div>
              <dt>{PRODUCTS.length}</dt>
              <dd>{t('hero.stat3')}</dd>
            </div>
          </dl>
        </div>

        {/* Ultra-realistik 3D EPS blok */}
        <div className="hero__product">
          <div className="hero__glow" aria-hidden="true" />
          <FoamViewer
            className="hero__viewer"
            color="#f4f5f7"
            quality="high"
            autoRotate
            loadingLabel={t('exp.loading')}
            fallbackImage="/images/product-white-eps.jpg"
            fallbackAlt={t('product.white.name')}
          />
          <div className="hero__chips">
            <span className="hero__chip">EPS</span>
            <span className="hero__chip">1000 × 2000 mm</span>
          </div>
        </div>
      </div>

      <button type="button" className="hero__scroll" onClick={() => scrollTo('products')}>
        <span>{t('hero.scroll')}</span>
        <IconArrowDown size={15} />
      </button>
    </section>
  )
}
