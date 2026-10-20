/**
 * Envio dos leads do diagnóstico.
 *
 * Destinos, todos configurados em public/config.json e usados ao mesmo tempo:
 *   "leadEmail"   e-mail que recebe cada diagnóstico pelo FormSubmit
 *                 (formsubmit.co, grátis). Depois da ativação, dá para trocar
 *                 o e-mail pelo código que o FormSubmit envia, para não deixar
 *                 o endereço visível no site.
 *   "leadWebhook" URL de um webhook (Google Planilhas, Make, Zapier, n8n,
 *                 RD Station…). Recebe o lead em JSON.
 *   "backend"     true → POST em api/leads (o server.js grava no banco).
 * Se nenhum destino aceitar o envio, o painel mostra o botão de e-mail já
 * preenchido para a pessoa mandar o diagnóstico ela mesma.
 */

const FORMSUBMIT = 'https://formsubmit.co/ajax/'

let configuracao = null

async function lerConfig() {
  if (configuracao) return configuracao
  try {
    const resposta = await fetch('config.json', { cache: 'no-store' })
    configuracao = resposta.ok ? await resposta.json() : {}
  } catch {
    configuracao = {}
  }
  return configuracao
}

async function comPrazo(promessa, ms = 9000) {
  let timer
  const prazo = new Promise((_, rejeitar) => {
    timer = setTimeout(() => rejeitar(new Error('tempo esgotado')), ms)
  })
  try {
    return await Promise.race([promessa, prazo])
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Campos do e-mail que chega à Forbrains. O FormSubmit monta uma tabela com
 * cada campo numa linha, na ordem em que aparecem aqui. Os campos que começam
 * com _ são configuração do FormSubmit:
 *   _subject  assunto do e-mail
 *   _template "table" = tabela organizada
 *   _replyto  responder o e-mail vai direto para a pessoa
 *   _captcha  desligado (envio pelo próprio site, sem página intermediária)
 */
export function camposEmail(lead) {
  const pj = lead.tipo === 'pj'
  const campos = {
    _subject: `Novo diagnóstico de liderança · ${lead.nome}${lead.principal ? ` · ${lead.principal.area}` : ''}`,
    _template: 'table',
    _captcha: 'false'
  }
  if (lead.email) campos._replyto = lead.email

  campos.Prioridade = lead.prioridade
  campos[pj ? 'Empresa' : 'Nome'] = lead.nome
  if (pj) campos['Responsável'] = lead.responsavel || '—'
  campos.Tipo = pj ? 'Empresa' : 'Pessoa física'
  campos.WhatsApp = lead.whatsapp || '—'
  campos['E-mail'] = lead.email || '—'
  campos['Principal desafio'] = lead.principal
    ? `${lead.principal.area} (${lead.principal.intensidade}%)`
    : 'Nenhum desafio crítico'
  campos['Índice de maturidade'] = `${lead.indice}/100 · ${lead.faixa}`
  lead.areas.forEach((a) => {
    campos[a.area] = `${a.intensidade}% · ${a.resposta}`
  })
  campos['Soluções sugeridas'] = lead.sugestoes.join(' · ')
  campos['Enviado em'] = new Date(lead.criadoEm).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
  campos['Página'] = lead.pagina
  return campos
}

async function porEmail(destino, lead) {
  const resposta = await comPrazo(
    fetch(FORMSUBMIT + destino, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(camposEmail(lead))
    })
  )
  const dados = await resposta.json().catch(() => ({}))
  if (resposta.ok && (dados.success === true || dados.success === 'true')) return 'email'
  // Antes da ativação, o FormSubmit guarda o envio e manda ao destino um link
  // de confirmação; o lead é entregue quando o e-mail for confirmado.
  if (/activat/i.test(String(dados.message ?? ''))) {
    console.warn(`[diagnóstico] Confirme o e-mail de ativação do FormSubmit enviado para ${destino}.`)
    return 'email-aguardando-ativacao'
  }
  throw new Error(String(dados.message || `FormSubmit respondeu ${resposta.status}`))
}

async function porWebhook(url, lead) {
  // text/plain evita a pré-checagem de CORS; o webhook recebe o JSON no corpo
  await comPrazo(
    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(lead),
      keepalive: true
    })
  )
  return 'webhook'
}

async function porBackend(lead) {
  const resposta = await comPrazo(
    fetch('api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    })
  )
  if (!resposta.ok) throw new Error(`api/leads respondeu ${resposta.status}`)
  return 'backend'
}

/**
 * Envia o lead para todos os destinos configurados.
 * `armadilha` é o campo escondido do formulário: gente não vê e não preenche;
 * se vier preenchido, é robô, e nada é enviado.
 * Devolve { enviado, via }.
 */
export async function enviarLead(lead, { armadilha = '' } = {}) {
  if (armadilha) return { enviado: true, via: 'ignorado' }

  const config = await lerConfig()
  const destino = String(config.leadEmail ?? '').trim()
  const tarefas = []
  if (/^[\w.+-]+(@[\w-]+(\.[\w-]+)+)?$/.test(destino)) tarefas.push(porEmail(destino, lead))
  if (config.leadWebhook) tarefas.push(porWebhook(config.leadWebhook, lead))
  if (config.backend) tarefas.push(porBackend(lead))
  if (!tarefas.length) return { enviado: false, via: 'nenhum' }

  const resultados = await Promise.allSettled(tarefas)
  const vias = resultados.filter((r) => r.status === 'fulfilled').map((r) => r.value)
  resultados
    .filter((r) => r.status === 'rejected')
    .forEach((r) => console.warn('[diagnóstico] Um destino do lead falhou:', r.reason?.message || r.reason))
  return { enviado: vias.length > 0, via: vias.join('+') || 'falhou' }
}

/** Link de e-mail com o diagnóstico resumido, para a pessoa falar com a Forbrains. */
export function linkEmail(destino, lead, resultado, rotuloPrincipal) {
  const assunto = `Diagnóstico de liderança · ${lead.nome}`
  const linhas = [
    `Olá! Fiz o diagnóstico de liderança no site e quero falar com um especialista.`,
    '',
    `${lead.tipo === 'pj' ? 'Empresa' : 'Nome'}: ${lead.nome}`,
    lead.responsavel ? `Contato: ${lead.responsavel}` : null,
    lead.whatsapp ? `WhatsApp: ${lead.whatsapp}` : null,
    lead.email ? `E-mail: ${lead.email}` : null,
    '',
    `Principal desafio: ${rotuloPrincipal}`,
    `Índice de maturidade da liderança: ${resultado.indice}/100 (${resultado.faixa.rotulo})`,
    '',
    ...resultado.ordenadas.map((a) => `· ${a.area}: ${a.intensidade}%`)
  ].filter((linha) => linha !== null)
  return `mailto:${destino}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(linhas.join('\n'))}`
}
