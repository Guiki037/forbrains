import { useId, useMemo } from 'react'
import { anelLogo, partidas } from '../../lib/dots.js'
import { useArteEntrada } from '../../hooks/useArteEntrada.js'
import { useGiro } from '../../hooks/useGiro.js'
import { PALETAS } from './Arte.jsx'

/**
 * O anel do logotipo como elemento decorativo: monta ao entrar na tela e
 * gira com a rolagem da seção (--giro). Usado no manifesto e no diagnóstico.
 */
export default function AnelArte({ className = '', tema = 'noite', semente = 9, giro = true }) {
  const id = `r${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const entradaRef = useArteEntrada({ limiar: 0.1 })
  const giroRef = useGiro()
  const pontos = useMemo(() => partidas(anelLogo(300, 300, 270), 300, 300, semente, [60, 160]), [semente])
  const acento = (PALETAS[tema] || PALETAS.noite).acento

  const refs = (el) => {
    entradaRef.current = el
    if (giro) giroRef.current = el
  }

  return (
    <svg ref={refs} className={`arte anel-arte ${className}`} viewBox="0 0 600 600" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="165" y1="0" x2="435" y2="0">
          {acento.map((cor, k) => (
            <stop key={cor + k} offset={acento.length === 1 ? 0 : k / (acento.length - 1)} stopColor={cor} />
          ))}
        </linearGradient>
      </defs>
      <g className="anel-arte__g">
        {pontos.map((p, k) => (
          <circle
            key={k}
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
