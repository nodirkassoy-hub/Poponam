import { useEffect, useRef, useState } from 'react'
import type { FoamScene } from '../three/FoamScene'
import './FoamViewer.css'

interface Props {
  color?: string
  dims?: [number, number, number]
  autoRotate?: boolean
  quality?: 'high' | 'low'
  className?: string
  /** boshqaruv paneli ko'rsatilsinmi */
  controls?: boolean
  loadingLabel?: string
  labels?: { rotate: string; zoom: string; reset: string; auto: string }
  /** WebGL bo'lmasa ko'rsatiladigan zaxira rasm */
  fallbackImage?: string
  fallbackAlt?: string
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl'))
    )
  } catch {
    return false
  }
}

export default function FoamViewer({
  color = '#f4f5f7',
  dims,
  autoRotate = true,
  quality = 'high',
  className = '',
  controls = false,
  loadingLabel = 'Loading…',
  labels,
  fallbackImage,
  fallbackAlt = '',
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<FoamScene | null>(null)
  const [ready, setReady] = useState(false)
  const [supported] = useState(hasWebGL)
  const [auto, setAuto] = useState(autoRotate)
  const [active, setActive] = useState(false)

  // Faqat ko'rinishga chiqqanda ishga tushirish (performance)
  useEffect(() => {
    const host = hostRef.current
    if (!host || !supported) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true)
          io.disconnect()
        }
      },
      { rootMargin: '220px' },
    )
    io.observe(host)
    return () => io.disconnect()
  }, [supported])

  useEffect(() => {
    if (!active || !supported) return
    const host = hostRef.current
    if (!host) return

    let scene: FoamScene | null = null
    let cancelled = false

    // three.js faqat kerak bo'lganda yuklanadi (kod bo'linishi)
    import('../three/FoamScene')
      .then(({ FoamScene: Scene }) => {
        if (cancelled || !hostRef.current) return
        scene = new Scene({
          container: hostRef.current,
          color,
          dims,
          autoRotate,
          quality,
          onReady: () => !cancelled && setReady(true),
        })
        sceneRef.current = scene
      })
      .catch((err) => console.warn('[FoamViewer] 3D init failed', err))

    return () => {
      cancelled = true
      scene?.dispose()
      sceneRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, supported])

  useEffect(() => {
    sceneRef.current?.setColor(color)
  }, [color])

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.autoRotate = auto
  }, [auto])

  if (!supported) {
    return (
      <div className={`foam-viewer foam-viewer--fallback ${className}`}>
        {fallbackImage && <img src={fallbackImage} alt={fallbackAlt} loading="lazy" />}
      </div>
    )
  }

  return (
    <div className={`foam-viewer ${className}`}>
      <div ref={hostRef} className="foam-viewer__canvas" aria-hidden="true" />

      {!ready && (
        <div className="foam-viewer__loading">
          <span className="foam-viewer__spinner" />
          <span>{loadingLabel}</span>
        </div>
      )}

      {controls && labels && (
        <>
          <div className="foam-viewer__hints">
            <span className="foam-hint">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 12a8 8 0 0 1 8-8m8 8a8 8 0 0 1-8 8" />
                <path d="M12 1.5 14.5 4 12 6.5M12 17.5 9.5 20l2.5 2.5" />
              </svg>
              {labels.rotate}
            </span>
            <span className="foam-hint foam-hint--desktop">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5M8 11h6M11 8v6" />
              </svg>
              {labels.zoom}
            </span>
          </div>

          <div className="foam-viewer__controls glass">
            <button
              type="button"
              className="foam-ctrl"
              onClick={() => sceneRef.current?.zoom(0.78)}
              aria-label="Zoom in"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.6-3.6M8 11h6M11 8v6" />
              </svg>
            </button>
            <button
              type="button"
              className="foam-ctrl"
              onClick={() => sceneRef.current?.zoom(1.28)}
              aria-label="Zoom out"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.6-3.6M8 11h6" />
              </svg>
            </button>
            <span className="foam-ctrl__sep" />
            <button
              type="button"
              className={`foam-ctrl ${auto ? 'is-on' : ''}`}
              onClick={() => setAuto((a) => !a)}
              aria-pressed={auto}
              title={labels.auto}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                <path d="M21 3v5h-5" />
              </svg>
            </button>
            <button
              type="button"
              className="foam-ctrl foam-ctrl--text"
              onClick={() => sceneRef.current?.reset()}
            >
              {labels.reset}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
