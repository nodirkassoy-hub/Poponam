import { useApp } from '../app/AppContext'
import Logo from '../components/Logo'
import { CONTACT, PRODUCTS } from '../data/products'
import { IconMail, IconPhone, IconTelegram } from '../components/icons'
import './Footer.css'

const NAV = [
  { id: 'home', key: 'nav.home' },
  { id: 'products', key: 'nav.products' },
  { id: 'experience', key: 'nav.experience' },
  { id: 'production', key: 'nav.production' },
  { id: 'about', key: 'nav.about' },
  { id: 'contact', key: 'nav.contact' },
]

export default function Footer() {
  const { t, openDetail } = useApp()
  const year = new Date().getFullYear()

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="ftr">
      <div className="container">
        <div className="ftr__top">
          <div className="ftr__brand">
            <Logo sub={t('brand.sub')} onClick={() => go('home')} />
            <p className="ftr__note">{t('footer.note')}</p>
            <div className="ftr__social">
              <a href={CONTACT.phoneHref} className="icon-btn" aria-label={t('contact.phone')}>
                <IconPhone size={16} />
              </a>
              <a
                href={CONTACT.telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                aria-label={t('contact.telegram')}
              >
                <IconTelegram size={16} />
              </a>
              <a href={CONTACT.emailHref} className="icon-btn" aria-label={t('contact.email')}>
                <IconMail size={16} />
              </a>
            </div>
          </div>

          <nav className="ftr__col" aria-label={t('footer.nav')}>
            <h3 className="ftr__title">{t('footer.nav')}</h3>
            {NAV.map((n) => (
              <button key={n.id} type="button" className="ftr__link" onClick={() => go(n.id)}>
                {t(n.key)}
              </button>
            ))}
          </nav>

          <div className="ftr__col">
            <h3 className="ftr__title">{t('footer.products')}</h3>
            {PRODUCTS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="ftr__link"
                onClick={() => openDetail(p.id)}
              >
                {t(p.nameKey)}
              </button>
            ))}
          </div>

          <div className="ftr__col">
            <h3 className="ftr__title">{t('footer.contact')}</h3>
            <a href={CONTACT.phoneHref} className="ftr__link ftr__link--phone">
              {CONTACT.phone}
            </a>
            <a
              href={CONTACT.telegramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="ftr__link"
            >
              {CONTACT.telegram}
            </a>
            <a href={CONTACT.emailHref} className="ftr__link">
              {CONTACT.email}
            </a>
            <span className="ftr__ph">{t('contact.addressPlaceholder')}</span>
          </div>
        </div>

        <div className="divider-glow" />

        <div className="ftr__bottom">
          <p>
            © {year} PENAPLAST ZAVODI. {t('footer.rights')}
          </p>
          <a href={CONTACT.phoneHref} className="ftr__cta">
            <IconPhone size={14} />
            {CONTACT.phone}
          </a>
        </div>
      </div>
    </footer>
  )
}
