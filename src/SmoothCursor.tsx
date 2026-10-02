import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function SmoothCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const point = dot.current
    const follower = ring.current
    if (!point || !follower) return

    const media = gsap.matchMedia()
    media.add('(min-width: 801px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const elements = [point, follower]
      gsap.set(elements, { xPercent: -50, yPercent: -50, autoAlpha: 0 })
      const dotX = gsap.quickSetter(point, 'x', 'px')
      const dotY = gsap.quickSetter(point, 'y', 'px')
      const ringX = gsap.quickTo(follower, 'x', { duration: 0.3, ease: 'power3.out' })
      const ringY = gsap.quickTo(follower, 'y', { duration: 0.3, ease: 'power3.out' })
      let visible = false
      let hovering = false
      let pressed = false

      const resizeRing = () => gsap.to(follower, {
        scale: pressed ? 0.75 : hovering ? 1.65 : 1,
        backgroundColor: hovering ? 'rgba(223,255,0,0.14)' : 'rgba(223,255,0,0)',
        duration: 0.2,
        ease: 'power3.out',
        overwrite: 'auto',
      })
      const hide = () => {
        visible = false
        pressed = false
        document.documentElement.classList.remove('has-smooth-cursor')
        gsap.set(elements, { autoAlpha: 0 })
      }
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return hide()
        const target = event.target instanceof Element ? event.target : null
        if (target?.closest('input, textarea, select, [contenteditable="true"], iframe')) return hide()
        const active = Boolean(target?.closest('a, button:not(:disabled), [role="button"]'))
        if (active !== hovering || !visible) {
          hovering = active
          resizeRing()
        }
        if (!visible) {
          // Start at the pointer so the first movement never flies in from a corner.
          ringX(event.clientX).progress(1)
          ringY(event.clientY).progress(1)
          gsap.set(elements, { autoAlpha: 1 })
          document.documentElement.classList.add('has-smooth-cursor')
          visible = true
        }
        dotX(event.clientX)
        dotY(event.clientY)
        ringX(event.clientX)
        ringY(event.clientY)
      }
      const down = () => { pressed = true; resizeRing() }
      const up = () => { pressed = false; resizeRing() }
      const onVisibility = () => { if (document.hidden) hide() }
      const onKey = (event: KeyboardEvent) => { if (event.key === 'Tab') hide() }

      window.addEventListener('pointermove', move, { passive: true })
      window.addEventListener('pointerdown', down, { passive: true })
      window.addEventListener('pointerup', up, { passive: true })
      window.addEventListener('pointercancel', hide)
      window.addEventListener('blur', hide)
      window.addEventListener('keydown', onKey)
      document.documentElement.addEventListener('pointerleave', hide)
      document.addEventListener('visibilitychange', onVisibility)

      return () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerdown', down)
        window.removeEventListener('pointerup', up)
        window.removeEventListener('pointercancel', hide)
        window.removeEventListener('blur', hide)
        window.removeEventListener('keydown', onKey)
        document.documentElement.removeEventListener('pointerleave', hide)
        document.removeEventListener('visibilitychange', onVisibility)
        document.documentElement.classList.remove('has-smooth-cursor')
        gsap.killTweensOf(elements)
      }
    })
    return () => media.revert()
  }, [])

  return <><div ref={dot} className="cursor cursor--dot" aria-hidden="true" /><div ref={ring} className="cursor cursor--ring" aria-hidden="true" /></>
}
