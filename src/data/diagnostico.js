/**
 * Diagnóstico de liderança (captação de clientes na seção de contato).
 * Seis perguntas, uma para cada desafio do diagnóstico (ids de notes.js).
 * Cada resposta vale de 0 (nunca) a 4 (sempre): quanto maior, mais forte
 * o desafio naquela área.
 */

export const escala = [
  { valor: 0, rotulo: 'Nunca' },
  { valor: 1, rotulo: 'Raramente' },
  { valor: 2, rotulo: 'Às vezes' },
  { valor: 3, rotulo: 'Com frequência' },
  { valor: 4, rotulo: 'Sempre' }
]

export const perguntas = [
  {
    id: 'visao',
    area: 'Visão e cultura',
    texto: 'Com que frequência as equipes trabalham sem clareza sobre a visão e as prioridades da empresa?'
  },
  {
    id: 'turnover',
    area: 'Retenção de talentos',
    texto: 'Com que frequência a empresa perde pessoas que gostaria de manter?'
  },
  {
    id: 'comunicacao',
    area: 'Comunicação',
    texto: 'Com que frequência as orientações da liderança geram dúvidas, ruído ou retrabalho?'
  },
  {
    id: 'motivacao',
    area: 'Motivação e engajamento',
    texto: 'Com que frequência os líderes têm dificuldade para motivar e desenvolver o time?'
  },
  {
    id: 'crescimento',
    area: 'Crescimento sustentável',
    texto: 'Com que frequência o crescimento esbarra na falta de líderes preparados?'
  },
  {
    id: 'produtividade',
    area: 'Produtividade',
    texto: 'Com que frequência as entregas dependem de cobrança constante para acontecer?'
  }
]

/** Por onde começar: soluções do portfólio (ids de projects.js) para cada desafio. */
export const recomendacoes = {
  visao: ['programa-liderancas', 'campanha-endomarketing', 'palestras-focadas'],
  turnover: ['acoes-reconhecimento', 'programa-liderancas', 'campanha-endomarketing'],
  comunicacao: ['workshop-comunicacao', 'media-training', 'palestras-focadas'],
  motivacao: ['acoes-reconhecimento', 'workshop-comunicacao', 'programa-liderancas'],
  crescimento: ['programa-liderancas', 'workshop-comunicacao', 'tv-corporativa'],
  produtividade: ['tv-corporativa', 'programa-liderancas', 'workshop-comunicacao']
}

/** Sem nenhum desafio marcado: as soluções para escalar o que já funciona. */
export const recomendacoesPadrao = ['programa-liderancas', 'workshop-comunicacao', 'acoes-reconhecimento']

export const recomendacoesPara = (principal) => (principal ? recomendacoes[principal.id] : recomendacoesPadrao)

export const rotuloEscala = (valor) => escala.find((e) => e.valor === valor)?.rotulo ?? '—'

/**
 * Prioridade sugerida para a equipe comercial (vai só no e-mail do lead,
 * não aparece para a pessoa): quanto menor o índice, mais urgente.
 */
export function prioridade(resultado) {
  if (resultado.indice <= 50) return 'Alta'
  if (resultado.indice < 75) return 'Média'
  return 'Baixa'
}

/** Dado de mercado (já usado no site) que dá contexto a cada desafio. */
export const contexto = {
  visao: { numero: '65%', texto: 'das empresas apontam a gestão de pessoas como a principal barreira para crescer.' },
  turnover: { numero: '73%', texto: 'de turnover anual: cada saída custa recrutamento, treinamento e conhecimento.' },
  comunicacao: { numero: '65%', texto: 'das empresas apontam a gestão de pessoas como a principal barreira para crescer.' },
  motivacao: { numero: '73%', texto: 'dos líderes não sabem como motivar, desenvolver e reter talentos.' },
  crescimento: { numero: '65%', texto: 'das empresas apontam a gestão de pessoas como a principal barreira para crescer.' },
  produtividade: { numero: '−40%', texto: 'de produtividade: o quanto líderes sem treinamento podem custar às suas equipes.' }
}

/** Resultado médio reportado por clientes Forbrains (resultStats) ligado a cada desafio. */
export const impacto = {
  visao: 'Satisfação',
  turnover: 'Rotatividade',
  comunicacao: 'Satisfação',
  motivacao: 'Engajamento',
  crescimento: 'Performance',
  produtividade: 'Performance'
}

/** Faixas do índice de maturidade (100 − intensidade média dos desafios). */
export const faixas = [
  { minimo: 75, rotulo: 'Avançada', texto: 'A base está sólida. O próximo passo é escalar a liderança sem perder o que já funciona.' },
  { minimo: 50, rotulo: 'Em desenvolvimento', texto: 'Há boas práticas, mas alguns gargalos já custam resultado. Vale atacar o principal deles primeiro.' },
  { minimo: 25, rotulo: 'Em atenção', texto: 'Os desafios de pessoas já pesam no dia a dia. Um plano estruturado evita que virem perda de talentos e de margem.' },
  { minimo: 0, rotulo: 'Crítica', texto: 'A gestão de pessoas está travando o negócio. Diagnóstico aprofundado e ação rápida fazem diferença.' }
]

/** Calcula o resultado a partir das respostas { id: valor }. */
export function calcular(respostas) {
  const areas = perguntas.map((p, ordem) => {
    const valor = respostas[p.id] ?? 0
    return { id: p.id, area: p.area, valor, intensidade: Math.round((valor / 4) * 100), ordem }
  })
  const media = areas.reduce((soma, a) => soma + a.intensidade, 0) / areas.length
  const indice = Math.round(100 - media)
  const ordenadas = [...areas].sort((a, b) => b.intensidade - a.intensidade || a.ordem - b.ordem)
  const principal = ordenadas[0].intensidade > 0 ? ordenadas[0] : null
  const faixa = faixas.find((f) => indice >= f.minimo) || faixas[faixas.length - 1]
  return { areas, ordenadas, principal, indice, faixa }
}
