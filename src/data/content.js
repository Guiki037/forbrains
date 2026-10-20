/** Conteúdo das seções novas: realidade (dor), prova, metodologia, resultados */

/** Estatísticas críticas — valores IMUTÁVEIS conforme brand guidelines */
export const realityStats = [
  {
    value: 73,
    suffix: '%',
    label: 'de turnover anual',
    text: 'A rotatividade nas empresas brasileiras segue em nível recorde — e cada saída custa recrutamento, treinamento e conhecimento perdido.'
  },
  {
    value: 65,
    suffix: '%',
    label: 'de dificuldade em gestão de pessoas',
    text: 'A maioria das empresas aponta a gestão de pessoas como a principal barreira para crescer de forma sustentável.'
  },
  {
    value: -40,
    suffix: '%',
    label: 'de produtividade perdida',
    text: 'Líderes sem treinamento custam à empresa até 40% da produtividade potencial das suas equipes.'
  }
]

/** Credibilidade — números IMUTÁVEIS */
export const proofStats = [
  { value: 30, prefix: '+', suffix: '', label: 'anos de experiência' },
  { value: 95, prefix: '', suffix: '%', label: 'de satisfação dos clientes' },
  { value: 100, prefix: '+', suffix: '', label: 'empresas atendidas' },
  { value: 5000, prefix: '+', suffix: '', label: 'pessoas impactadas' }
]

/** Metodologia em 4 etapas — ordem IMUTÁVEL.
 *  O desenho de cada etapa sai de src/parts/art/emblemas.js pelo número. */
export const methodSteps = [
  {
    no: '01',
    title: 'Diagnóstico',
    text: 'Análise completa das necessidades e desafios da sua organização.'
  },
  {
    no: '02',
    title: 'Customização',
    text: 'Desenvolvimento de programa personalizado para seus objetivos.'
  },
  {
    no: '03',
    title: 'Execução',
    text: 'Implementação e acompanhamento ativo de cada entrega.'
  },
  {
    no: '04',
    title: 'Acompanhamento',
    text: 'Monitoramento de resultados e ajustes para máxima efetividade.'
  }
]

/** Resultados mensuráveis — valores IMUTÁVEIS */
export const resultStats = [
  {
    value: 35,
    prefix: '+',
    suffix: '%',
    label: 'Performance',
    text: 'aumento médio na produtividade das equipes treinadas'
  },
  {
    value: 60,
    prefix: '+',
    suffix: '%',
    label: 'Satisfação',
    text: 'aumento na satisfação e retenção de colaboradores'
  },
  {
    value: -40,
    prefix: '',
    suffix: '%',
    label: 'Rotatividade',
    text: 'redução na saída de talentos e custos de recontratação'
  },
  {
    value: 50,
    prefix: '+',
    suffix: '%',
    label: 'Engajamento',
    text: 'melhoria significativa no clima organizacional'
  }
]

export const resultsQuestion = 'Por que a Forbrains é a escolha certa para treinar e capacitar seus times?'

/** Cena "antes" da máscara que revela (efeito 05): quatro desafios do
 *  diagnóstico (ids de notes.js), na mesma posição dos quatro resultados. */
export const beforeIds = ['produtividade', 'comunicacao', 'turnover', 'motivacao']
