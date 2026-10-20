import { arco, contorno, espalhar, grade, reta, retanguloArredondado } from '../../lib/dots.js'

/**
 * Emblemas de pontos que substituem as fotos.
 * Soluções: caixa 320 × 240. Etapas da metodologia: caixa 480 × 400.
 * Cada emblema devolve { pontos, linhas }; linhas são opcionais.
 */

/** Pessoa mínima: cabeça em destaque e tronco. y é o centro da cabeça. */
function figura(x, y, extra = {}) {
  return [
    { x, y, r: 8, o: 1, tipo: 'acento', j: 0, ...extra },
    { x, y: y + 16, r: 3.1, o: 0.7, tipo: 'base', j: 1, ...extra },
    { x: x - 11, y: y + 20, r: 2.5, o: 0.55, tipo: 'base', j: 2, ...extra },
    { x: x + 11, y: y + 20, r: 2.5, o: 0.55, tipo: 'base', j: 3, ...extra },
    { x, y: y + 30, r: 2.6, o: 0.55, tipo: 'base', j: 4, ...extra }
  ]
}

/* ────────────────────────── soluções (320 × 240) ────────────────────────── */

const SOLUCOES = {
  /* sala de workshop: quem facilita fala para a turma sentada em U */
  'workshop-comunicacao': () => {
    const fala = [
      ...arco(160, 42, 18, 5, 2.4, 206, 334, { o: 0.9, tipo: 'acento', i: 0 }),
      ...arco(160, 42, 30, 7, 2.1, 210, 330, { o: 0.4, i: 0 })
    ]
    const mesa = [
      ...reta(92, 112, 92, 184, 7, 2.6, { o: 0.5, i: 1 }),
      ...reta(92, 184, 228, 184, 10, 2.6, { o: 0.5, i: 1 }),
      ...reta(228, 184, 228, 112, 7, 2.6, { o: 0.5, i: 1 })
    ]
    const turma = [
      [64, 124], [64, 156], [64, 188],
      [256, 124], [256, 156], [256, 188],
      [124, 214], [160, 218], [196, 214]
    ].flatMap(([x, y], j) => [
      { x, y, r: 5.4, o: 1, tipo: 'acento', i: 2, j },
      { x, y: y + 11, r: 2.3, o: 0.4, tipo: 'base', i: 2, j }
    ])
    return { pontos: [...fala, ...figura(160, 64, { i: 0 }), ...mesa, ...turma] }
  },

  /* jornada: degraus que sobem, o topo de cada um aceso */
  'programa-liderancas': () => {
    const colunas = [70, 115, 160, 205, 250]
    const pontos = []
    const topos = []
    colunas.forEach((x, k) => {
      const altura = k + 1
      for (let n = 0; n < altura; n += 1) {
        const y = 200 - n * 26
        const topo = n === altura - 1
        pontos.push({ x, y, r: topo ? 7 : 3.2, o: topo ? 1 : 0.32, tipo: topo ? 'acento' : 'base', i: k, j: n })
        if (topo) topos.push([x, y])
      }
    })
    for (let k = 0; k < topos.length - 1; k += 1) {
      const [x1, y1] = topos[k]
      const [x2, y2] = topos[k + 1]
      reta(x1, y1, x2, y2, 5, 1.6, { o: 0.55, i: 5 }).slice(1, -1).forEach((p) => pontos.push(p))
    }
    return { pontos }
  },

  /* transmissão: uma fonte, ondas que se abrem e pessoas que recebem */
  'campanha-endomarketing': () => ({
    pontos: [
      { x: 84, y: 120, r: 10, o: 1, tipo: 'acento', i: 0, j: 0 },
      ...arco(84, 120, 36, 5, 3.2, -48, 48, { o: 0.7, i: 1 }),
      ...arco(84, 120, 66, 8, 3, -48, 48, { o: 0.5, i: 2 }),
      ...arco(84, 120, 96, 11, 2.8, -48, 48, { o: 0.32, i: 3 }),
      ...[
        [238, 62, 5.5],
        [266, 104, 6.5],
        [244, 146, 5],
        [274, 182, 5.5],
        [226, 196, 4.5]
      ].map(([x, y, r], j) => ({ x, y, r, o: 1, tipo: 'acento', i: 4, j }))
    ]
  }),

  /* reconhecimento: estrela de pontos e confete */
  'acoes-reconhecimento': () => {
    const cx = 160
    const cy = 122
    const vertices = Array.from({ length: 10 }, (_, k) => {
      const raio = k % 2 === 0 ? 76 : 31
      const a = (-90 + k * 36) * (Math.PI / 180)
      return [cx + Math.cos(a) * raio, cy + Math.sin(a) * raio]
    })
    const estrela = contorno(vertices, 15, 2.6, { o: 0.6, i: 1 })
    const pontas = vertices
      .filter((_, k) => k % 2 === 0)
      .map(([x, y], j) => ({ x, y, r: 5.5, o: 1, tipo: 'acento', i: 2, j }))
    const confete = espalhar(7, 10, [24, 18, 296, 222], 1.8, 4.6, { tipo: 'acento', i: 3 }, [cx, cy, 96])
    return {
      pontos: [{ x: cx, y: cy, r: 10, o: 1, tipo: 'acento', i: 0, j: 0 }, ...estrela, ...pontas, ...confete]
    }
  },

  /* gestão à vista: tela com indicadores subindo */
  'tv-corporativa': () => {
    const tela = retanguloArredondado(62, 34, 196, 136, 16, 14, 2.4, { o: 0.55, i: 0 })
    const barras = []
    ;[2, 3, 4, 5].forEach((altura, k) => {
      const x = 112 + k * 32
      for (let n = 0; n < altura; n += 1) {
        const topo = n === altura - 1
        barras.push({
          x,
          y: 150 - n * 22,
          r: topo ? 6 : 4.2,
          o: topo ? 1 : 0.3,
          tipo: topo ? 'acento' : 'base',
          i: 1 + k * 0.5,
          j: n
        })
      }
    })
    return {
      pontos: [
        ...tela,
        ...barras,
        ...reta(160, 182, 160, 196, 2, 2.4, { o: 0.55, i: 3 }),
        ...reta(126, 208, 194, 208, 6, 2.4, { o: 0.55, i: 3 })
      ]
    }
  },

  /* palestra: tela, quem fala no palco e a plateia em duas fileiras */
  'palestras-focadas': () => {
    const tela = [
      ...retanguloArredondado(104, 18, 112, 58, 8, 11, 2.2, { o: 0.55, i: 0 }),
      ...reta(122, 38, 198, 38, 5, 1.8, { o: 0.35, i: 0 }),
      ...reta(122, 50, 176, 50, 4, 1.8, { o: 0.35, i: 0 })
    ]
    const luz = [{ x: 160, y: 8, r: 4.5, o: 1, tipo: 'acento', i: 1, j: 0 }]
    ;[124, 142, 160, 178, 196].forEach((x, j) => {
      reta(160, 12, x, 96, 4, 1.7, { o: 0.32, i: 1, j }).slice(1).forEach((p) => luz.push(p))
    })
    const plateia = []
    ;[
      [186, [58, 104, 150, 196, 242], 5.2],
      [212, [40, 82, 124, 166, 208, 250, 292], 4]
    ].forEach(([y, xs, r], fileira) => {
      xs.forEach((x, j) => {
        plateia.push({ x, y, r, o: 1, tipo: 'acento', i: 3, j: fileira * 8 + j })
      })
    })
    return {
      pontos: [
        ...tela,
        ...luz,
        ...figura(160, 100, { i: 2 }),
        ...reta(52, 156, 268, 156, 14, 2.5, { o: 0.6, i: 2 }),
        ...plateia
      ]
    }
  },

  /* media training: microfone e ondas de som dos dois lados */
  'media-training': () => ({
    pontos: [
      ...retanguloArredondado(142, 44, 36, 66, 18, 9, 2.6, { o: 0.75, i: 0 }),
      ...grade(154, 66, 2, 3, 12, 1.8, { o: 0.4, i: 0 }),
      ...arco(160, 100, 30, 9, 2.4, 0, 180, { o: 0.55, i: 1 }),
      ...reta(160, 140, 160, 166, 3, 2.4, { o: 0.55, i: 1 }),
      ...reta(136, 176, 184, 176, 5, 2.4, { o: 0.55, i: 1 }),
      ...arco(160, 78, 54, 5, 3.6, -36, 36, { tipo: 'acento', i: 2 }),
      ...arco(160, 78, 54, 5, 3.6, 144, 216, { tipo: 'acento', i: 2 }),
      ...arco(160, 78, 78, 7, 3.2, -34, 34, { tipo: 'acento', o: 0.75, i: 3 }),
      ...arco(160, 78, 78, 7, 3.2, 146, 214, { tipo: 'acento', o: 0.75, i: 3 })
    ]
  }),

  /* retrato: cantos do visor e a lente em foco */
  'foto-corporativa': () => {
    const cantos = []
    const caixa = [70, 36, 250, 204]
    ;[
      [caixa[0], caixa[1], 1, 1],
      [caixa[2], caixa[1], -1, 1],
      [caixa[0], caixa[3], 1, -1],
      [caixa[2], caixa[3], -1, -1]
    ].forEach(([x, y, sx, sy], k) => {
      reta(x, y, x + sx * 34, y, 4, 2.6, { o: 0.65, i: 0, j: k }).forEach((p) => cantos.push(p))
      reta(x, y + sy * 11, x, y + sy * 34, 3, 2.6, { o: 0.65, i: 0, j: k }).forEach((p) => cantos.push(p))
    })
    return {
      pontos: [
        ...cantos,
        ...arco(160, 120, 52, 18, 4.2, 0, 360, { tipo: 'acento', i: 1 }),
        ...arco(160, 120, 27, 10, 2.6, 0, 360, { o: 0.55, i: 2 }),
        { x: 160, y: 120, r: 6.5, o: 1, tipo: 'acento', i: 3, j: 0 }
      ]
    }
  },

  /* conteúdo: botão de play feito de pontos */
  'producao-conteudo': () => {
    const triangulo = []
    const a = [140, 88]
    const altura = 64
    for (let linha = 0; linha < 6; linha += 1) {
      const x = a[0] + linha * 11
      const meia = (altura / 2) * (1 - linha / 6)
      const n = Math.max(1, Math.round((meia * 2) / 11) + 1)
      for (let k = 0; k < n; k += 1) {
        const y = 120 - meia + (n === 1 ? meia : (2 * meia * k) / (n - 1))
        triangulo.push({ x, y, r: 3, o: 0.9, tipo: 'base', i: 1, j: linha })
      }
    }
    return {
      pontos: [...arco(160, 120, 76, 24, 4, -90, 270, { tipo: 'acento', i: 0 }), ...triangulo]
    }
  }
}

export function emblemaSolucao(id) {
  const fabricar = SOLUCOES[id]
  return fabricar ? fabricar() : { pontos: [] }
}

/* ─────────────────────── etapas da metodologia (480 × 400) ─────────────────────── */

const ETAPAS = {
  /* diagnóstico: a lente passa sobre a organização e acende o que importa */
  '01': () => {
    const lente = [282, 186, 84]
    const base = grade(60, 74, 11, 8, 36, 2.6, { o: 0.26, i: 0 })
    const pontos = base.map((p) => {
      const dentro = Math.hypot(p.x - lente[0], p.y - lente[1]) < lente[2] - 16
      return dentro ? { ...p, r: 5.4, o: 1, tipo: 'acento', i: 3 } : p
    })
    return {
      pontos: [
        ...pontos,
        ...arco(lente[0], lente[1], lente[2], 26, 4, 0, 360, { tipo: 'acento', i: 1 }),
        ...reta(lente[0] + 66, lente[1] + 66, lente[0] + 112, lente[1] + 112, 4, 6, { o: 0.65, i: 2 })
      ]
    }
  },

  /* customização: a ficha de uma pessoa, com três ajustes no tamanho certo */
  '02': () => {
    const ficha = retanguloArredondado(64, 40, 352, 320, 28, 18, 2.8, { o: 0.38, i: 0 })
    const barras = [156, 236, 316].flatMap((y, k) => {
      const comprimento = 100 + k * 55
      return [
        ...reta(210, y, 210 + comprimento, y, 6 + k, 3.1, { o: 0.4, i: 1, j: k }),
        { x: 210 + comprimento, y, r: 9, o: 1, tipo: 'acento', i: 2, j: k }
      ]
    })
    return { pontos: [...ficha, ...figura(132, 108, { i: 1 }), ...barras] }
  },

  /* execução: duas entregas concluídas e a terceira a caminho */
  '03': () => {
    const itens = [108, 200, 292].flatMap((y, k) => {
      const caixa = retanguloArredondado(72, y - 26, 52, 52, 10, 9, 2.5, { o: 0.55, i: 0, j: k })
      const linha = reta(156, y, k === 2 ? 300 : 360, y, k === 2 ? 6 : 9, 2.7, { o: 0.34, i: 1, j: k })
      const feito = k < 2
        ? [
            ...reta(86, y + 2, 96, y + 14, 3, 3.3, { tipo: 'acento', i: 2, j: k }),
            ...reta(96, y + 14, 114, y - 12, 4, 3.4, { tipo: 'acento', i: 2, j: k })
          ]
        : reta(168, y, 108, y, 4, 3.6, { tipo: 'acento', i: 2, j: 4 })
      return [...caixa, ...linha, ...feito]
    })
    const avanco = [
      ...reta(300, 352, 400, 352, 7, 3.2, { tipo: 'acento', i: 3 }),
      { x: 392, y: 340, r: 3.2, o: 1, tipo: 'acento', i: 3, j: 8 },
      { x: 392, y: 364, r: 3.2, o: 1, tipo: 'acento', i: 3, j: 9 }
    ]
    return { pontos: [...itens, ...avanco] }
  },

  /* acompanhamento: indicador subindo, último ponto em destaque */
  '04': () => {
    const xs = [104, 152, 200, 248, 296, 344, 392]
    const ys = [282, 266, 274, 236, 218, 170, 126]
    const pontos = [
      ...reta(70, 322, 418, 322, 21, 1.8, { o: 0.32, i: 0 }),
      ...reta(70, 100, 70, 304, 12, 1.8, { o: 0.32, i: 0 })
    ]
    xs.forEach((x, k) => {
      if (k > 0) {
        reta(xs[k - 1], ys[k - 1], x, ys[k], 5, 1.7, { o: 0.55, i: 1 + k * 0.35, j: 0 })
          .slice(1, -1)
          .forEach((p) => pontos.push(p))
      }
      const ultimo = k === xs.length - 1
      pontos.push({ x, y: ys[k], r: ultimo ? 9 : 5, o: ultimo ? 1 : 0.8, tipo: ultimo ? 'acento' : 'base', i: 1 + k * 0.35, j: 1 })
    })
    arco(xs[6], ys[6], 22, 12, 2.2, 0, 360, { tipo: 'acento', o: 0.8, i: 4 }).forEach((p) => pontos.push(p))
    return { pontos }
  }
}

export function emblemaEtapa(no) {
  const fabricar = ETAPAS[no]
  return fabricar ? fabricar() : { pontos: [] }
}
