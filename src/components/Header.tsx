import { useEffect, useRef, useState } from 'react'
import { useApp } from '../app/AppContext'
import { LANGS, type Lang } from '../i18n/translations'
import { CONTACT } from '../data/products'
import Logo from './Logo'
import {
  IconClose,
  IconGlobe,
  IconMenu,
  IconMoon,
  IconPhone,
  IconSearch,
  IconSun,
} from './icons'
import './Header.css'

const NAV = [
  { id: 'home', key: 'nav.home' },
  { id: 'products', key: 'nav.products' },
  { id: 'experience', key: 'nav.experience' },
  { id: 'production', key: 'nav.production' },
  { id: 'about', key: 'nav.about' },
  { id: 'contact', key: 'nav.contact' },
]

export default function Header() {
  const { t, lang, setLang, theme, toggleTheme, openSearch, openOrder } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [activeId, setActiveId] = useState('home')
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scrollspy
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => !!el,
    )
    if (!sections.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.2, 0.6] },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // Mobil menyu ochilganda scroll lock
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  // Til dropdown tashqariga bosilganda yopish
  useEffect(() => {
    if (!langOpen) return
    const onDown = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setLangOpen(false)
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [langOpen])

  const go = (id: string) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    // menyu yopilib scroll qulfi olingach harakatlanish
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const pickLang = (l: Lang) => {
    setLang(l)
    setLangOpen(false)
  }

  const current = LANGS.find((l) => l.id === lang)!

  return (
    <>
      <header className={`hdr ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="hdr__inner container">
          <Logo sub={t('brand.sub')} onClick={() => go('home')} compact />

          <nav className="hdr__nav" aria-label="Main">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`hdr__link ${activeId === item.id ? 'is-active' : ''}`}
                onClick={() => go(item.id)}
              >
                {t(item.key)}
              </button>
            ))}
          </nav>

          <div className="hdr__actions">
            <button
              type="button"
              className="icon-btn hdr__act"
              onClick={openSearch}
              aria-label={t('nav.search')}
              title={`${t('nav.search')} (Ctrl+K)`}
            >
              <IconSearch />
            </button>

            <div className="hdr__lang" ref={langRef}>
              <button
                type="button"
                className="icon-btn hdr__act hdr__langbtn"
                onClick={() => setLangOpen((o) => !o)}
                aria-label={t('nav.lang')}
                aria-expanded={langOpen}
              >
                <IconGlobe size={17} />
                <span className="hdr__langcode">{current.short}</span>
              </button>
              {langOpen && (
                <div className="hdr__langmenu glass glass--sheen" role="menu">
                  {LANGS.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      role="menuitemradio"
                      aria-checked={l.id === lang}
                      className={`hdr__langitem ${l.id === lang ? 'is-active' : ''}`}
                      onClick={() => pickLang(l.id)}
                    >
                      <span className="hdr__langshort">{l.short}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="icon-btn hdr__act"
              onClick={toggleTheme}
              aria-label={t('nav.theme')}
              title={t('nav.theme')}
            >
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
            </button>

            <button
              type="button"
              className="btn btn--primary btn--sm hdr__cta"
              onClick={() => openOrder()}
            >
              {t('nav.order')}
            </button>

            <button
              type="button"
              className="icon-btn hdr__burger"
              onClick={() => setMenuOpen(true)}
              aria-label={t('nav.menu')}
              aria-expanded={menuOpen}
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </header>

      {/* Mobil menyu */}
      <div className={`mmenu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <button
          type="button"
          className="mmenu__scrim"
          onClick={() => setMenuOpen(false)}
          tabIndex={-1}
          aria-label={t('nav.close')}
        />
        <div className="mmenu__panel" role="dialog" aria-modal="true" aria-label={t('nav.menu')}>
          <div className="mmenu__top">
            <Logo sub={t('brand.sub')} onClick={() => go('home')} compact />
            <button
              type="button"
              className="icon-btn"
              onClick={() => setMenuOpen(false)}
              aria-label={t('nav.close')}
            >
              <IconClose />
            </button>
          </div>

          <nav className="mmenu__nav">
            {NAV.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className={`mmenu__link ${activeId === item.id ? 'is-active' : ''}`}
                style={{ '--i': i } as React.CSSProperties}
                onClick={() => go(item.id)}
              >
                <span>{t(item.key)}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="m9 5 7 7-7 7" />
                </svg>
              </button>
            ))}
          </nav>

          <div className="mmenu__langs">
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`chip ${l.id === lang ? 'is-active' : ''}`}
                onClick={() => setLang(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="mmenu__foot">
            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={() => {
                setMenuOpen(false)
                openOrder()
              }}
            >
              {t('nav.order')}
            </button>
            <a href={CONTACT.phoneHref} className="btn btn--glass btn--block mmenu__phone">
              <IconPhone size={16} />
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
