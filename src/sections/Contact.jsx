import { useCallback, useState } from 'react'
import Diagnostico from './diagnostico/Diagnostico.jsx'
import { useLang } from '../i18n/LangContext.jsx'
import { ui } from '../i18n/ui.js'

/**
 * Contato com a inteligência de captação: em vez de um formulário comum,
 * o diagnóstico de liderança. Quando o painel de resultado aparece, ele
 * ganha a largura toda da seção. No celular o teste vem logo depois do
 * título, antes dos contatos diretos.
 */
export default function Contact({ studio, chapter }) {
  const { t } = useLang()
  const [comResultado, setComResultado] = useState(false)
  const aoResultado = useCallback((valor) => setComResultado(valor), [])

  const lines = [
    ['email', t(ui.contact.email), studio.email, `mailto:${studio.email}`],
    ['phone', t(ui.contact.phone), studio.phone, 'tel:+551199999999'],
    ['studio', t(ui.contact.studio), studio.address, null]
  ]

  return (
    <section
      className={`lp-section lp-contact${comResultado ? ' is-resultado' : ''}`}
      id={chapter.id}
      aria-labelledby="contact-title"
    >
      <div className="shell lp-contact__grid">
        <div className="lp-contact__intro">
          <h2 className="lp-title lp-title--light" id="contact-title">{t(chapter.title)}</h2>
          <p className="lp-guide lp-guide--light">{t(chapter.guide)}</p>
        </div>

        <div className="lp-contact__diag">
          <Diagnostico studio={studio} onResultado={aoResultado} />
        </div>

        <dl className="lp-contact__list">
          {lines.map(([key, label, value, href]) => (
            <div className="lp-contact__line" key={key}>
              <dt>{label}</dt>
              <dd>{href ? <a href={href}>{value}</a> : value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
