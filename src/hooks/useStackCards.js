import { useEffect, useRef } from 'react'
import { aoMudarMidia, aoRolar, limitar } from '../lib/scrollFx.js'

/**
 * EFEITO 01 · CARTÕES QUE EMPILHAM
 * Cada cartão gruda no topo e o seguinte sobe por cima dele. Os de baixo
 * encolhem e escurecem, o que cria a sensação de pilha.
 *
 * Adaptação da vitrine para a janela:
 * - em vez de medir a posição natural com o sticky desligado, cada cartão
 *   olha para o PRÓXIMO: quanto falta para ele chegar ao lugar onde gruda.
 *   Isso dispensa medir de novo quando a página muda de altura.
 * - cada cartão gruda 18px abaixo do anterior (CSS), então a borda dos que
 *   ficaram embaixo continua aparecendo, como numa pilha de papel.
 * - o escurecimento usa a opacidade de uma camada (mais barato que filter).
 *
 * Marcação esperada: lista com [data-folha] e, dentro de cada folha, um
 * [data-sombra]. Com movimento reduzido nada é escrito e o CSS mostra a lista.
 */
const ENCOLHE = 0.05 // por cartão empilhado em cima
const ESCURECE = 0.2 // por cartão empilhado em cima
const ESCURO_MAX = 0.5

export function useStackCards() {
  const ref = useRef(null)

  useEffect(() => {
    const lista = ref.current
    if (!lista) return undefined

    const folhas = Array.from(lista.querySelectorAll('[data-folha]'))
    const sombras = folhas.map((folha) => folha.querySelector('[data-sombra]'))
    let topos = []
    let parar = null
    let ro = null

    const limpar = () => {
      folhas.forEach((folha, i) => {
        folha.style.removeProperty('transform')
        if (sombras[i]) sombras[i].style.removeProperty('opacity')
      })
      lista.classList.remove('is-solta')
    }

    /* onde cada cartão gruda (o "top" do sticky, já resolvido em px) */
    const medir = () => {
      lista.classList.remove('is-solta')
      topos = folhas.map((folha) => parseFloat(getComputedStyle(folha).top) || 0)
      // se algum cartão não couber na janela, a pilha vira lista comum:
      // um cartão preso maior que a tela esconderia o próprio final
      const alt = window.innerHeight
      const naoCabe = folhas.some((folha, i) => folha.offsetHeight > alt - topos[i] - 12)
      lista.classList.toggle('is-solta', naoCabe)
    }

    const passo = () => {
      if (lista.classList.contains('is-solta')) {
        folhas.forEach((folha, i) => {
          folha.style.transform = ''
          if (sombras[i]) sombras[i].style.opacity = '0'
        })
        return
      }
      // quanto o cartão i+1 já cobriu o cartão i (0 a 1)
      const cobertura = folhas.map((folha, i) => {
        const prox = folhas[i + 1]
        if (!prox) return 0
        const falta = prox.getBoundingClientRect().top - topos[i + 1]
        const vao = topos[i] + folha.offsetHeight - topos[i + 1]
        return vao > 0 ? 1 - limitar(falta / vao, 0, 1) : 0
      })
      // profundidade = quantos cartões (fracionados) já estão por cima
      let acumulado = 0
      for (let i = folhas.length - 1; i >= 0; i -= 1) {
        acumulado += cobertura[i]
        const fundo = i === folhas.length - 1 ? 0 : acumulado
        folhas[i].style.transform = fundo > 0 ? `scale(${(1 - fundo * ENCOLHE).toFixed(4)})` : ''
        if (sombras[i]) {
          sombras[i].style.opacity = Math.min(ESCURO_MAX, fundo * ESCURECE).toFixed(3)
        }
      }
    }

    const ligar = (reduzido) => {
      parar?.()
      parar = null
      ro?.disconnect()
      ro = null
      limpar()
      if (reduzido) return
      medir()
      ro = new ResizeObserver(() => {
        medir()
        passo()
      })
      folhas.forEach((folha) => ro.observe(folha))
      parar = aoRolar(lista, passo, { margem: '10% 0px' })
    }

    const pararMidia = aoMudarMidia('(prefers-reduced-motion: reduce)', ligar)
    // a altura da janela decide se a pilha cabe; só importa com o efeito ligado
    const aoRedimensionar = () => {
      if (parar) medir()
    }
    window.addEventListener('resize', aoRedimensionar)

    return () => {
      pararMidia()
      window.removeEventListener('resize', aoRedimensionar)
      parar?.()
      ro?.disconnect()
      limpar()
    }
  }, [])

  return ref
}
