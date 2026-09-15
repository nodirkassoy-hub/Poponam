import './Logo.css'

interface Props {
  sub: string
  onClick?: () => void
  compact?: boolean
}

export default function Logo({ sub, onClick, compact = false }: Props) {
  return (
    <a
      href="#home"
      className={`logo ${compact ? 'logo--compact' : ''}`}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick()
        }
      }}
      aria-label="PENAPLAST"
    >
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="pl-g" x1="0" y1="0" x2="40" y2="40">
              <stop offset="0%" stopColor="#7cc4ff" />
              <stop offset="55%" stopColor="#0a84ff" />
              <stop offset="100%" stopColor="#0050b4" />
            </linearGradient>
          </defs>
          {/* Penaplast blok siluet — izometrik plita */}
          <path
            d="M20 3.5 35.5 11v18L20 36.5 4.5 29V11L20 3.5Z"
            fill="url(#pl-g)"
            opacity="0.16"
          />
          <path
            d="M20 3.5 35.5 11 20 18.5 4.5 11 20 3.5Z"
            fill="url(#pl-g)"
          />
          <path d="M4.5 11 20 18.5v18L4.5 29V11Z" fill="url(#pl-g)" opacity="0.72" />
          <path d="M35.5 11 20 18.5v18L35.5 29V11Z" fill="url(#pl-g)" opacity="0.45" />
          {/* EPS granula nuqtalari */}
          <g fill="#fff" opacity="0.82">
            <circle cx="14" cy="10.4" r="1.05" />
            <circle cx="20" cy="12.9" r="1.05" />
            <circle cx="26" cy="10.4" r="1.05" />
            <circle cx="20" cy="7.9" r="1.05" />
          </g>
        </svg>
      </span>
      <span className="logo__text">
        <span className="logo__name">PENAPLAST</span>
        <span className="logo__sub">{sub}</span>
      </span>
    </a>
  )
}
