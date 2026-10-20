import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/gsap.js'

/**
 * Faixa marquee contínua (GSAP). O texto repete até cobrir 2x a viewport e
 * desliza em loop infinito; pausa com prefers-reduced-motion.
 */
export default function Marquee({ text, tone = 'pink' }) {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track || reducedMotion()) return
    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 26,
      ease: 'none',
      repeat: -1
    })
    return () => tween.kill()
  }, [])

  const chunk = Array.from({ length: 4 }, (_, i) => (
    <span className="marqueechunk" key={i} aria-hidden={i > 0}>
      <span className="marqueeword">{text}</span>
      <span className="marqueedot" aria-hidden="true" />
    </span>
  ))

  return (
    <div className={`marqueeband marquee-${tone}`} aria-hidden="false">
      <div className="marqueetrack" ref={trackRef}>
        {chunk}
      </div>
    </div>
  )
}
