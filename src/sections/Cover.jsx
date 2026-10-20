import { useLang } from '../i18n/LangContext.jsx'
import { ui } from '../i18n/ui.js'
import CtaButton from '../parts/CtaButton.jsx'
import HeroArte from '../parts/art/HeroArte.jsx'
import Proof from './Proof.jsx'

/**
 * Hero: promessa + credibilidade no mesmo bloco.
 * À direita, o anel do logotipo se monta a partir de pontos soltos, com a
 * rede de pessoas dentro dele (motion de entrada + giro na rolagem).
 */
export default function Cover({ studio }) {
  const { t } = useLang()

  return (
    <section className="lp-hero" id="top">
      <div className="shell lp-hero__grid">
        <div className="lp-hero__copy">
          <h1 className="lp-hero__title">{t(studio.positioning)}</h1>
          <p className="lp-hero__lead">{t(studio.about)}</p>
          <div className="lp-hero__actions">
            <CtaButton href="#contact">{t(ui.cta.proposal)}</CtaButton>
            <a className="lp-textlink lp-textlink--light" href="#solutions">
              {t(ui.cta.solutions)}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="lp-hero__media">
          <HeroArte />
        </div>
      </div>

      <div className="shell">
        <Proof />
      </div>
    </section>
  )
}
