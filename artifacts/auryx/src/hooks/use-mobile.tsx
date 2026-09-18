import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

/** True at desktop widths. Initializes from matchMedia so mobile skips desktop-only images. */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches,
  )

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const onChange = () => setIsDesktop(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return isDesktop
}
