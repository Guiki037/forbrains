/**
 * Ferramentas dos efeitos de rolagem (vitrine "36 animações em JavaScript",
 * canal Não Codei), adaptadas da caixa de demonstração (.mini) para a janela
 * inteira do site.
 *
 * Nada aqui escreve estilo por conta própria: cada efeito recebe números de
 * 0 a 1 e decide o que fazer com eles.
 */

export const lerp = (a, b, t) => a + (b - a) * t

export const limitar = (v, min, max) => Math.max(min, Math.min(max, v))

/** Interpolação com entrada e saída suaves entre dois pontos do progresso. */
export const suave = (inicio, fim, x) => {
  const t = limitar((x - inicio) / (fim - inicio), 0, 1)
  return t * t * (3 - 2 * t)
}

export const movimentoReduzido = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Progresso de 0 a 1 de um elemento atravessando a área visível. */
export function progressoNaTela(el) {
  const r = el.getBoundingClientRect()
  const alt = window.innerHeight || 800
  return limitar((alt - r.top) / (alt + r.height), 0, 1)
}

/**
 * Progresso de 0 a 1 de uma seção alta com um palco "sticky" dentro:
 * 0 quando o topo da seção encosta no topo da janela, 1 quando o fundo
 * da seção encosta no fundo da janela. É o curso em que o palco fica preso.
 */
export function progressoFixado(secao) {
  const r = secao.getBoundingClientRect()
  const curso = r.height - (window.innerHeight || 800)
  return curso > 0 ? limitar(-r.top / curso, 0, 1) : 0
}

/**
 * Versão do aoRolar da vitrine para a janela: chama `passo()` no máximo uma
 * vez por quadro depois de cada rolagem ou redimensionamento, e só enquanto o
 * alvo estiver perto da tela (IntersectionObserver, como no `laco`).
 * Devolve a função que desliga tudo.
 */
export function aoRolar(alvo, passo, { margem = '20% 0px' } = {}) {
  let id = 0
  let visivel = false
  let respondeu = false

  const rodar = () => {
    id = 0
    passo()
  }

  const agendar = () => {
    if (!visivel || id) return
    id = requestAnimationFrame(rodar)
  }

  const obs = new IntersectionObserver(
    ([entrada]) => {
      respondeu = true
      visivel = entrada.isIntersecting
      // ao sair da tela, um último passo deixa o efeito no estado final certo
      if (visivel) agendar()
      else passo()
    },
    { rootMargin: margem, threshold: 0 }
  )
  obs.observe(alvo)

  /* se o observador não responder, começa assim mesmo */
  const espera = setTimeout(() => {
    if (!respondeu) {
      visivel = true
      agendar()
    }
  }, 1500)

  window.addEventListener('scroll', agendar, { passive: true })
  window.addEventListener('resize', agendar)
  passo()

  return () => {
    clearTimeout(espera)
    cancelAnimationFrame(id)
    obs.disconnect()
    window.removeEventListener('scroll', agendar)
    window.removeEventListener('resize', agendar)
  }
}

/**
 * Rola a janela na hora, mesmo com `scroll-behavior: smooth` no <html>
 * (usado para corrigir o foco do teclado sem animação, sem depender do valor
 * 'instant' do scrollTo).
 */
export function rolarAgora(y) {
  const raiz = document.documentElement
  const anterior = raiz.style.scrollBehavior
  raiz.style.scrollBehavior = 'auto'
  window.scrollTo(0, Math.round(y))
  raiz.style.scrollBehavior = anterior
}

/**
 * Observa uma media query e chama `ao(mudou)` agora e a cada mudança.
 * Devolve a função de limpeza.
 */
export function aoMudarMidia(query, ao) {
  const mq = window.matchMedia(query)
  const ouvir = () => ao(mq.matches)
  ouvir()
  mq.addEventListener('change', ouvir)
  return () => mq.removeEventListener('change', ouvir)
}
