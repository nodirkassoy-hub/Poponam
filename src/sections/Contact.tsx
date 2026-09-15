import { useApp } from '../app/AppContext'
import { CONTACT } from '../data/products'
import { IconMail, IconPhone, IconPin, IconTelegram } from '../components/icons'
import './Contact.css'

export default function Contact() {
  const { t, openOrder } = useApp()

  return (
    <section id="contact" className="section cnt">
      <div className="container">
        <div className="section-head section-head--center" data-reveal>
          <span className="eyebrow">{t('brand.sub')}</span>
          <h2 className="h-section">{t('contact.title')}</h2>
          <p className="lead">{t('contact.desc')}</p>
        </div>

        <div className="cnt__layout">
          <div className="cnt__cards">
            {/* Telefon — asosiy */}
            <a href={CONTACT.phoneHref} className="cnt__card cnt__card--primary card" data-reveal>
              <span className="cnt__icon cnt__icon--accent" aria-hidden="true">
                <IconPhone size={19} />
              </span>
              <span className="cnt__body">
                <span className="cnt__label">{t('contact.phone')}</span>
                <span className="cnt__value cnt__value--big">{CONTACT.phone}</span>
              </span>
              <span className="cnt__action btn btn--primary btn--sm">{t('btn.call')}</span>
            </a>

            <a
              href={CONTACT.telegramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="cnt__card card card--hover"
              data-reveal
              style={{ '--reveal-delay': '70ms' } as React.CSSProperties}
            >
              <span className="cnt__icon" aria-hidden="true">
                <IconTelegram size={18} />
              </span>
              <span className="cnt__body">
                <span className="cnt__label">{t('contact.telegram')}</span>
                <span className="cnt__value">{CONTACT.telegram}</span>
              </span>
            </a>

            <a
              href={CONTACT.emailHref}
              className="cnt__card card card--hover"
              data-reveal
              style={{ '--reveal-delay': '140ms' } as React.CSSProperties}
            >
              <span className="cnt__icon" aria-hidden="true">
                <IconMail size={18} />
              </span>
              <span className="cnt__body">
                <span className="cnt__label">{t('contact.email')}</span>
                <span className="cnt__value">{CONTACT.email}</span>
                <span className="cnt__note">{t('contact.placeholderNote')}</span>
              </span>
            </a>

            <div
              className="cnt__card card"
              data-reveal
              style={{ '--reveal-delay': '210ms' } as React.CSSProperties}
            >
              <span className="cnt__icon" aria-hidden="true">
                <IconPin size={18} />
              </span>
              <span className="cnt__body">
                <span className="cnt__label">{t('contact.address')}</span>
                <span className="cnt__value">{t('contact.addressPlaceholder')}</span>
                <span className="cnt__note">{t('contact.placeholderNote')}</span>
              </span>
            </div>

            <button
              type="button"
              className="btn btn--primary btn--lg btn--block cnt__order"
              onClick={() => openOrder()}
              data-reveal
            >
              {t('btn.order')}
            </button>
          </div>

          {/* Xarita joyi — keyinchalik haqiqiy lokatsiya ulanadi */}
          <div className="cnt__map card" data-reveal="right">
            {CONTACT.mapEmbedUrl ? (
              <iframe
                src={CONTACT.mapEmbedUrl}
                title={t('contact.mapTitle')}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="cnt__mapph">
                <div className="cnt__mapgrid" aria-hidden="true" />
                <div className="cnt__mapinner">
                  <span className="cnt__mappin" aria-hidden="true">
                    <IconPin size={22} />
                  </span>
                  <h3>{t('contact.mapTitle')}</h3>
                  <p>{t('contact.mapPlaceholder')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
