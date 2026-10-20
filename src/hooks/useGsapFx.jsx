import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reducedMotion } from '../lib/gsap.js'

const formatarConta = (value, decimals) =>
  value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })

/** A tela de abertura cobre o hero; o contador só começa quando ela sai. */
function aoSairDoBoot(iniciar) {
  const boot = document.getElementById('boot')
  if (!boot || boot.classList.contains('is-done')) {
    iniciar()
    return () => {}
  }
  const obs = new MutationObserver(() => {
    if (!boot.isConnected || boot.classList.contains('is-done')) {
      obs.disconnect()
      iniciar()
    }
  })
  obs.observe(boot, { attributes: true, attributeFilter: ['class'] })
  return () => obs.disconnect()
}

/**
 * Contador animado: o texto do elemento sobe de 0 até `target` quando o
 * elemento entra na viewport. Em prefers-reduced-motion, mostra o valor final.
 */
export function useCountUp(target, { duration = 1.6, decimals = 0 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const finalText = formatarConta(Math.abs(target), decimals)
    if (reducedMotion()) {
      node.textContent = finalText
      return undefined
    }

    let tween
    const iniciar = () => {
      const visivel = node.getBoundingClientRect().top < window.innerHeight * 0.88
      if (visivel) node.textContent = formatarConta(0, decimals)
      const state = { value: 0 }
      tween = gsap.to(state, {
        value: Math.abs(target),
        duration,
        ease: 'power3.out',
        scrollTrigger: { trigger: node, start: 'top 88%', once: true },
        onUpdate: () => {
          node.textContent = formatarConta(state.value, decimals)
        }
      })
    }

    const pararBoot = aoSairDoBoot(iniciar)
    return () => {
      pararBoot()
      tween?.scrollTrigger?.kill()
      tween?.kill()
    }
  }, [target, duration, decimals])

  return ref
}

/**
 * Revelação por palavras para títulos: cada .wordline sobe de y 110% para 0
 * com stagger quando entra na viewport (ou imediatamente com `immediate`).
 */
export function useWordsReveal({ immediate = false, delay = 0 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const words = node.querySelectorAll('.wordline-inner')
    if (!words.length) return
    if (reducedMotion()) {
      gsap.set(words, { yPercent: 0, opacity: 1 })
      return
    }
    gsap.set(words, { yPercent: 112 })
    const vars = {
      yPercent: 0,
      duration: 1.05,
      ease: 'power4.out',
      stagger: 0.07,
      delay
    }
    let tween
    if (immediate) {
      tween = gsap.to(words, vars)
    } else {
      tween = gsap.to(words, {
        ...vars,
        scrollTrigger: { trigger: node, start: 'top 86%', once: true }
      })
    }
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [immediate, delay])

  return ref
}

/** Revelação simples com stagger para grupos de cartões/elementos. */
export function useStaggerReveal(selector = '[data-stagger]', { y = 36 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const items = node.querySelectorAll(selector)
    if (!items.length) return
    if (reducedMotion()) return
    gsap.set(items, { y })
    const tween = gsap.to(items, {
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.09,
      scrollTrigger: { trigger: node, start: 'top 82%', once: true }
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [selector, y])

  return ref
}

/** Quebra um texto em palavras animáveis (span.wordline > span.wordline-inner). */
export function splitWords(text) {
  return text.split(' ').map((word, index) => (
    <span className="wordline" key={`${word}-${index}`} aria-hidden="true">
      <span className="wordline-inner">{word}&nbsp;</span>
    </span>
  ))
}

/** Garante refresh do ScrollTrigger depois que imagens/fontes carregam. */
export function useScrollTriggerRefresh(deps = []) {
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('load', onLoad)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
