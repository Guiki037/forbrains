import { notes } from '../data/notes.js'
import { useStaggerReveal } from '../hooks/useGsapFx.jsx'
import { useLang } from '../i18n/LangContext.jsx'

/** Diagnóstico: os seis desafios, numerados, todos visíveis de uma vez. */
export default function Notes({ chapter }) {
  const { t } = useLang()
  const gridRef = useStaggerReveal('[data-stagger]', { y: 16 })

  return (
    <section className="lp-section lp-challenges" id={chapter.id} aria-labelledby="challenges-title">
      <div className="shell">
        <header className="lp-head">
          <h2 className="lp-title" id="challenges-title">{t(chapter.title)}</h2>
        </header>

        <ol className="lp-challenges__grid" ref={gridRef}>
          {notes.map((note) => (
            <li className="lp-challenge" key={note.id} data-stagger>
              <span className="lp-challenge__no" aria-hidden="true">{note.date}</span>
              <h3 className="lp-challenge__title">{t(note.title)}</h3>
              <p className="lp-challenge__body">{t(note.body)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
