import { useEffect } from 'react'
import { AppProvider, useApp } from './app/AppContext'
import { useReveal } from './hooks/useReveal'

import Header from './components/Header'
import MobileBar from './components/MobileBar'
import SearchOverlay from './components/SearchOverlay'
import OrderModal from './components/OrderModal'
import ProductDetail from './components/ProductDetail'

import Hero from './sections/Hero'
import Products from './sections/Products'
import Experience from './sections/Experience'
import Production from './sections/Production'
import Why from './sections/Why'
import Applications from './sections/Applications'
import About from './sections/About'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

function Shell() {
  const { openSearch, t } = useApp()
  useReveal()

  // Ctrl+K / Cmd+K — qidiruv
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openSearch])

  return (
    <>
      <div className="ambient" aria-hidden="true">
        <div className="ambient__grid" />
        <div className="ambient__orb ambient__orb--1" />
        <div className="ambient__orb ambient__orb--2" />
        <div className="ambient__orb ambient__orb--3" />
      </div>

      <a href="#products" className="skip-link">
        {t('nav.products')}
      </a>

      <Header />

      <main id="main">
        <Hero />
        <Products />
        <Experience />
        <Production />
        <Why />
        <Applications />
        <About />
        <Contact />
      </main>

      <Footer />
      <MobileBar />

      <SearchOverlay />
      <OrderModal />
      <ProductDetail />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
