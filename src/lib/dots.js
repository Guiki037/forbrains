/**
 * Geometria do sistema visual da marca: tudo é feito de pontos, como o anel
 * do logotipo Forbrains. Cada função devolve uma lista de pontos
 * { x, y, r, o, tipo, i, j } que o componente <Arte> desenha em SVG.
 *
 *   r     raio do ponto
 *   o     opacidade própria (fill-opacity)
 *   tipo  'base' (estrutura, cor neutra) ou 'acento' (degradê da marca)
 *   i     grupo na ordem de entrada da animação
 *   j     posição dentro do grupo (atraso fino da entrada)
 */

/* Anel do logotipo medido no PNG oficial: 36 pontos [x, y, raio],
   normalizados para um círculo de raio 1 centrado na origem. */
export const ANEL_LOGO = [
  [-0.8241, -0.1921, 0.1416],
  [-0.5651, -0.2031, 0.0331],
  [-0.5187, -0.3584, 0.0494],
  [-0.7477, -0.5309, 0.1185],
  [-0.5662, -0.7724, 0.079],
  [-0.3862, -0.5628, 0.0805],
  [-0.3669, -0.9139, 0.0498],
  [-0.2136, -0.9608, 0.0332],
  [-0.1473, -0.7438, 0.1152],
  [0.1988, -0.8179, 0.1415],
  [0.2082, -0.5714, 0.0333],
  [0.364, -0.5252, 0.0495],
  [0.5376, -0.7414, 0.1186],
  [0.7786, -0.5603, 0.0791],
  [0.5682, -0.3927, 0.0804],
  [0.9205, -0.3606, 0.0495],
  [0.9669, -0.2078, 0.0331],
  [0.7493, -0.1536, 0.1153],
  [0.8235, 0.1921, 0.1416],
  [0.5652, 0.1993, 0.0332],
  [0.519, 0.355, 0.0495],
  [0.7468, 0.531, 0.1186],
  [0.5661, 0.7727, 0.0791],
  [0.3866, 0.5591, 0.0802],
  [0.3662, 0.914, 0.0499],
  [0.2134, 0.9608, 0.0332],
  [0.1476, 0.7404, 0.1153],
  [-0.1982, 0.8146, 0.1416],
  [-0.2088, 0.5713, 0.0331],
  [-0.3644, 0.5252, 0.0496],
  [-0.5371, 0.738, 0.1185],
  [-0.7787, 0.5568, 0.0792],
  [-0.5689, 0.3929, 0.0804],
  [-0.9201, 0.3573, 0.0499],
  [-0.9667, 0.2042, 0.0333],
  [-0.7501, 0.1538, 0.1152]
]

const RAD = Math.PI / 180

/** Gerador pseudoaleatório com semente: o desenho é sempre o mesmo. */
export function sorteio(semente) {
  let a = semente >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const ponto = (x, y, r, extra = {}) => ({ x, y, r, o: 1, tipo: 'base', i: 0, j: 0, ...extra })

/** O anel do logotipo em (cx, cy) com raio R. */
export function anelLogo(cx, cy, R, extra = {}) {
  return ANEL_LOGO.map(([x, y, r], j) =>
    ponto(cx + x * R, cy + y * R, r * R, { tipo: 'acento', j, ...extra })
  )
}

/** n pontos num arco (graus, 0 = direita, 90 = baixo). */
export function arco(cx, cy, raio, n, r, de = 0, ate = 360, extra = {}) {
  const fechado = Math.abs(ate - de) >= 360
  const passos = fechado ? n : Math.max(1, n - 1)
  return Array.from({ length: n }, (_, j) => {
    const a = (de + ((ate - de) * j) / passos) * RAD
    return ponto(cx + Math.cos(a) * raio, cy + Math.sin(a) * raio, r, { j, ...extra })
  })
}

/** n pontos numa reta. */
export function reta(x1, y1, x2, y2, n, r, extra = {}) {
  return Array.from({ length: n }, (_, j) => {
    const t = n === 1 ? 0 : j / (n - 1)
    return ponto(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, r, { j, ...extra })
  })
}

/** Grade de pontos. */
export function grade(x0, y0, colunas, linhas, passo, r, extra = {}) {
  const pts = []
  for (let c = 0; c < colunas; c += 1) {
    for (let l = 0; l < linhas; l += 1) {
      pts.push(ponto(x0 + c * passo, y0 + l * passo, r, { j: c, ...extra }))
    }
  }
  return pts
}

/** Pontos distribuídos ao longo do contorno de um polígono fechado. */
export function contorno(vertices, espaco, r, extra = {}) {
  const pts = []
  let j = 0
  vertices.forEach(([x1, y1], k) => {
    const [x2, y2] = vertices[(k + 1) % vertices.length]
    const comprimento = Math.hypot(x2 - x1, y2 - y1)
    const n = Math.max(1, Math.round(comprimento / espaco))
    for (let s = 0; s < n; s += 1) {
      const t = s / n
      pts.push(ponto(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, r, { j: j++, ...extra }))
    }
  })
  return pts
}

/** Retângulo de cantos arredondados como contorno de pontos. */
export function retanguloArredondado(x, y, w, h, raio, espaco, r, extra = {}) {
  const pts = []
  const segmentos = [
    [x + raio, y, x + w - raio, y],
    [x + w, y + raio, x + w, y + h - raio],
    [x + w - raio, y + h, x + raio, y + h],
    [x, y + h - raio, x, y + raio]
  ]
  const cantos = [
    [x + w - raio, y + raio, -90, 0],
    [x + w - raio, y + h - raio, 0, 90],
    [x + raio, y + h - raio, 90, 180],
    [x + raio, y + raio, 180, 270]
  ]
  let j = 0
  segmentos.forEach(([x1, y1, x2, y2], k) => {
    const n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / espaco))
    for (let s = 0; s < n; s += 1) {
      const t = s / n
      pts.push(ponto(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, r, { j: j++, ...extra }))
    }
    const [cx, cy, de, ate] = cantos[k]
    const nc = Math.max(1, Math.round((Math.PI * raio) / 2 / espaco))
    for (let s = 0; s < nc; s += 1) {
      const a = (de + ((ate - de) * s) / nc) * RAD
      pts.push(ponto(cx + Math.cos(a) * raio, cy + Math.sin(a) * raio, r, { j: j++, ...extra }))
    }
  })
  return pts
}

/** Pontos espalhados com semente dentro de uma caixa, evitando um círculo. */
export function espalhar(semente, n, [x0, y0, x1, y1], rMin, rMax, extra = {}, evitar = null) {
  const rand = sorteio(semente)
  const pts = []
  let tentativas = 0
  while (pts.length < n && tentativas < n * 60) {
    tentativas += 1
    const x = x0 + rand() * (x1 - x0)
    const y = y0 + rand() * (y1 - y0)
    if (evitar && Math.hypot(x - evitar[0], y - evitar[1]) < evitar[2]) continue
    if (pts.some((p) => Math.hypot(p.x - x, p.y - y) < rMax * 3.2)) continue
    pts.push(ponto(x, y, rMin + rand() * (rMax - rMin), { j: pts.length, ...extra }))
  }
  return pts
}

/** Ponto numa curva de Bézier cúbica. */
export function bezier(p0, p1, p2, p3, t) {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]
  ]
}

/**
 * Deslocamento de partida para a montagem: cada ponto vem de fora, na
 * direção oposta ao centro, com variação de distância.
 */
export function partidas(pontos, cx, cy, semente, distancia = [60, 160]) {
  const rand = sorteio(semente)
  return pontos.map((p) => {
    const ang = Math.atan2(p.y - cy, p.x - cx) + (rand() - 0.5) * 0.9
    const d = distancia[0] + rand() * (distancia[1] - distancia[0])
    return { ...p, dx: Math.cos(ang) * d, dy: Math.sin(ang) * d }
  })
}
