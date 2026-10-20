import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n/LangContext.jsx'
import { ui } from '../i18n/ui.js'

export const NAV = ['reality', 'challenges', 'solutions', 'method', 'results', 'contact']

export default function SiteHead({ compact, active }) {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef(null)

  /* ainda sobre o hero, mas já rolado: ganha um fundo azul translúcido
     para o menu não ficar por cima das fotos sem contraste */
  useEffect(() => {
    let frame = 0
    const read = () => {
      frame = 0
      setScrolled(window.scrollY > 24)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  /* menu do celular: fecha com Esc e ao voltar para o desktop */
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const wide = window.matchMedia('(min-width: 861px)')
    const onWide = () => wide.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    wide.addEventListener('change', onWide)
    return () => {
      window.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', onWide)
    }
  }, [open])

  const solid = compact || open
  const close = () => setOpen(false)

  return (
    <header
      className={`sitehead${solid ? ' compact' : ' on-hero'}${scrolled ? ' is-scrolled' : ''}${open ? ' menu-open' : ''}`}
    >
      <div className="shell siteheadinner">
        <a className="siteheadname" href="#top" aria-label={t(ui.head.home)} onClick={close}>
          <span className="headname">
            Forbrains<span className="headdot" aria-hidden="true" />
          </span>
        </a>

        <nav className="siteheadnav" id="sitenav" aria-label={t(ui.head.nav)}>
          {NAV.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'current' : undefined}
              aria-current={active === id ? 'true' : undefined}
              onClick={close}
            >
              {t(ui.nav[id])}
            </a>
          ))}
        </nav>

        <div className="siteheadside">
          <a className="headcta" href="#contact" onClick={close}>
            {t(ui.cta.proposal)}
          </a>
          <button
            type="button"
            className="navtoggle"
            ref={toggleRef}
            aria-expanded={open}
            aria-controls="sitenav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="navtoggle-bars" aria-hidden="true" />
            <span className="sronly">{open ? t(ui.nav.closeMenu) : t(ui.nav.menu)}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
