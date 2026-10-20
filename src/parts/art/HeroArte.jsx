import { useId, useMemo } from 'react'
import { anelLogo, partidas, sorteio } from '../../lib/dots.js'
import { useArteEntrada } from '../../hooks/useArteEntrada.js'
import { useGiro } from '../../hooks/useGiro.js'
import { PALETAS } from './Arte.jsx'

const C = 300

/* rede de pessoas dentro do anel: nós com semente e ligações aos vizinhos */
function montarRede() {
  const rand = sorteio(23)
  const nos = []
  let tentativas = 0
  while (nos.length < 15 && tentativas < 2000) {
    tentativas += 1
    const a = rand() * Math.PI * 2
    const d = Math.sqrt(rand()) * 148
    const x = C + Math.cos(a) * d
    const y = C + Math.sin(a) * d
    if (nos.some((n) => Math.hypot(n.x - x, n.y - y) < 46)) continue
    nos.push({ x, y })
  }
  const lideres = new Set([0, 4, 9])
  const pontos = nos.map((n, k) => ({
    x: n.x,
    y: n.y,
    r: lideres.has(k) ? 8 : 3.4 + rand() * 2,
    o: lideres.has(k) ? 1 : 0.9,
    tipo: lideres.has(k) ? 'acento' : 'base',
    i: 6,
    j: k
  }))
  const chaves = new Set()
  const linhas = []
  nos.forEach((n, k) => {
    nos
      .map((m, q) => ({ q, d: Math.hypot(m.x - n.x, m.y - n.y) }))
      .filter((v) => v.q !== k)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
      .forEach(({ q }) => {
        const chave = k < q ? `${k}-${q}` : `${q}-${k}`
        if (chaves.has(chave)) return
        chaves.add(chave)
        linhas.push({ x1: n.x, y1: n.y, x2: nos[q].x, y2: nos[q].y, i: 7, j: linhas.length })
      })
  })
  return { pontos, linhas }
}

/**
 * Hero: o anel do logotipo se monta a partir de pontos soltos e, dentro
 * dele, uma rede de pessoas se conecta. Na rolagem, o anel gira devagar
 * e a rede gira no sentido contrário (profundidade).
 */
export default function HeroArte() {
  const id = `h${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const entradaRef = useArteEntrada({ limiar: 0.05 })
  const giroRef = useGiro({ modo: 'saida' })
  const anel = useMemo(() => partidas(anelLogo(C, C, 262, { i: 0 }), C, C, 3, [90, 220]), [])
  const rede = useMemo(montarRede, [])
  const acento = PALETAS.noite.acento

  const refs = (el) => {
    entradaRef.current = el
    giroRef.current = el
  }

  return (
    <svg ref={refs} className="arte hero-arte" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="170" y1="0" x2="430" y2="0">
          {acento.map((cor, k) => (
            <stop key={cor} offset={k / (acento.length - 1)} stopColor={cor} />
          ))}
        </linearGradient>
        <radialGradient id={`${id}b`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#4f8fd6" stopOpacity=".34" />
          <stop offset="1" stopColor="#4f8fd6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle className="hero-arte__luz" cx={C} cy={C} r="220" fill={`url(#${id}b)`} />

      <g className="hero-arte__rede">
        {rede.linhas.map((l, k) => (
          <line
            key={`l${k}`}
            data-l
            x1={l.x1.toFixed(1)}
            y1={l.y1.toFixed(1)}
            x2={l.x2.toFixed(1)}
            y2={l.y2.toFixed(1)}
            pathLength="1"
            stroke="#ffffff"
            strokeOpacity=".22"
            strokeWidth="1.3"
            style={{ '--i': l.i, '--j': l.j }}
          />
        ))}
        {rede.pontos.map((p, k) => (
          <circle
            key={`n${k}`}
            data-p
            cx={p.x.toFixed(1)}
            cy={p.y.toFixed(1)}
            r={p.r.toFixed(2)}
            fill={p.tipo === 'acento' ? '#ff5ca8' : '#ffffff'}
            fillOpacity={p.o}
            style={{ '--i': p.i, '--j': p.j }}
          />
        ))}
      </g>

      <g className="hero-arte__anel">
        {anel.map((p, k) => (
          <circle
            key={`a${k}`}
            data-p
            cx={p.x.toFixed(1)}
            cy={p.y.toFixed(1)}
            r={p.r.toFixed(2)}
            fill={`url(#${id})`}
            style={{ '--i': 0, '--j': k, '--dx': `${p.dx.toFixed(1)}px`, '--dy': `${p.dy.toFixed(1)}px` }}
          />
        ))}
      </g>
    </svg>
  )
}
