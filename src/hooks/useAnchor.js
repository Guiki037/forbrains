import { useEffect, useState } from 'react'

/* âncoras da página: #secao ou #/secao (links antigos) levam à seção */
const parse = () => window.location.hash.replace(/^#\/?/, '')

/** Âncora atual da URL; muda quando a pessoa usa um link interno. */
export function useAnchor() {
  const [anchor, setAnchor] = useState(() => (typeof window === 'undefined' ? '' : parse()))

  useEffect(() => {
    const onHash = () => setAnchor(parse())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return anchor
}
