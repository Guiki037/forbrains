import Arte from '../parts/art/Arte.jsx'
import { emblemaEtapa } from '../parts/art/emblemas.js'
import { useStackCards } from '../hooks/useStackCards.js'
import { useLang } from '../i18n/LangContext.jsx'
import { ui } from '../i18n/ui.js'
import { methodSteps } from '../data/content.js'

const TEMAS = ['claro', 'rosa', 'noite', 'vivo']

/**
 * Metodologia com o EFEITO 01 (cartões que empilham): cada etapa gruda no
 * topo e a seguinte sobe por cima — o processo vai se acumulando, do claro
 * (diagnóstico) ao rosa (acompanhamento). Cada cartão mostra a foto da
 * etapa ou, sem foto, o seu emblema de pontos, que se monta quando aparece.
 */
export default function Methodology({ chapter }) {
  const { t } = useLang()
  const listRef = useStackCards()
  const total = String(methodSteps.length).padStart(2, '0')

  return (
    <section className="lp-section lp-method" id={chapter.id} aria-labelledby="method-title">
      <div className="shell">
        <header className="lp-head lp-head--split">
          <h2 className="lp-title" id="method-title">{t(chapter.title)}</h2>
          <p className="lp-guide">{t(chapter.guide)}</p>
        </header>

        <ol className="fx-stack" ref={listRef}>
          {methodSteps.map((step, index) => (
            <li
              className={`fx-stack__folha lp-step lp-step--${index + 1}`}
              data-folha
              style={{ '--i': index }}
              key={step.no}
            >
              <div className="lp-step__text">
                <p className="lp-step__label">
                  {t(ui.method.step)} {step.no} <span aria-hidden="true">/ {total}</span>
                </p>
                <div>
                  <h3 className="lp-step__title">{step.title}</h3>
                  <p className="lp-step__body">{step.text}</p>
                </div>
                <span className="lp-step__no" aria-hidden="true">{step.no}</span>
              </div>
              {/* com foto (campo `foto` em content.js) a etapa mostra a foto;
                  sem foto, o emblema de pontos da marca */}
              <div className={`lp-step__arte${step.foto ? ' lp-step__arte--foto' : ''}`}>
                {step.foto ? (
                  <img src={step.foto} alt={step.alt || ''} width="1600" height="1200" loading="lazy" decoding="async" />
                ) : (
                  <Arte emblema={emblemaEtapa(step.no)} largura={480} altura={400} tema={TEMAS[index]} />
                )}
              </div>
              <span className="fx-stack__sombra" data-sombra aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
