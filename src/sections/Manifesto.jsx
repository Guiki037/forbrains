import FillText from '../parts/FillText.jsx'
import AnelArte from '../parts/art/AnelArte.jsx'
import { useTextFill } from '../hooks/useTextFill.js'
import { useLang } from '../i18n/LangContext.jsx'

/**
 * Manifesto com o EFEITO 04 (texto que se preenche): a frase da marca e o
 * texto institucional acendem palavra por palavra conforme a leitura avança.
 * É a virada da página: depois da dor, a crença — e logo em seguida as soluções.
 * Ao fundo, o anel do logotipo se monta e gira devagar com a rolagem.
 */
export default function Manifesto({ studio }) {
  const { t } = useLang()
  const fillRef = useTextFill()

  return (
    <section className="lp-manifesto" id="manifesto" aria-labelledby="manifesto-title">
      <AnelArte className="lp-manifesto__anel" semente={14} />
      <div className="shell">
        <div className="lp-manifesto__inner fx-fill" ref={fillRef}>
          <h2 className="lp-manifesto__lead" id="manifesto-title">
            <FillText text={`${t(studio.manifesto)}.`} destaques={['pessoas', 'negócios']} />
          </h2>
          <p className="lp-manifesto__text">
            <FillText text={t(studio.intro)} />
          </p>
        </div>
      </div>
    </section>
  )
}
