import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'

export function PlanCard({ children, featured = false }: { children: ReactNode; featured?: boolean }) {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const card = root.current
    const details = card?.querySelector('ul')
    if (!card || !details) return
    const media = gsap.matchMedia()
    media.add('(min-width: 801px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const items = details.querySelectorAll('li')
      gsap.set(details, { height: 0, opacity: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' })
      gsap.set(items, { y: 12, opacity: 0 })
      const expansion = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
        .to(card, { y: featured ? -36 : -12, duration: 0.35 }, 0)
        .to(card, { '--plan-rest': 0, duration: 0.35 }, 0)
        .to(details, { height: 'auto', opacity: 1, marginTop: 28, marginBottom: 25, duration: 0.45 }, 0)
        .to(items, { y: 0, opacity: 1, duration: 0.25, stagger: 0.035 }, 0.1)
      const open = () => { expansion.timeScale(1).play() }
      const close = () => {
        if (!card.matches(':hover') && !card.contains(document.activeElement)) expansion.timeScale(1.3).reverse()
      }
      card.addEventListener('pointerenter', open)
      card.addEventListener('pointerleave', close)
      card.addEventListener('focusin', open)
      card.addEventListener('focusout', close)
      if (card.matches(':hover') || card.contains(document.activeElement)) open()
      return () => {
        card.removeEventListener('pointerenter', open)
        card.removeEventListener('pointerleave', close)
        card.removeEventListener('focusin', open)
        card.removeEventListener('focusout', close)
      }
    })
    return () => media.revert()
  }, [featured])

  return <div className="plan-entry"><article ref={root} className={`plan-card${featured ? ' plan-card--featured' : ''}`}>{children}</article></div>
}
