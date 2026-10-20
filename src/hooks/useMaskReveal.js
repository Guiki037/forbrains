import { useEffect, useRef } from 'react'
import { aoMudarMidia, aoRolar, limitar, progressoFixado, rolarAgora, suave } from '../lib/scrollFx.js'

/**
 * EFEITO 05 · MÁSCARA QUE REVELA
 * Um buraco redondo cresce no meio da cena e descobre a de baixo. Serve para
 * mostrar antes e depois sem trocar de página.
 *
 * Adaptação da vitrine para a janela:
 * - a cena "depois" fica por cima com clip-path: circle(); o raio cresce de 0
 *   até cobrir os cantos da tela. Visualmente é o buraco crescendo na cena
 *   "antes", e os cliques dentro do círculo já chegam à cena "depois".
 * - o raio é calculado em px a partir da diagonal do palco, para o círculo
 *   cobrir qualquer proporção de tela (no percentual da vitrine sobrava canto).
 * - ritmo: segura o "antes" no começo (leitura), abre o círculo no meio e
 *   segura o "depois" no fim. Os números contam junto com a abertura.
 * - a borda do círculo é um anel de pontos (SVG), eco do anel do logotipo.
 *
 * Marcação: seção (ref) > [data-palco] > [data-antes] + [data-depois];
 * opcionais [data-anel] (circle SVG), [data-barra] e [data-num][data-alvo].
 */
const ESTATICO = '(prefers-reduced-motion: reduce), (max-height: 520px)'
const ABRE = [0.14, 0.78]
const CONTA = [0.36, 0.84]

export function useMaskReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const secao = ref.current
    if (!secao) return undefined

    const palco = secao.querySelector('[data-palco]')
    const antes = secao.querySelector('[data-antes]')
    const depois = secao.querySelector('[data-depois]')
    const svg = secao.querySelector('[data-anel-svg]')
    const anel = secao.querySelector('[data-anel]')
    const barra = secao.querySelector('[data-barra]')
    const numeros = Array.from(secao.querySelectorAll('[data-num]'))
    const alvos = numeros.map((el) => Math.abs(Number(el.dataset.alvo) || 0))
    const finais = numeros.map((el) => el.textContent)

    let largura = 0
    let altura = 0
    let raioMax = 0
    let parar = null
    let ro = null

    const medir = () => {
      largura = palco.clientWidth
      altura = palco.clientHeight
      raioMax = Math.hypot(largura / 2, altura / 2) + 6
      if (svg) svg.setAttribute('viewBox', `0 0 ${largura} ${altura}`)
      if (anel) {
        anel.setAttribute('cx', (largura / 2).toFixed(1))
        anel.setAttribute('cy', (altura / 2).toFixed(1))
      }
    }

    const passo = () => {
      const p = progressoFixado(secao)
      const t = suave(ABRE[0], ABRE[1], p)
      const raio = t * raioMax

      // as duas cenas têm a mesma grade: o círculo troca cada desafio pelo
      // resultado no mesmo lugar, por isso nenhuma das duas se move
      depois.style.clipPath = t >= 1 ? 'none' : `circle(${raio.toFixed(1)}px at 50% 50%)`
      antes.style.opacity = (1 - t * 0.35).toFixed(3)

      if (anel) {
        anel.setAttribute('r', Math.max(0, raio - 1).toFixed(1))
        anel.style.strokeDashoffset = (-p * 240).toFixed(1)
        const visivel = limitar(t * 10, 0, 1) * (1 - suave(0.86, 1, t))
        anel.style.opacity = visivel.toFixed(3)
      }
      if (barra) barra.style.transform = `scaleX(${t.toFixed(4)})`

      const n = suave(CONTA[0], CONTA[1], p)
      numeros.forEach((el, i) => {
        const valor = String(Math.round(alvos[i] * n))
        if (el.textContent !== valor) el.textContent = valor
      })
    }

    /* foco por teclado no botão da cena "depois": a página vai até o fim do
       curso (círculo todo aberto), para o foco nunca ficar atrás da máscara.
       Roda no quadro seguinte, depois do "scroll into view" do navegador. */
    let quadroFoco = 0
    const aoFocar = () => {
      cancelAnimationFrame(quadroFoco)
      quadroFoco = requestAnimationFrame(() => {
        const topo = secao.getBoundingClientRect().top + window.scrollY
        const fim = topo + secao.offsetHeight - window.innerHeight
        if (Math.abs(window.scrollY - fim) < 2) return
        rolarAgora(fim)
      })
    }

    const limpar = () => {
      cancelAnimationFrame(quadroFoco)
      depois.removeEventListener('focusin', aoFocar)
      depois.style.removeProperty('clip-path')
      antes.style.removeProperty('opacity')
      anel?.style.removeProperty('opacity')
      barra?.style.removeProperty('transform')
      numeros.forEach((el, i) => {
        el.textContent = finais[i]
      })
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
      ro.observe(palco)
      depois.addEventListener('focusin', aoFocar)
      parar = aoRolar(secao, passo, { margem: '10% 0px' })
    }

    // mesma condição do CSS: com movimento reduzido ou tela muito baixa, nada fica preso
    const pararMidia = aoMudarMidia(ESTATICO, ligar)

    return () => {
      pararMidia()
      parar?.()
      ro?.disconnect()
      limpar()
    }
  }, [])

  return ref
}
