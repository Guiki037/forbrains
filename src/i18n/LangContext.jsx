import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const LangContext = createContext({ lang: 'pt', setLang: () => {}, t: (value) => value })

/**
 * Site monolíngue em português. Os dados guardam objetos { pt } ou valores
 * simples; t() resolve ambos. Funções (ex.: (n) => texto) são repassadas.
 */
export function LangProvider({ children }) {
  const [lang] = useState('pt')

  useEffect(() => {
    document.documentElement.lang = 'pt-BR'
    document.documentElement.dataset.lang = 'pt'
  }, [])

  const t = useCallback((value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value.pt ?? value.zh ?? value.en ?? ''
    }
    return value
  }, [])

  const value = useMemo(() => ({ lang, setLang: () => {}, t }), [t])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
