import { useCountUp } from '../hooks/useGsapFx.jsx'
import { useLang } from '../i18n/LangContext.jsx'
import { ui } from '../i18n/ui.js'
import { proofStats } from '../data/content.js'

function ProofStat({ stat }) {
  const numRef = useCountUp(stat.value, { duration: 1.9 })
  return (
    <div className="lp-tally__item">
      <dt className="lp-tally__label">{stat.label}</dt>
      <dd className="lp-tally__num">
        {stat.prefix}
        <span ref={numRef}>{stat.value.toLocaleString('pt-BR')}</span>
        {stat.suffix}
      </dd>
    </div>
  )
}

/**
 * Prova: os quatro números de credibilidade da Forbrains.
 * Pela skill (padrão "Trust & Authority + Conversion"), a credibilidade
 * aparece logo no primeiro bloco da página, colada à promessa do hero.
 */
export default function Proof() {
  const { t } = useLang()
  return (
    <div className="lp-tally">
      <h2 className="sronly">{t(ui.proof)}</h2>
      <dl className="lp-tally__list">
        {proofStats.map((stat) => (
          <ProofStat stat={stat} key={stat.label} />
        ))}
      </dl>
    </div>
  )
}
