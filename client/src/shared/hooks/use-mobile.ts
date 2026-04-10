import * as React from 'react'

const MOBILE_BREAKPOINT = 48

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 0.0625}rem)`,
    )
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT * 16)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT * 16)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}
