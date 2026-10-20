import Arte from '../../parts/art/Arte.jsx'
import { emblemaSolucao } from '../../parts/art/emblemas.js'
import { contexto, impacto, perguntas, recomendacoesPara, rotuloEscala } from '../../data/diagnostico.js'
import { notes } from '../../data/notes.js'
import { projects, typeLabels } from '../../data/projects.js'
import { resultStats } from '../../data/content.js'
import { linkEmail } from '../../lib/leads.js'
import { ui } from '../../i18n/ui.js'

/**
 * Painel do diagnóstico (liberado depois do cadastro).
 * Forma escolhida pela skill de dataviz: o principal desafio e o índice são
 * números de destaque; as seis áreas viram barras horizontais ordenadas,
 * com ênfase só na maior (rosa) e as demais em cinza, valor na ponta.
 * A tabela com as respostas é o equivalente acessível do gráfico.
 */
export default function Painel({ lead, resultado, respostas, tituloPrincipal, envio, quando, studio, onRefazer, focoRef }) {
  const textos = ui.diagnostico
  const principal = resultado.principal
  const nota = principal ? notes.find((n) => n.id === principal.id) : null
  const recs = recomendacoesPara(principal)
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean)
  const ctx = principal ? contexto[principal.id] : null
  const stat = principal ? resultStats.find((s) => s.label === impacto[principal.id]) : null
  const nome = (lead.tipo === 'pj' ? lead.responsavel.trim() || lead.nome.trim() : lead.nome.trim()).split(/\s+/)[0]
  const data = quando ? quando.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''
  const rotulo = rotuloEscala
  const canal = lead.whatsapp.trim() ? 'WhatsApp' : 'e-mail'
  const avisoEnvio = envio === null ? textos.enviandoNota : envio.enviado ? textos.recebido(canal) : textos.naoEnviado

  return (
    <div className="dx-painel">
      <header className="dx-painel__topo">
        <div>
          <p className="dx-painel__sobre">
            {textos.painelSobre}
            {data ? ` · ${data}` : ''}
            {lead.tipo === 'pj' ? ` · ${lead.nome.trim()}` : ''}
          </p>
          <h3 className="dx-painel__titulo" ref={focoRef} tabIndex={-1}>
            {textos.painelTitulo(nome)}
          </h3>
        </div>
        <button type="button" className="dx-link dx-link--claro" onClick={onRefazer}>
          {textos.refazer}
        </button>
      </header>

      <div className="dx-grade">
        <section className="dx-bloco dx-bloco--principal" aria-labelledby="dx-principal-rotulo">
          <p className="dx-bloco__rotulo" id="dx-principal-rotulo">{textos.principalRotulo}</p>
          <p className="dx-principal__nome">{tituloPrincipal}</p>
          {principal ? (
            <>
              <div className="dx-medidor" aria-hidden="true">
                <span style={{ '--v': principal.intensidade }} />
              </div>
              <p className="dx-medidor__legenda">
                <strong>{principal.intensidade}%</strong> {textos.intensidade} · {rotulo(principal.valor)}
              </p>
              <p className="dx-bloco__texto">{nota?.body}</p>
              {ctx ? (
                <p className="dx-contexto">
                  <strong>{ctx.numero}</strong> {ctx.texto}
                </p>
              ) : null}
            </>
          ) : (
            <p className="dx-bloco__texto">{textos.semDesafioTexto}</p>
          )}
        </section>

        <section className="dx-bloco dx-bloco--indice" aria-labelledby="dx-indice-rotulo">
          <p className="dx-bloco__rotulo" id="dx-indice-rotulo">{textos.indiceRotulo}</p>
          <p className="dx-indice__valor">
            {resultado.indice}
            <small>/100</small>
          </p>
          <div className="dx-medidor" aria-hidden="true">
            <span style={{ '--v': resultado.indice }} />
          </div>
          <p className="dx-indice__faixa">{resultado.faixa.rotulo}</p>
          <p className="dx-bloco__texto">{resultado.faixa.texto}</p>
        </section>

        <section className="dx-bloco dx-bloco--areas" aria-labelledby="dx-areas-titulo">
          <h4 className="dx-bloco__titulo" id="dx-areas-titulo">{textos.areasTitulo}</h4>
          <p className="dx-bloco__sub">{textos.areasSub}</p>
          <ul className="dx-barras">
            {resultado.ordenadas.map((a, k) => (
              <li className={`dx-barra${principal && k === 0 ? ' is-principal' : ''}`} key={a.id}>
                <span className="dx-barra__rotulo">
                  {a.area}
                  <small>{rotulo(a.valor)}</small>
                </span>
                <span className="dx-barra__trilho" aria-hidden="true">
                  <span className="dx-barra__valor" style={{ '--v': a.intensidade, '--k': k }} />
                </span>
                <span className="dx-barra__numero">{a.intensidade}%</span>
              </li>
            ))}
          </ul>
          <details className="dx-tabela">
            <summary>{textos.verRespostas}</summary>
            <table>
              <thead>
                <tr>
                  <th scope="col">{textos.colPergunta}</th>
                  <th scope="col">{textos.colResposta}</th>
                  <th scope="col">{textos.colIntensidade}</th>
                </tr>
              </thead>
              <tbody>
                {perguntas.map((p) => (
                  <tr key={p.id}>
                    <td>{p.texto}</td>
                    <td>{rotulo(respostas[p.id])}</td>
                    <td>{Math.round(((respostas[p.id] ?? 0) / 4) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </section>

        <section className="dx-bloco dx-bloco--recs" aria-labelledby="dx-recs-titulo">
          <h4 className="dx-bloco__titulo" id="dx-recs-titulo">{textos.recsTitulo}</h4>
          <ul className="dx-recs">
            {recs.map((p) => (
              <li className="dx-rec" key={p.id}>
                <div className="dx-rec__arte">
                  <Arte emblema={emblemaSolucao(p.id)} largura={320} altura={240} />
                </div>
                <div className="dx-rec__texto">
                  <p className="dx-rec__tipo">{typeLabels[p.type]}</p>
                  <p className="dx-rec__nome">{p.name}</p>
                  <p className="dx-rec__linha">{p.oneLine}</p>
                </div>
              </li>
            ))}
          </ul>
          {stat ? <p className="dx-impacto">{textos.impacto(stat)}</p> : null}
        </section>
      </div>

      <div className="dx-acoes">
        <a className="ctapill" href={linkEmail(studio.email, lead, resultado, tituloPrincipal)}>
          <span>{textos.especialista}</span>
          <span className="ctaarrow" aria-hidden="true">→</span>
        </a>
        <p className="dx-acoes__nota" role="status">
          {avisoEnvio}
        </p>
      </div>
    </div>
  )
}
