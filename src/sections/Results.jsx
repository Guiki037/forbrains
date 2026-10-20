import CtaButton from '../parts/CtaButton.jsx'
import { useMaskReveal } from '../hooks/useMaskReveal.js'
import { useLang } from '../i18n/LangContext.jsx'
import { ui } from '../i18n/ui.js'
import { notes } from '../data/notes.js'
import { beforeIds, resultStats, resultsQuestion } from '../data/content.js'

const sinal = (stat) => (stat.value < 0 ? '−' : stat.prefix)

/**
 * Resultados com o EFEITO 05 (máscara que revela): antes e depois na mesma
 * tela. A cena "antes" (neutra, sem cor) mostra quatro desafios; o círculo
 * cresce do centro e revela a cena "depois" (rosa) com os quatro resultados,
 * cada um no mesmo lugar do desafio que ele responde.
 */
export default function Results({ chapter, challenges }) {
  const { t } = useLang()
  const ref = useMaskReveal()
  const antes = beforeIds.map((id) => notes.find((note) => note.id === id)).filter(Boolean)

  return (
    <section className="lp-results fx-mask" id={chapter.id} ref={ref} aria-labelledby="results-title">
      <div className="fx-mask__palco" data-palco>
        <div className="fx-mask__cena fx-mask__antes" data-antes>
          <div className="shell fx-mask__inner">
            <p className="fx-mask__title">{t(challenges.title)}</p>
            <p className="fx-mask__sub">{t(ui.reality.question)}</p>
            <ul className="fx-mask__grid">
              {antes.map((note) => (
                <li className="fx-mask__tile" key={note.id}>
                  <span className="fx-mask__tilelabel">{t(note.title)}</span>
                  <span className="fx-mask__tiletext">{t(note.excerpt)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="fx-mask__cena fx-mask__depois" data-depois>
          <div className="shell fx-mask__inner">
            <h2 className="fx-mask__title" id="results-title">{t(chapter.title)}</h2>
            <p className="fx-mask__sub">{t(chapter.guide)}</p>
            <dl className="fx-mask__grid">
              {resultStats.map((stat) => (
                <div className="fx-mask__tile" key={stat.label}>
                  <dt className="fx-mask__tilelabel">{stat.label}</dt>
                  <dd className="fx-mask__num">
                    <span aria-hidden="true">
                      {sinal(stat)}
                      <span data-num data-alvo={stat.value}>{Math.abs(stat.value)}</span>
                      {stat.suffix}
                    </span>
                    <span className="sronly">{`${sinal(stat)}${Math.abs(stat.value)}${stat.suffix}`}</span>
                  </dd>
                  <dd className="fx-mask__tiletext">{stat.text}</dd>
                </div>
              ))}
            </dl>
            <div className="fx-mask__foot">
              <p className="fx-mask__question">{t(resultsQuestion)}</p>
              <CtaButton href="#contact" tone="light">{t(ui.cta.proposalNow)}</CtaButton>
            </div>
          </div>
        </div>

        <svg className="fx-mask__anel" data-anel-svg aria-hidden="true" focusable="false">
          <circle data-anel cx="0" cy="0" r="0" />
        </svg>

        <div className="fx-mask__passos" aria-hidden="true">
          <span>{t(ui.results.before)}</span>
          <span className="fx-mask__trilho">
            <span className="fx-mask__barra" data-barra />
          </span>
          <span>{t(ui.results.after)}</span>
        </div>
      </div>
    </section>
  )
}
