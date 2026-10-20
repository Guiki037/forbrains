import { useEffect, useRef } from 'react'
import { aoMudarMidia, aoRolar, limitar } from '../lib/scrollFx.js'

/**
 * EFEITO 04 · TEXTO QUE SE PREENCHE
 * As palavras ganham cor conforme a rolagem passa por elas, com uma zona de
 * transição suave (3 palavras de degradê) em vez de acender de uma vez.
 *
 * Adaptação da vitrine para a janela:
 * - o bloco NÃO fica preso (a skill limita a página a duas seções presas):
 *   o preenchimento começa quando o topo do texto chega a 82% da altura da
 *   tela e termina quando o fim do texto passa de 48%. Na prática a palavra
 *   que acende está sempre na metade de baixo da tela, onde o olho lê.
 * - o JS só escreve --d (0 a 1) em cada palavra; a cor fica no CSS, então a
 *   palavra de destaque pode acender em rosa e as outras em branco.
 *
 * Marcação: bloco (ref) com [data-palavra] em ordem de leitura.
 */
const INICIO = 0.82
const FIM = 0.48
const DEGRADE = 3 // palavras na zona de transição
const MARGEM = 3 // palavras de folga antes e depois

export function useTextFill() {
  const ref = useRef(null)

  useEffect(() => {
    const bloco = ref.current
    if (!bloco) return undefined

    const palavras = Array.from(bloco.querySelectorAll('[data-palavra]'))
    const ultimo = new Array(palavras.length).fill(-1)
    let parar = null

    const escrever = (i, valor) => {
      if (ultimo[i] === valor) return
      ultimo[i] = valor
      palavras[i].style.setProperty('--d', (valor / 100).toFixed(2))
    }

    const passo = () => {
      const r = bloco.getBoundingClientRect()
      const alt = window.innerHeight || 800
      const percurso = r.height + alt * (INICIO - FIM)
      const p = percurso > 0 ? limitar((alt * INICIO - r.top) / percurso, 0, 1) : 1
      const cursor = p * (palavras.length + MARGEM * 2) - MARGEM
      palavras.forEach((_, i) => {
        const d = limitar((cursor - i) / DEGRADE, 0, 1)
        escrever(i, Math.round(d * 100))
      })
    }

    const ligar = (reduzido) => {
      parar?.()
      parar = null
      if (reduzido) {
        palavras.forEach((_, i) => escrever(i, 100))
        return
      }
      parar = aoRolar(bloco, passo, { margem: '0px' })
    }

    const pararMidia = aoMudarMidia('(prefers-reduced-motion: reduce)', ligar)

    return () => {
      pararMidia()
      parar?.()
    }
  }, [])

  return ref
}
