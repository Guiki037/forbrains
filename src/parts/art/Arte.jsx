import { forwardRef, useId } from 'react'
import { useArteEntrada } from '../../hooks/useArteEntrada.js'

/** Cores de cada superfície. O acento é sempre um degradê da esquerda para a direita. */
export const PALETAS = {
  /* fundo azul-noite: o degradê do próprio logotipo */
  noite: { base: '#ffffff', acento: ['#1dd4fd', '#6a9af1', '#b457e2', '#f317d5'] },
  /* fundo claro */
  claro: { base: '#0a2140', acento: ['#15579b', '#7a2fa0', '#c80068'] },
  /* fundo rosa claro */
  rosa: { base: '#c80068', acento: ['#0d2c52', '#7a2fa0', '#c80068'] },
  /* fundo rosa forte */
  vivo: { base: '#ffffff', acento: ['#ffffff', '#ffd1e6'] }
}

/**
 * Desenha um emblema de pontos em SVG. Decorativo: o texto ao lado já diz
 * o que a imagem representa, então ela fica fora da leitura de tela.
 */
const Desenho = forwardRef(function Desenho({ emblema, largura, altura, tema = 'noite', className = '', children }, ref) {
  const id = `g${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const paleta = PALETAS[tema] || PALETAS.noite
  const { pontos = [], linhas = [] } = emblema

  return (
    <svg
      ref={ref}
      className={`arte ${className}`}
      viewBox={`0 0 ${largura} ${altura}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={largura * 0.12} y1="0" x2={largura * 0.88} y2="0">
          {paleta.acento.map((cor, k) => (
            <stop key={cor + k} offset={paleta.acento.length === 1 ? 0 : k / (paleta.acento.length - 1)} stopColor={cor} />
          ))}
        </linearGradient>
      </defs>
      {children}
      {linhas.map((l, k) => (
        <line
          key={`l${k}`}
          data-l
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          pathLength="1"
          stroke={paleta.base}
          strokeOpacity={l.o ?? 0.2}
          strokeWidth={l.w ?? 1.2}
          style={{ '--i': l.i ?? 0, '--j': l.j ?? 0 }}
        />
      ))}
      {pontos.map((p, k) => (
        <circle
          key={k}
          data-p
          data-i={Math.floor(Number(p.i ?? 0))}
          cx={p.x.toFixed(1)}
          cy={p.y.toFixed(1)}
          r={p.r.toFixed(2)}
          fill={p.tipo === 'acento' ? `url(#${id})` : paleta.base}
          fillOpacity={p.o ?? 1}
          style={{
            '--i': p.i ?? 0,
            '--j': p.j ?? 0,
            '--ox': Number(p.x).toFixed(1),
            '--oy': Number(p.y).toFixed(1),
            ...(p.dx ? { '--dx': `${p.dx.toFixed(1)}px`, '--dy': `${p.dy.toFixed(1)}px` } : null)
          }}
        />
      ))}
    </svg>
  )
})

/** Emblema com motion de entrada (monta quando entra na tela). */
export default function Arte(props) {
  const ref = useArteEntrada()
  return <Desenho ref={ref} {...props} />
}

export { Desenho }
