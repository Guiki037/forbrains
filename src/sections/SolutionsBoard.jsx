import CtaButton from '../parts/CtaButton.jsx'
import Arte from '../parts/art/Arte.jsx'
import { emblemaSolucao } from '../parts/art/emblemas.js'
import { projects, typeLabels } from '../data/projects.js'
import { useHorizontalGallery } from '../hooks/useHorizontalGallery.js'
import { useLang } from '../i18n/LangContext.jsx'
import { ui } from '../i18n/ui.js'

const pad = (n) => String(n).padStart(2, '0')

/**
 * Soluções com o EFEITO 02 (galeria horizontal): o palco fica preso e a
 * rolagem vertical anda a fita de cartões para o lado. Os cartões são só
 * informativos (não levam a outra página); no fim da fita, o cartão de
 * proposta sob medida. No celular e com movimento reduzido vira um
 * carrossel nativo de deslizar, com botões.
 */
export default function SolutionsBoard({ chapter, portfolio }) {
  const { t } = useLang()
  const { ref, fixo, mover } = useHorizontalGallery()
  const total = projects.length

  return (
    <section
      className={`lp-solutions fx-hgallery${fixo ? ' is-fixo' : ' is-nativo'}`}
      id={chapter.id}
      ref={ref}
      aria-labelledby="solutions-title"
    >
      <a className="lp-skipinline" href="#method">{t(ui.gallery.skip)}</a>

      <div className="fx-hgallery__palco" data-palco>
        <header className="shell fx-hgallery__head">
          <h2 className="lp-title lp-title--light" id="solutions-title">{t(chapter.title)}</h2>
          <div className="fx-hgallery__aside">
            <p className="lp-guide lp-guide--light">{t(chapter.guide)}</p>
            <p className="fx-hgallery__count" aria-hidden="true">
              <span data-contador data-max={total}>01</span>
              <span className="fx-hgallery__total">{t(ui.gallery.of)(pad(total))}</span>
            </p>
          </div>
        </header>

        <div className="fx-hgallery__janela" data-janela id={portfolio.id}>
          <ul className="fx-hgallery__fita" data-fita>
            {projects.map((project, index) => (
              <li className="fx-hgallery__item" data-card key={project.id}>
                <article className="lp-solcard" aria-labelledby={`sol-${project.id}`}>
                  <div className="lp-solcard__arte">
                    <Arte emblema={emblemaSolucao(project.id)} largura={320} altura={240} />
                    <span className="lp-solcard__type">{t(typeLabels[project.type])}</span>
                  </div>
                  <div className="lp-solcard__body">
                    <span className="lp-solcard__index" aria-hidden="true">{pad(index + 1)}</span>
                    <h3 className="lp-solcard__name" id={`sol-${project.id}`}>{t(project.name)}</h3>
                    <p className="lp-solcard__line">{t(project.oneLine)}</p>
                  </div>
                </article>
              </li>
            ))}
            <li className="fx-hgallery__item" data-card>
              <div className="lp-solcard lp-solcard--custom">
                <p className="lp-solcard__custom">{t(portfolio.guide)}</p>
                <CtaButton href="#contact" tone="light">{t(ui.cta.proposal)}</CtaButton>
              </div>
            </li>
          </ul>
        </div>

        <div className="shell fx-hgallery__foot">
          <div className="fx-hgallery__rail" aria-hidden="true">
            <span className="fx-hgallery__fill" data-barra />
          </div>
          {fixo ? (
            <p className="fx-hgallery__hint">
              {t(ui.gallery.hint)} <span aria-hidden="true">↓</span>
            </p>
          ) : (
            <div className="fx-hgallery__buttons">
              <span className="fx-hgallery__hint">{t(ui.gallery.swipe)}</span>
              <button type="button" className="lp-roundbtn" onClick={() => mover(-1)} aria-label={t(ui.gallery.prev)}>
                <span aria-hidden="true">←</span>
              </button>
              <button type="button" className="lp-roundbtn" onClick={() => mover(1)} aria-label={t(ui.gallery.next)}>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
