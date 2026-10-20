import { useCallback, useEffect, useRef, useState } from 'react'
import { aoMudarMidia, aoRolar, limitar, movimentoReduzido, progressoFixado, rolarAgora } from '../lib/scrollFx.js'

/**
 * EFEITO 02 · GALERIA HORIZONTAL
 * Você rola para baixo e o conteúdo anda para o lado. O palco fica preso
 * enquanto a fita percorre toda a largura.
 *
 * Adaptação da vitrine para a janela:
 * - a altura da seção é calculada: altura do palco + o quanto a fita sobra
 *   para a direita. Assim cada pixel rolado vira um pixel andado (1:1).
 * - foco por teclado: quando um cartão fora da vista recebe foco, a página
 *   rola até o ponto em que ele aparece (o palco usa overflow: clip, então o
 *   navegador não consegue deslocá-lo por conta própria).
 * - telas estreitas e movimento reduzido: nada fica preso; a fita vira um
 *   carrossel nativo de deslizar, com botões anterior/próximo.
 *
 * Marcação: seção (ref) > [data-palco] > [data-janela] > [data-fita] > [data-card].
 * Opcionais: [data-barra] (preenche com scaleX) e [data-contador].
 */
const MODO_FIXO = '(min-width: 861px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)'

export function useHorizontalGallery() {
  const ref = useRef(null)
  const [fixo, setFixo] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MODO_FIXO).matches
  )

  useEffect(() => {
    const secao = ref.current
    if (!secao) return undefined

    const palco = secao.querySelector('[data-palco]')
    const janela = secao.querySelector('[data-janela]')
    const fita = secao.querySelector('[data-fita]')
    const barra = secao.querySelector('[data-barra]')
    const contador = secao.querySelector('[data-contador]')
    const cards = Array.from(fita.querySelectorAll('[data-card]'))
    const total = cards.length

    let curso = 0
    let xAtual = 0
    let ultimo = -1
    let parar = null
    let ro = null

    // o contador conta só as soluções (data-max); o cartão final não entra
    const maximo = Number(contador?.dataset.max) || total
    const marcar = (indice) => {
      const valor = Math.min(indice + 1, maximo)
      if (valor === ultimo || !contador) return
      ultimo = valor
      contador.textContent = String(valor).padStart(2, '0')
    }

    const passoCard = () => (total > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1) || 1

    /* ---------- modo preso (desktop) ---------- */
    const medir = () => {
      curso = Math.max(0, fita.scrollWidth - janela.clientWidth)
      secao.style.height = `${Math.round(palco.offsetHeight + curso)}px`
    }

    const passo = () => {
      const p = progressoFixado(secao)
      xAtual = -p * curso
      fita.style.transform = `translate3d(${xAtual.toFixed(1)}px, 0, 0)`
      if (barra) barra.style.transform = `scaleX(${p.toFixed(4)})`
      marcar(limitar(Math.round(-xAtual / passoCard()), 0, total - 1))
    }

    /* o navegador faz o próprio "scroll into view" do foco logo depois deste
       evento; a correção roda no quadro seguinte e passa por cima dele */
    let quadroFoco = 0
    const aoFocar = (evento) => {
      const card = evento.target.closest('[data-card]')
      if (!card) return
      cancelAnimationFrame(quadroFoco)
      quadroFoco = requestAnimationFrame(() => {
        janela.scrollLeft = 0
        if (curso <= 0) return
        const margem = parseFloat(getComputedStyle(fita).paddingLeft) || 0
        const x = -progressoFixado(secao) * curso
        const esquerda = card.offsetLeft + x
        const direita = esquerda + card.offsetWidth
        const visivel = esquerda >= margem * 0.5 && direita <= janela.clientWidth - margem * 0.5
        const topo = secao.getBoundingClientRect().top + window.scrollY
        const viagem = secao.offsetHeight - window.innerHeight
        const preso = window.scrollY >= topo - 1 && window.scrollY <= topo + viagem + 1
        if (visivel && preso) return
        const alvo = limitar(card.offsetLeft - margem, 0, curso) / curso
        rolarAgora(topo + alvo * viagem)
      })
    }

    /* ---------- modo nativo (celular / movimento reduzido) ---------- */
    const aoDeslizar = () => {
      const sobra = janela.scrollWidth - janela.clientWidth
      const p = sobra > 1 ? limitar(janela.scrollLeft / sobra, 0, 1) : 0
      if (barra) barra.style.transform = `scaleX(${p.toFixed(4)})`
      marcar(limitar(Math.round(janela.scrollLeft / passoCard()), 0, total - 1))
    }

    /* imagens fora da vista horizontal: carregam quando a seção se aproxima */
    const carregar = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        fita.querySelectorAll('img[loading="lazy"]').forEach((img) => {
          img.loading = 'eager'
        })
        carregar.disconnect()
      },
      { rootMargin: '120% 0px' }
    )
    carregar.observe(secao)

    const desligar = () => {
      cancelAnimationFrame(quadroFoco)
      parar?.()
      parar = null
      ro?.disconnect()
      ro = null
      fita.removeEventListener('focusin', aoFocar)
      janela.removeEventListener('scroll', aoDeslizar)
      secao.style.removeProperty('height')
      fita.style.removeProperty('transform')
      if (barra) barra.style.removeProperty('transform')
      xAtual = 0
      ultimo = -1
    }

    const ligar = (preso) => {
      desligar()
      setFixo(preso)
      if (preso) {
        medir()
        ro = new ResizeObserver(() => {
          medir()
          passo()
        })
        ro.observe(fita)
        ro.observe(palco)
        fita.addEventListener('focusin', aoFocar)
        parar = aoRolar(secao, passo, { margem: '10% 0px' })
      } else {
        janela.addEventListener('scroll', aoDeslizar, { passive: true })
        aoDeslizar()
      }
    }

    const pararMidia = aoMudarMidia(MODO_FIXO, ligar)

    return () => {
      pararMidia()
      carregar.disconnect()
      desligar()
    }
  }, [])

  /* botões do carrossel nativo: um cartão por clique */
  const mover = useCallback((direcao) => {
    const secao = ref.current
    if (!secao) return
    const janela = secao.querySelector('[data-janela]')
    const cards = secao.querySelectorAll('[data-card]')
    const passo = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : janela.clientWidth * 0.8
    janela.scrollBy({ left: direcao * passo, behavior: movimentoReduzido() ? 'auto' : 'smooth' })
  }, [])

  return { ref, fixo, mover }
}
