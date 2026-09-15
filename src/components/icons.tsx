interface IconProps {
  size?: number
  className?: string
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export const IconSearch = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <circle cx="11" cy="11" r="7.2" />
    <path d="m20.5 20.5-4.2-4.2" />
  </svg>
)

export const IconSun = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.6v2.2M12 19.2v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
  </svg>
)

export const IconMoon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5a8.6 8.6 0 1 0 10.8 10.8Z" />
  </svg>
)

export const IconGlobe = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3.2 9.5h17.6M3.2 14.5h17.6" />
    <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
  </svg>
)

export const IconMenu = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
  </svg>
)

export const IconClose = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
)

export const IconPhone = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M6.3 3.5h3l1.6 4-2 1.3a12.5 12.5 0 0 0 6.3 6.3l1.3-2 4 1.6v3a1.8 1.8 0 0 1-2 1.8A16.8 16.8 0 0 1 4.5 5.5a1.8 1.8 0 0 1 1.8-2Z" />
  </svg>
)

export const IconArrowRight = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M5 12h13M12.5 6l6 6-6 6" />
  </svg>
)

export const IconArrowDown = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M12 5v13M6 11.5l6 6 6-6" />
  </svg>
)

export const IconTelegram = ({ size = 18, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M21.7 4.3 2.9 11.5c-1.1.4-1.1 1.1-.2 1.4l4.7 1.5 1.8 5.5c.2.6.4.8 1 .8.5 0 .7-.2 1-.5l2.4-2.3 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.2-.5-1.8-1.5-1.7Zm-3 3.5-8.5 7.7-.3 3.6-1.8-5.3 10.6-6Z" />
  </svg>
)

export const IconMail = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <rect x="2.8" y="4.8" width="18.4" height="14.4" rx="2.6" />
    <path d="m3.4 7 8.6 5.6L20.6 7" />
  </svg>
)

export const IconPin = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M12 21.2s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10.2" r="2.6" />
  </svg>
)

/* ---- Why Penaplast icons ---- */
export const IconShield = ({ size = 22, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M12 2.8 4.8 5.8v5.6c0 4.4 3 8.4 7.2 9.8 4.2-1.4 7.2-5.4 7.2-9.8V5.8L12 2.8Z" />
    <path d="m8.8 12 2.3 2.3 4.1-4.4" />
  </svg>
)

export const IconGauge = ({ size = 22, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M4 17.5a8.8 8.8 0 1 1 16 0" />
    <path d="m12 13 4-3.4" />
    <circle cx="12" cy="17.5" r="1.4" />
  </svg>
)

export const IconLayers = ({ size = 22, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="m12 3.2 8.4 4.2-8.4 4.2-8.4-4.2 8.4-4.2Z" />
    <path d="m3.6 12 8.4 4.2 8.4-4.2" />
    <path d="m3.6 16.5 8.4 4.2 8.4-4.2" />
  </svg>
)

export const IconThermo = ({ size = 22, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M10 13.6V5.4a2 2 0 1 1 4 0v8.2a4.2 4.2 0 1 1-4 0Z" />
    <path d="M12 9.5v5.6" />
  </svg>
)

export const IconFactory = ({ size = 22, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M3.2 20.5h17.6V9.8l-5.5 3.2V9.8l-5.5 3.2V9.8L4.3 13V6.2H3.2v14.3Z" />
    <path d="M7.5 17h1.8M12 17h1.8M16.4 17h1.8" />
  </svg>
)

export const IconTruck = ({ size = 22, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M2.8 6.6h10.4v9.8H2.8zM13.2 10h3.6l3.4 3.2v3.2h-7z" />
    <circle cx="7" cy="18.2" r="1.8" />
    <circle cx="17" cy="18.2" r="1.8" />
  </svg>
)

export const IconCube = ({ size = 22, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M12 2.9 20.3 7v10L12 21.1 3.7 17V7L12 2.9Z" />
    <path d="M3.7 7 12 11.2 20.3 7M12 11.2v9.9" />
  </svg>
)

export const IconCheck = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="m5 12.6 4.4 4.4L19 7.4" />
  </svg>
)

export const IconSliders = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2.1" />
    <circle cx="10" cy="17" r="2.1" />
  </svg>
)
