import { arco, bezier, contorno, espalhar, grade, reta, retanguloArredondado, sorteio } from '../../lib/dots.js'

/**
 * Emblemas de pontos que substituem as fotos.
 * Soluções: caixa 320 × 240. Etapas da metodologia: caixa 480 × 400.
 * Cada emblema devolve { pontos, linhas }; linhas são opcionais.
 */

const comGrupo = (lista, extra) => lista.map((p) => ({ ...p, ...extra }))

/* ────────────────────────── soluções (320 × 240) ────────────────────────── */

const SOLUCOES = {
  /* facilitador ao centro, ondas de fala e a turma em arco */
  'workshop-comunicacao': () => ({
    pontos: [
      ...comGrupo([{ x: 160, y: 84, r: 11, j: 0 }], { tipo: 'acento', o: 1, i: 0 }),
      ...arco(160, 84, 27, 7, 2.4, 205, 335, { o: 0.75, i: 1 }),
      ...arco(160, 84, 42, 9, 2.4, 210, 330, { o: 0.45, i: 2 }),
      ...arco(160, 84, 92, 9, 6.5, 22, 158, { tipo: 'acento', i: 3 })
    ]
  }),

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

  /* palestra: refletor, palestrante no palco e plateia */
  'palestras-focadas': () => {
    const rand = sorteio(11)
    const cone = []
    for (let linha = 0; linha < 9; linha += 1) {
      const y = 44 + linha * 12
      const meia = 8 + linha * 7.4
      const n = 2 + linha
      for (let k = 0; k < n; k += 1) {
        const x = 160 - meia + (2 * meia * (k + 0.5 + (rand() - 0.5) * 0.4)) / n
        cone.push({ x, y, r: 1.7 + linha * 0.06, o: 0.14 + linha * 0.035, tipo: 'base', i: 1, j: linha })
      }
    }
    return {
      pontos: [
        { x: 160, y: 30, r: 5.5, o: 1, tipo: 'acento', i: 0, j: 0 },
        ...cone,
        { x: 160, y: 150, r: 10, o: 1, tipo: 'acento', i: 2, j: 0 },
        ...reta(72, 170, 248, 170, 15, 1.8, { o: 0.5, i: 2 }),
        ...reta(84, 198, 236, 198, 9, 5, { tipo: 'acento', i: 3 }),
        ...reta(94, 218, 226, 218, 8, 3.6, { o: 0.38, i: 3 })
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

  /* customização: pontos soltos se organizam numa forma sob medida */
  '02': () => {
    const soltos = espalhar(5, 20, [44, 86, 196, 318], 2.2, 4.2, { o: 0.34, i: 0 })
    const flecha = [
      ...reta(212, 202, 262, 202, 5, 2.4, { o: 0.6, i: 1 }),
      { x: 254, y: 192, r: 2.4, o: 0.6, tipo: 'base', i: 1, j: 5 },
      { x: 254, y: 212, r: 2.4, o: 0.6, tipo: 'base', i: 1, j: 6 }
    ]
    const centro = [356, 202]
    const passo = 27
    const colmeia = [{ x: centro[0], y: centro[1], r: 8, o: 1, tipo: 'acento', i: 2, j: 0 }]
    ;[1, 2].forEach((anel) => {
      for (let lado = 0; lado < 6; lado += 1) {
        for (let k = 0; k < anel; k += 1) {
          const a1 = (lado * 60 - 30) * (Math.PI / 180)
          const a2 = ((lado + 1) * 60 - 30) * (Math.PI / 180)
          const x1 = centro[0] + Math.cos(a1) * passo * anel
          const y1 = centro[1] + Math.sin(a1) * passo * anel
          const x2 = centro[0] + Math.cos(a2) * passo * anel
          const y2 = centro[1] + Math.sin(a2) * passo * anel
          const t = k / anel
          colmeia.push({
            x: x1 + (x2 - x1) * t,
            y: y1 + (y2 - y1) * t,
            r: anel === 1 ? 7 : 6,
            o: 1,
            tipo: 'acento',
            i: 2 + anel * 0.6,
            j: lado * anel + k
          })
        }
      }
    })
    return { pontos: [...soltos, ...flecha, ...colmeia] }
  },

  /* execução: o caminho avança e chega ao alvo */
  '03': () => {
    const caminho = []
    const total = 24
    for (let k = 0; k < total; k += 1) {
      const t = k / (total - 1)
      const [x, y] = bezier([64, 326], [170, 120], [262, 372], [366, 122], t)
      const forte = k >= total - 9
      caminho.push({ x, y, r: 2.2 + t * 4, o: forte ? 1 : 0.35 + t * 0.4, tipo: forte ? 'acento' : 'base', i: 0, j: k })
    }
    const alvo = [398, 96]
    return {
      pontos: [
        ...caminho,
        ...arco(alvo[0], alvo[1], 48, 18, 2.2, 0, 360, { o: 0.32, i: 1 }),
        ...arco(alvo[0], alvo[1], 28, 12, 3.4, 0, 360, { tipo: 'acento', i: 2 }),
        { x: alvo[0], y: alvo[1], r: 8, o: 1, tipo: 'acento', i: 3, j: 0 }
      ]
    }
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
