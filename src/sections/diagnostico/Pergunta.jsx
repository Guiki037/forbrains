import { useEffect, useRef } from 'react'
import { escala } from '../../data/diagnostico.js'
import { ui } from '../../i18n/ui.js'

/**
 * Uma pergunta por vez, com escala de frequência.
 * Com toque ou clique, a escolha já avança sozinha; pelo teclado (setas),
 * a pessoa escolhe com calma e confirma em "Próxima" ou Enter.
 */
export default function Pergunta({ indice, total, pergunta, valor, onResponder, onAvancar, onVoltar, focoRef }) {
  const toque = useRef(false)
  const timer = useRef(0)
  const textos = ui.diagnostico

  useEffect(() => () => clearTimeout(timer.current), [])

  /* clique ou toque numa opção (mesmo na que já estava marcada) avança sozinho */
  const avancarSeToque = () => {
    if (!toque.current) return
    toque.current = false
    clearTimeout(timer.current)
    timer.current = setTimeout(onAvancar, 340)
  }

  const enviar = (evento) => {
    evento.preventDefault()
    if (valor !== undefined) onAvancar()
  }

  const ultima = indice === total - 1

  return (
    <form className="dx-card dx-pergunta" onSubmit={enviar}>
      <div className="dx-topo">
        <p className="dx-passo">{textos.passo(indice + 1, total)}</p>
        <ol className="dx-progresso" aria-hidden="true">
          {Array.from({ length: total }, (_, k) => (
            <li key={k} className={k < indice ? 'is-feito' : k === indice ? 'is-atual' : undefined} />
          ))}
        </ol>
      </div>

      <fieldset className="dx-campo">
        <legend className="dx-enunciado" ref={focoRef} tabIndex={-1}>
          {pergunta.texto}
        </legend>
        <div
          className="dx-opcoes"
          onPointerDown={() => {
            toque.current = true
          }}
          onPointerUp={() => {
            setTimeout(() => {
              toque.current = false
            }, 0)
          }}
        >
          {escala.map((opcao) => (
            <label key={opcao.valor} className={`dx-opcao${valor === opcao.valor ? ' is-marcada' : ''}`}>
              <input
                type="radio"
                name={`dx-${pergunta.id}`}
                value={opcao.valor}
                checked={valor === opcao.valor}
                onChange={() => onResponder(pergunta.id, opcao.valor)}
                onClick={avancarSeToque}
              />
              <span className="dx-opcao__nivel" aria-hidden="true">
                {[0, 1, 2, 3].map((n) => (
                  <i key={n} className={n < opcao.valor ? 'is-cheio' : undefined} />
                ))}
              </span>
              <span className="dx-opcao__rotulo">{opcao.rotulo}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="dx-nav">
        <button type="button" className="dx-link" onClick={onVoltar}>
          <span aria-hidden="true">←</span> {textos.voltar}
        </button>
        <button type="submit" className="ctapill dx-proxima" disabled={valor === undefined}>
          {ultima ? textos.verResultado : textos.proxima} <span className="ctaarrow" aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  )
}
