import CtaButton from '../parts/CtaButton.jsx'
import { useCountUp, useStaggerReveal } from '../hooks/useGsapFx.jsx'
import { useLang } from '../i18n/LangContext.jsx'
import { ui } from '../i18n/ui.js'
import { realityStats } from '../data/content.js'

function BigStat({ stat }) {
  const numRef = useCountUp(stat.value, { duration: 1.8 })
  return (
    <div className="lp-stat" data-stagger>
      <dt className="lp-stat__label">{stat.label}</dt>
      <dd className="lp-stat__num">
        {stat.value < 0 ? '−' : ''}
        <span ref={numRef}>{Math.abs(stat.value)}</span>
        {stat.suffix}
      </dd>
      <dd className="lp-stat__text">{stat.text}</dd>
    </div>
  )
}

/** Seção "dor": os dados do mercado brasileiro, em página clara e calma. */
export default function Reality({ chapter }) {
  const { t } = useLang()
  const gridRef = useStaggerReveal('[data-stagger]', { y: 16 })

  return (
    <section className="lp-section lp-reality" id={chapter.id} aria-labelledby="reality-title">
      <div className="shell">
        <header className="lp-head lp-head--split">
          <h2 className="lp-title" id="reality-title">{t(chapter.title)}</h2>
          <p className="lp-guide">{t(chapter.guide)}</p>
        </header>

        <dl className="lp-reality__grid" ref={gridRef}>
          {realityStats.map((stat) => (
            <BigStat stat={stat} key={stat.label} />
          ))}
        </dl>

        <div className="lp-reality__foot">
          <p className="lp-source">{t(ui.reality.sources)}</p>
          <p className="lp-reality__question">{t(ui.reality.question)}</p>
          <CtaButton href="#contact">{t(ui.cta.proposal)}</CtaButton>
        </div>
      </div>
    </section>
  )
}
