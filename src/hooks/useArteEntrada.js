import { useLayoutEffect, useRef } from 'react'
import { movimentoReduzido } from '../lib/scrollFx.js'

/**
 * Motion de entrada dos desenhos de pontos: quando o desenho entra na tela,
 * cada ponto sai do estado de partida (espalhado, pequeno, transparente) e
 * chega ao lugar, em grupos. Acontece uma vez só.
 *
 * Sem JS ou com movimento reduzido, o desenho já aparece pronto (a classe
 * is-preparado é que esconde os pontos, e ela só entra quando há animação).
 */
export function useArteEntrada({ limiar = 0.2 } = {}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || movimentoReduzido() || typeof IntersectionObserver === 'undefined') return undefined

    el.classList.add('is-preparado')
    let quadro = 0
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        obs.disconnect()
        // um quadro de folga garante que o estado de partida já foi pintado
        quadro = requestAnimationFrame(() => {
          quadro = requestAnimationFrame(() => el.classList.add('is-visivel'))
        })
      },
      { threshold: limiar }
    )
    obs.observe(el)

    return () => {
      obs.disconnect()
      cancelAnimationFrame(quadro)
      el.classList.remove('is-preparado', 'is-visivel')
    }
  }, [limiar])

  return ref
}
