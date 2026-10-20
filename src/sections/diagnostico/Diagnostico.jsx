import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AnelArte from '../../parts/art/AnelArte.jsx'
import Pergunta from './Pergunta.jsx'
import Cadastro from './Cadastro.jsx'
import Painel from './Painel.jsx'
import { calcular, perguntas, prioridade, recomendacoesPara, rotuloEscala } from '../../data/diagnostico.js'
import { notes } from '../../data/notes.js'
import { projects } from '../../data/projects.js'
import { enviarLead } from '../../lib/leads.js'
import { ui } from '../../i18n/ui.js'

const VAZIO = { tipo: 'pf', nome: '', responsavel: '', whatsapp: '', email: '', armadilha: '' }
const espera = (ms) => new Promise((resolver) => setTimeout(resolver, ms))

/**
 * Inteligência de captação na seção de contato:
 *   início → 6 perguntas → cadastro (PF/PJ + WhatsApp ou e-mail) → painel.
 * O painel com o resultado só aparece depois do cadastro; nesse momento o
 * lead sai para a Forbrains (e-mail pelo FormSubmit e, se configurados,
 * webhook e banco). O painel não espera o envio terminar: abre em até ~2,5 s
 * e o aviso de recebimento se atualiza sozinho quando a resposta chega.
 */
export default function Diagnostico({ studio, onResultado }) {
  const [fase, setFase] = useState('inicio')
  const [atual, setAtual] = useState(0)
  const [respostas, setRespostas] = useState({})
  const [lead, setLead] = useState(VAZIO)
  const [envio, setEnvio] = useState(null)
  const [quando, setQuando] = useState(null)
  const focoRef = useRef(null)
  const primeiraVez = useRef(true)
  const raizRef = useRef(null)
  const rodadaEnvio = useRef(0)
  const ui_ = ui.diagnostico

  const resultado = useMemo(() => calcular(respostas), [respostas])

  /* a cada troca de etapa o foco vai para o título novo (leitor de tela e teclado) */
  useEffect(() => {
    if (primeiraVez.current) {
      primeiraVez.current = false
      return
    }
    const alvo = focoRef.current
    if (!alvo) return
    alvo.focus({ preventScroll: true })
    const topo = raizRef.current?.getBoundingClientRect().top ?? 0
    if (topo < 80 || topo > window.innerHeight * 0.6) {
      raizRef.current?.scrollIntoView({ block: 'start' })
    }
  }, [fase, atual])

  useEffect(() => {
    onResultado?.(fase === 'resultado')
  }, [fase, onResultado])

  const responder = useCallback((id, valor) => {
    setRespostas((anteriores) => ({ ...anteriores, [id]: valor }))
  }, [])

  const avancar = useCallback(() => {
    if (atual < perguntas.length - 1) setAtual((n) => n + 1)
    else setFase('cadastro')
  }, [atual])

  const voltar = useCallback(() => {
    if (fase === 'cadastro') {
      setFase('pergunta')
      setAtual(perguntas.length - 1)
    } else if (atual > 0) setAtual((n) => n - 1)
    else setFase('inicio')
  }, [fase, atual])

  const liberar = useCallback(
    async (dados) => {
      setLead(dados)
      setEnvio(null)
      setFase('enviando')
      const principal = resultado.principal
      const pacote = {
        origem: 'diagnostico-site',
        tipo: dados.tipo,
        nome: dados.nome.trim(),
        responsavel: dados.responsavel.trim(),
        whatsapp: dados.whatsapp.trim(),
        email: dados.email.trim(),
        respostas,
        intensidades: Object.fromEntries(resultado.areas.map((a) => [a.id, a.intensidade])),
        areas: resultado.ordenadas.map((a) => ({
          id: a.id,
          area: a.area,
          intensidade: a.intensidade,
          resposta: rotuloEscala(a.valor)
        })),
        principal: principal ? { id: principal.id, area: principal.area, intensidade: principal.intensidade } : null,
        indice: resultado.indice,
        faixa: resultado.faixa.rotulo,
        prioridade: prioridade(resultado),
        sugestoes: recomendacoesPara(principal)
          .map((id) => projects.find((p) => p.id === id)?.name)
          .filter(Boolean),
        criadoEm: new Date().toISOString(),
        pagina: window.location.href.split('#')[0]
      }

      // o envio segue em segundo plano; o aviso do painel se atualiza quando
      // ele terminar (a rodada evita que um envio antigo apareça depois de "Refazer")
      const rodada = ++rodadaEnvio.current
      const envioLead = enviarLead(pacote, { armadilha: dados.armadilha })
      envioLead.then((retorno) => {
        if (rodada === rodadaEnvio.current) setEnvio(retorno)
      })
      await Promise.race([Promise.all([envioLead, espera(900)]), espera(2600)])
      if (rodada !== rodadaEnvio.current) return
      setQuando(new Date())
      setFase('resultado')
    },
    [respostas, resultado]
  )

  const refazer = useCallback(() => {
    rodadaEnvio.current += 1
    setRespostas({})
    setAtual(0)
    setEnvio(null)
    setFase('pergunta')
  }, [])

  const tituloPrincipal = resultado.principal
    ? notes.find((n) => n.id === resultado.principal.id)?.title
    : ui_.semDesafio

  return (
    <div className={`dx dx--${fase}`} ref={raizRef}>
      {fase === 'inicio' ? (
        <div className="dx-card dx-inicio">
          <div className="dx-inicio__anel">
            <AnelArte giro={false} semente={31} />
          </div>
          <h3 className="dx-titulo">{ui_.titulo}</h3>
          <p className="dx-texto">{ui_.chamada}</p>
          <ul className="dx-meta">
            {ui_.meta.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <button type="button" className="ctapill dx-comecar" onClick={() => setFase('pergunta')}>
            {ui_.comecar} <span className="ctaarrow" aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}

      {fase === 'pergunta' ? (
        <Pergunta
          key={perguntas[atual].id}
          indice={atual}
          total={perguntas.length}
          pergunta={perguntas[atual]}
          valor={respostas[perguntas[atual].id]}
          onResponder={responder}
          onAvancar={avancar}
          onVoltar={voltar}
          focoRef={focoRef}
        />
      ) : null}

      {fase === 'cadastro' || fase === 'enviando' ? (
        <Cadastro
          inicial={lead}
          enviando={fase === 'enviando'}
          resultado={resultado}
          onLiberar={liberar}
          onVoltar={voltar}
          focoRef={focoRef}
        />
      ) : null}

      {fase === 'resultado' ? (
        <Painel
          lead={lead}
          resultado={resultado}
          respostas={respostas}
          tituloPrincipal={tituloPrincipal}
          envio={envio}
          quando={quando}
          studio={studio}
          onRefazer={refazer}
          focoRef={focoRef}
        />
      ) : null}
    </div>
  )
}
