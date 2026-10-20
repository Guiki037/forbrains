/** CTA pill com efeito text-roll no hover (duplica o texto e desliza). */
export default function CtaButton({ href = '#contact', children, tone = 'brand', className = '' }) {
  return (
    <a className={`ctapill ctapill-${tone} ${className}`} href={href}>
      <span className="roll">
        <span className="rolltrack">
          <span className="rollline">{children}</span>
          <span className="rollline" aria-hidden="true">{children}</span>
        </span>
      </span>
      <span className="ctaarrow" aria-hidden="true">→</span>
    </a>
  )
}
