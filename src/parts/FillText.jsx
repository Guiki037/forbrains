import { Fragment } from 'react'

const normalizar = (palavra) => palavra.toLowerCase().replace(/[.,;:!?()"“”]/g, '')

/**
 * Quebra um texto em palavras para o efeito 04 (texto que se preenche).
 * Cada palavra vira um <span data-palavra>; os espaços continuam sendo texto,
 * então a quebra de linha e a leitura por leitor de tela ficam naturais.
 * `destaques` recebe palavras que acendem na cor de destaque.
 */
export default function FillText({ text, destaques = [] }) {
  const alvo = new Set(destaques.map(normalizar))
  const partes = String(text).trim().split(/\s+/)

  return partes.map((palavra, i) => (
    <Fragment key={`${palavra}-${i}`}>
      <span data-palavra className={alvo.has(normalizar(palavra)) ? 'is-destaque' : undefined}>
        {palavra}
      </span>
      {i < partes.length - 1 ? ' ' : null}
    </Fragment>
  ))
}
