import { useRef, useState } from 'react'
import { ui } from '../../i18n/ui.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const digitos = (texto) => texto.replace(/\D/g, '')

function validar(dados) {
  const t = ui.diagnostico.erros
  const erros = {}
  if (dados.nome.trim().length < 2) erros.nome = dados.tipo === 'pj' ? t.empresa : t.nome
  const temWhats = dados.whatsapp.trim() !== ''
  const temEmail = dados.email.trim() !== ''
  const tamanho = digitos(dados.whatsapp).length
  if (temWhats && (tamanho < 10 || tamanho > 13)) erros.whatsapp = t.whatsapp
  if (temEmail && !EMAIL.test(dados.email.trim())) erros.email = t.email
  if (!temWhats && !temEmail) erros.whatsapp = t.contato
  return erros
}

function Cadeado() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Cadastro que libera o painel: pessoa física ou empresa, nome e um contato
 * (WhatsApp ou e-mail). Só o necessário para entregar o resultado.
 * Erros aparecem no campo (ao sair dele e ao enviar); com mais de um erro,
 * um resumo com links recebe o foco.
 */
export default function Cadastro({ inicial, enviando, resultado, onLiberar, onVoltar, focoRef }) {
  const textos = ui.diagnostico
  const [dados, setDados] = useState(inicial)
  const [erros, setErros] = useState({})
  const [tocados, setTocados] = useState({})
  const [mostrarResumo, setMostrarResumo] = useState(false)
  const resumoRef = useRef(null)
  const formRef = useRef(null)

  const mudar = (campo) => (evento) => {
    const valor = evento.target.value
    setDados((anteriores) => ({ ...anteriores, [campo]: valor }))
    if (erros[campo] || (campo === 'email' && erros.whatsapp === textos.erros.contato)) {
      const proximos = validar({ ...dados, [campo]: valor })
      setErros((anteriores) => {
        const limpos = { ...anteriores }
        ;['nome', 'whatsapp', 'email'].forEach((c) => {
          if (!proximos[c]) delete limpos[c]
        })
        return limpos
      })
    }
  }

  const sair = (campo) => () => {
    setTocados((anteriores) => ({ ...anteriores, [campo]: true }))
    const todos = validar(dados)
    setErros((anteriores) => {
      const novos = { ...anteriores }
      if (todos[campo] && !(campo !== 'nome' && todos[campo] === textos.erros.contato)) novos[campo] = todos[campo]
      else delete novos[campo]
      return novos
    })
  }

  const enviar = (evento) => {
    evento.preventDefault()
    if (enviando) return
    const encontrados = validar(dados)
    setErros(encontrados)
    setTocados({ nome: true, whatsapp: true, email: true })
    const campos = Object.keys(encontrados)
    if (campos.length === 0) {
      setMostrarResumo(false)
      onLiberar(dados)
      return
    }
    if (campos.length > 1) {
      setMostrarResumo(true)
      requestAnimationFrame(() => resumoRef.current?.focus())
    } else {
      setMostrarResumo(false)
      formRef.current?.querySelector(`[name="${campos[0]}"]`)?.focus()
    }
  }

  const campoErro = (campo) => (tocados[campo] || erros[campo] ? erros[campo] : null)
  const pj = dados.tipo === 'pj'

  return (
    <form className="dx-card dx-cadastro" onSubmit={enviar} noValidate ref={formRef} aria-busy={enviando || undefined}>
      <h3 className="dx-titulo" ref={focoRef} tabIndex={-1}>
        {textos.prontoTitulo}
      </h3>
      <p className="dx-texto">{textos.prontoTexto}</p>

      <div className="dx-previa" aria-hidden="true">
        <div className="dx-previa__barras">
          {resultado.ordenadas.map((a) => (
            <span key={a.id} style={{ '--v': Math.max(8, a.intensidade) }} />
          ))}
        </div>
        <span className="dx-previa__selo">
          <Cadeado /> {textos.bloqueado}
        </span>
      </div>

      {mostrarResumo && Object.keys(erros).length > 1 ? (
        <div className="dx-resumo" role="alert" tabIndex={-1} ref={resumoRef} aria-labelledby="dx-resumo-titulo">
          <p id="dx-resumo-titulo">{textos.resumoErros}</p>
          <ul>
            {Object.entries(erros).map(([campo, mensagem]) => (
              <li key={campo}>
                <a
                  href={`#dx-${campo}`}
                  onClick={(evento) => {
                    evento.preventDefault()
                    document.getElementById(`dx-${campo}`)?.focus()
                  }}
                >
                  {mensagem}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <fieldset className="dx-tipo">
        <legend>{textos.tipoLegenda}</legend>
        <div className="dx-tipo__opcoes">
          {[
            ['pf', textos.pf],
            ['pj', textos.pj]
          ].map(([valor, rotulo]) => (
            <label key={valor} className={`dx-tipo__opcao${dados.tipo === valor ? ' is-marcada' : ''}`}>
              <input
                type="radio"
                name="tipo"
                value={valor}
                checked={dados.tipo === valor}
                onChange={() => setDados((anteriores) => ({ ...anteriores, tipo: valor }))}
              />
              {rotulo}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="dx-campos">
        <div className="dx-campo-texto">
          <label htmlFor="dx-nome">{pj ? textos.empresa : textos.nome}</label>
          <input
            id="dx-nome"
            name="nome"
            type="text"
            value={dados.nome}
            onChange={mudar('nome')}
            onBlur={sair('nome')}
            autoComplete={pj ? 'organization' : 'name'}
            aria-invalid={campoErro('nome') ? true : undefined}
            aria-describedby={campoErro('nome') ? 'dx-nome-erro' : undefined}
          />
          {campoErro('nome') ? (
            <p className="dx-erro" id="dx-nome-erro">{campoErro('nome')}</p>
          ) : null}
        </div>

        {pj ? (
          <div className="dx-campo-texto">
            <label htmlFor="dx-responsavel">
              {textos.responsavel} <span className="dx-opcional">{textos.opcional}</span>
            </label>
            <input
              id="dx-responsavel"
              name="responsavel"
              type="text"
              value={dados.responsavel}
              onChange={mudar('responsavel')}
              autoComplete="name"
            />
          </div>
        ) : null}

        <div className="dx-contato" role="group" aria-labelledby="dx-contato-titulo" aria-describedby="dx-contato-ajuda">
          <p className="dx-contato__titulo" id="dx-contato-titulo">{textos.contatoTitulo}</p>
          <p className="dx-ajuda" id="dx-contato-ajuda">{textos.contatoAjuda}</p>
          <div className="dx-contato__campos">
            <div className="dx-campo-texto">
              <label htmlFor="dx-whatsapp">{textos.whatsapp}</label>
              <input
                id="dx-whatsapp"
                name="whatsapp"
                type="tel"
                inputMode="tel"
                value={dados.whatsapp}
                onChange={mudar('whatsapp')}
                onBlur={sair('whatsapp')}
                autoComplete="tel"
                placeholder="(11) 91234-5678"
                aria-invalid={campoErro('whatsapp') ? true : undefined}
                aria-describedby={campoErro('whatsapp') ? 'dx-whatsapp-erro' : undefined}
              />
              {campoErro('whatsapp') ? (
                <p className="dx-erro" id="dx-whatsapp-erro">{campoErro('whatsapp')}</p>
              ) : null}
            </div>
            <div className="dx-campo-texto">
              <label htmlFor="dx-email">{textos.email}</label>
              <input
                id="dx-email"
                name="email"
                type="email"
                inputMode="email"
                value={dados.email}
                onChange={mudar('email')}
                onBlur={sair('email')}
                autoComplete="email"
                placeholder="nome@empresa.com.br"
                aria-invalid={campoErro('email') ? true : undefined}
                aria-describedby={campoErro('email') ? 'dx-email-erro' : undefined}
              />
              {campoErro('email') ? (
                <p className="dx-erro" id="dx-email-erro">{campoErro('email')}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* campo-armadilha contra robôs: fica escondido (quem usa o site nunca
          vê nem preenche); se chegar preenchido, o lead não é enviado */}
      <div hidden>
        <label htmlFor="dx-armadilha">Deixe este campo em branco</label>
        <input
          id="dx-armadilha"
          name="_honey"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={dados.armadilha ?? ''}
          onChange={mudar('armadilha')}
        />
      </div>

      <p className="dx-aviso">{textos.aviso}</p>

      <div className="dx-nav">
        <button type="button" className="dx-link" onClick={onVoltar} disabled={enviando}>
          <span aria-hidden="true">←</span> {textos.revisar}
        </button>
        <button type="submit" className="ctapill" disabled={enviando}>
          {enviando ? textos.gerando : textos.liberar}
          {enviando ? null : <span className="ctaarrow" aria-hidden="true">→</span>}
        </button>
      </div>
      <p className="sronly" role="status" aria-live="polite">
        {enviando ? textos.gerando : ''}
      </p>
    </form>
  )
}
