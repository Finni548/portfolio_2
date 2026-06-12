'use client'

import {useEffect, useRef} from 'react'

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let gx = mx
    let gy = my
    let raf = 0

    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    window.addEventListener('pointermove', onMove, {passive: true})

    const tick = () => {
      gx += (mx - gx) * 0.14
      gy += (my - gy) * 0.14
      el.style.left = gx + 'px'
      el.style.top = gy + 'px'
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div className="cursor-glow" ref={ref} aria-hidden="true" />
}
