import { useLang } from '../i18n/LangContext.jsx'

export default function SiteFooter({ studio }) {
  const { t } = useLang()
  return (
    <footer className="sitefooter">
      <div className="shell lp-foot">
        <div className="lp-foot__brand">
          <img
            className="lp-logo"
            src="assets/images/logo-forbrains.png"
            alt={`Forbrains ${t(studio.nameSuffix)}`}
            width="522"
            height="773"
            loading="lazy"
            decoding="async"
          />
          <p className="lp-foot__line">
            Pessoas no <span>centro.</span>
          </p>
        </div>
        <div className="lp-foot__side">
          <div className="footcontact">
            <a href={`mailto:${studio.email}`}>{studio.email}</a>
            <a href="tel:+551199999999">{studio.phone}</a>
            <span>{studio.address}</span>
          </div>
          <p className="footcopy">Forbrains People Lab copyright 2025. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
