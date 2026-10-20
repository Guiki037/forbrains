import { useEffect, useRef } from 'react'
import { aoMudarMidia, aoRolar, limitar, progressoNaTela } from '../lib/scrollFx.js'

/**
 * Motion ligado à rolagem: escreve --giro (0 a 1) no elemento conforme a
 * seção de referência atravessa a tela. O CSS decide o que girar ou mover.
 *   modo 'tela'  → 0 quando a seção entra por baixo, 1 quando sai por cima
 *   modo 'saida' → 0 com a seção no topo, 1 quando ela termina de sair
 * Com movimento reduzido, --giro fica fixo em 0.
 */
export function useGiro({ modo = 'tela' } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const secao = el.closest('section') || el
    let parar = null

    const passo = () => {
      let p
      if (modo === 'saida') {
        const r = secao.getBoundingClientRect()
        p = r.height > 0 ? limitar(-r.top / r.height, 0, 1) : 0
      } else {
        p = progressoNaTela(secao)
      }
      el.style.setProperty('--giro', p.toFixed(4))
    }

    const ligar = (reduzido) => {
      parar?.()
      parar = null
      el.style.removeProperty('--giro')
      if (!reduzido) parar = aoRolar(secao, passo, { margem: '0px' })
    }

    const pararMidia = aoMudarMidia('(prefers-reduced-motion: reduce)', ligar)
    return () => {
      pararMidia()
      parar?.()
    }
  }, [modo])

  return ref
}
