interface LogoProps {
  className?: string
  iconOnly?: boolean
}

export function Logo({ className = '', iconOnly = false }: LogoProps) {
  if (iconOnly) {
    return (
      <div className={`inline-flex ${className}`}>
        <img src="/Logo_Icon.svg" alt="brev.ly" className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <img src="/Logo.svg" alt="brev.ly" className="h-8" />
    </div>
  )
} 