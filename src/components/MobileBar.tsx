import { useEffect, useState } from 'react'
import { useApp } from '../app/AppContext'
import { CONTACT } from '../data/products'
import { IconPhone, IconSearch } from './icons'
import './MobileBar.css'

/** Mobil uchun doimiy pastki panel — bir qo'l bilan qulay foydalanish. */
export default function MobileBar() {
  const { t, openOrder, openSearch } = useApp()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`mbar ${show ? 'is-visible' : ''}`}>
      <a href={CONTACT.phoneHref} className="mbar__call" aria-label={t('btn.call')}>
        <IconPhone size={17} />
        <span>{t('btn.call')}</span>
      </a>
      <button type="button" className="mbar__order" onClick={() => openOrder()}>
        {t('btn.order')}
      </button>
      <button
        type="button"
        className="mbar__icon"
        onClick={openSearch}
        aria-label={t('nav.search')}
      >
        <IconSearch size={18} />
      </button>
    </div>
  )
}
