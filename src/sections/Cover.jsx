import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LangContext.jsx'
import { ui } from '../i18n/ui.js'
import CtaButton from '../parts/CtaButton.jsx'
import Proof from './Proof.jsx'

const PALAVRAS = ['impacto', 'valor', 'prestígio']

/** A última palavra da promessa troca no lugar, sem esconder o restante da frase. */
function PalavraHero() {
  const [atual, setAtual] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = window.setInterval(() => {
      setAtual((indice) => (indice + 1) % PALAVRAS.length)
    }, 2800)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span className="lp-hero__slot">
      {PALAVRAS.map((palavra, indice) => (
        <span
          className={`lp-hero__word${indice === atual ? ' is-on' : ''}`}
          aria-hidden={indice !== atual}
          key={palavra}
        >
          {palavra}
        </span>
      ))}
    </span>
  )
}

/**
 * Hero: promessa sobre a foto da equipe, bem suave no fundo.
 */
export default function Cover({ studio }) {
  const { t } = useLang()

  return (
    <section className="lp-hero" id="top">
      <img
        className="lp-hero__bg"
        src="assets/images/hero-equipe.png"
        alt=""
        width="1200"
        height="800"
        decoding="async"
        {...{ fetchpriority: 'high' }}
      />
      <div className="shell lp-hero__grid">
        <div className="lp-hero__copy">
          <h1 className="lp-hero__title" aria-label="Desenvolva lideranças de alto impacto, valor e prestígio">
            <span className="lp-hero__leadin">Desenvolva lideranças de</span>
            <span className="lp-hero__line">
              alto <PalavraHero />
            </span>
          </h1>
          <p className="lp-hero__lead">{t(studio.about)}</p>
          <div className="lp-hero__actions">
            <CtaButton href="#contact">{t(ui.cta.proposal)}</CtaButton>
            <a className="lp-textlink lp-textlink--light" href="#solutions">
              {t(ui.cta.solutions)}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>

      <div className="shell">
        <Proof />
      </div>
    </section>
  )
}
