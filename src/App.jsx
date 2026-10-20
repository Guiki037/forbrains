import { useEffect, useState } from 'react'
import SiteHead, { NAV } from './sections/SiteHead.jsx'
import Cover from './sections/Cover.jsx'
import Reality from './sections/Reality.jsx'
import Notes from './sections/Notes.jsx'
import SolutionsBoard from './sections/SolutionsBoard.jsx'
import Manifesto from './sections/Manifesto.jsx'
import Methodology from './sections/Methodology.jsx'
import Results from './sections/Results.jsx'
import Contact from './sections/Contact.jsx'
import SiteFooter from './sections/SiteFooter.jsx'
import { useAnchor } from './hooks/useAnchor.js'
import { useScrollTriggerRefresh } from './hooks/useGsapFx.jsx'
import { studio, chapters } from './data/studio.js'

const chapterOf = (id) => chapters.find((item) => item.id === id)

export default function App() {
  const [compact, setCompact] = useState(false)
  const [active, setActive] = useState('')
  const anchor = useAnchor()

  useScrollTriggerRefresh([])

  useEffect(() => {
    const node = document.getElementById('top')
    if (!node) return undefined
    const io = new IntersectionObserver(
      ([entry]) => setCompact(!entry.isIntersecting),
      { rootMargin: '-72px 0px -55% 0px', threshold: 0 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!anchor) return undefined
    const target = document.getElementById(anchor)
    if (!target) return undefined
    const id = requestAnimationFrame(() => target.scrollIntoView({ behavior: 'auto', block: 'start' }))
    return () => cancelAnimationFrame(id)
  }, [anchor])

  /* item atual do menu: a seção do menu que está no meio da tela.
     Só as seções do menu entram (a janela da galeria, menor, não "rouba" o
     destaque de Soluções); no manifesto, que não está no menu, fica o anterior;
     de volta ao topo, nenhum.
     Medido na rolagem (uma vez por quadro): um observador de interseção só
     avisa quando a seção entra ou sai da faixa do meio, e as seções presas
     (galeria, antes/depois) passam muito tempo lá dentro sem novo aviso. */
  useEffect(() => {
    const sections = NAV.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return undefined
    let quadro = 0
    const medir = () => {
      quadro = 0
      const meio = window.innerHeight / 2
      const atual = sections.find((section) => {
        const caixa = section.getBoundingClientRect()
        return caixa.top <= meio && caixa.bottom > meio
      })
      if (atual) setActive(atual.id)
      else if (sections[0].getBoundingClientRect().top > meio) setActive('')
    }
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(medir)
    }
    medir()
    window.addEventListener('scroll', agendar, { passive: true })
    window.addEventListener('resize', agendar)
    return () => {
      cancelAnimationFrame(quadro)
      window.removeEventListener('scroll', agendar)
      window.removeEventListener('resize', agendar)
    }
  }, [])

  return (
    <>
      <a className="lp-skip" href="#reality">Ir para o conteúdo</a>
      <SiteHead compact={compact} active={active} />

      <Cover studio={studio} />

      <main>
        <Reality chapter={chapterOf('reality')} />
        <Notes chapter={chapterOf('challenges')} />
        <Manifesto studio={studio} />
        <SolutionsBoard chapter={chapterOf('solutions')} portfolio={chapterOf('portfolio')} />
        <Methodology chapter={chapterOf('method')} />
        <Results chapter={chapterOf('results')} challenges={chapterOf('challenges')} />
        <Contact chapter={chapterOf('contact')} studio={studio} />
      </main>

      <SiteFooter studio={studio} />
    </>
  )
}
