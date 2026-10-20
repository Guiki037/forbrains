/** Textos fixos de interface — português (PT-BR) */
export const ui = {
  nav: {
    reality: 'Realidade',
    challenges: 'Desafios',
    solutions: 'Soluções',
    method: 'Metodologia',
    results: 'Resultados',
    contact: 'Contato',
    menu: 'Menu',
    closeMenu: 'Fechar menu'
  },
  cta: {
    proposal: 'Quero minha proposta',
    proposalNow: 'Solicitar proposta agora',
    solutions: 'Conheça as soluções'
  },
  /** título só para leitor de tela (a faixa de números do hero) */
  proof: 'Por que a Forbrains',
  reality: {
    sources: 'Fontes: IBGE, ABRAPP, PNAD',
    question: 'Sua empresa enfrenta esses desafios?'
  },
  gallery: {
    hint: 'Role para percorrer as soluções',
    swipe: 'Arraste ou deslize',
    skip: 'Pular a galeria de soluções',
    prev: 'Solução anterior',
    next: 'Próxima solução',
    of: (n) => `de ${n}`
  },
  method: {
    step: 'Etapa'
  },
  results: {
    before: 'Antes',
    after: 'Depois'
  },
  contact: {
    email: 'E-mail',
    studio: 'Escritório',
    phone: 'Telefone'
  },
  diagnostico: {
    titulo: 'Diagnóstico de liderança',
    chamada: 'Responda 6 perguntas rápidas e descubra o principal desafio da liderança na sua empresa, com um painel de resultados e por onde começar.',
    meta: ['6 perguntas', 'Cerca de 2 minutos', 'Resultado na hora'],
    comecar: 'Começar diagnóstico',
    passo: (n, total) => `Pergunta ${n} de ${total}`,
    voltar: 'Voltar',
    proxima: 'Próxima',
    verResultado: 'Ver meu resultado',
    prontoTitulo: 'Seu diagnóstico está pronto',
    prontoTexto: 'Diga para quem é o resultado. O painel aparece aqui na hora, com o principal desafio e por onde começar.',
    bloqueado: 'Painel liberado após o cadastro',
    tipoLegenda: 'Você responde como',
    pf: 'Pessoa física',
    pj: 'Empresa',
    nome: 'Seu nome',
    empresa: 'Nome da empresa',
    responsavel: 'Seu nome',
    opcional: '(opcional)',
    contatoTitulo: 'Onde enviamos o diagnóstico',
    contatoAjuda: 'Preencha o WhatsApp, o e-mail ou os dois.',
    whatsapp: 'WhatsApp',
    email: 'E-mail',
    aviso: 'Ao liberar o resultado, seus dados e respostas são enviados à Forbrains, que pode entrar em contato sobre este diagnóstico.',
    revisar: 'Revisar respostas',
    liberar: 'Liberar meu diagnóstico',
    gerando: 'Gerando seu painel…',
    resumoErros: 'Falta pouco: confira os campos abaixo.',
    erros: {
      nome: 'Informe seu nome.',
      empresa: 'Informe o nome da empresa.',
      whatsapp: 'Confira o número: DDD + número, por exemplo (11) 91234-5678.',
      email: 'Confira o e-mail, por exemplo nome@empresa.com.br.',
      contato: 'Informe um WhatsApp ou um e-mail para receber o diagnóstico.'
    },
    painelSobre: 'Diagnóstico de liderança',
    painelTitulo: (nome) => (nome ? `${nome}, este é o retrato da sua liderança` : 'Este é o retrato da sua liderança'),
    refazer: 'Refazer diagnóstico',
    principalRotulo: 'Principal desafio',
    semDesafio: 'Nenhum desafio crítico',
    semDesafioTexto: 'Suas respostas mostram uma liderança bem estruturada. O próximo passo é escalar o que já funciona e preparar novos líderes para o crescimento.',
    intensidade: 'de intensidade',
    indiceRotulo: 'Índice de maturidade da liderança',
    areasTitulo: 'Intensidade de cada desafio',
    areasSub: '0% quando nunca acontece, 100% quando acontece sempre.',
    verRespostas: 'Ver suas respostas',
    colPergunta: 'Pergunta',
    colResposta: 'Sua resposta',
    colIntensidade: 'Intensidade',
    recsTitulo: 'Por onde começar',
    impacto: (stat) =>
      `Resultado médio de clientes Forbrains: ${stat.value < 0 ? '−' : stat.prefix}${Math.abs(stat.value)}${stat.suffix} · ${stat.text}.`,
    especialista: 'Falar com um especialista',
    enviandoNota: 'Enviando seu diagnóstico para a Forbrains…',
    recebido: (canal) => `Recebemos seu diagnóstico. Um especialista da Forbrains vai falar com você por ${canal}.`,
    naoEnviado: 'Envie este diagnóstico para a Forbrains pelo botão ao lado e receba a análise de um especialista.'
  },
  head: {
    nav: 'Navegação de seções',
    home: 'Voltar ao início'
  }
}
