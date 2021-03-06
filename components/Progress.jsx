import { useState } from 'react'
import styles from 'styles/Progress.module.css'
import { toPercentage } from 'components/NumberPercentage.jsx'
import { useLocale } from 'hooks/useLocale'

const FILTERS = {
  parcial: 'porcentajePrimeraDosis',
  completa: 'porcentajeSegundaDosis'
}

export default function Progress ({ totals }) {
  const { locale } = useLocale()
  const [filter, setFilter] = useState(FILTERS.parcial)
  const value = totals[filter]

  return (
    <>
      <form className={styles.progress}>
        <div>
          <label>
            <input
              checked={filter === FILTERS.parcial}
              onChange={() => setFilter(FILTERS.parcial)}
              type='radio'
              name='filter'
            />
            Ver población con primera dosis
          </label>
          <label>
            <input
              checked={filter === FILTERS.completa}
              name='filter'
              onChange={() => setFilter(FILTERS.completa)}
              type='radio'
            />
            Ver población con pauta completa
          </label>
        </div>

        <section data-value={toPercentage({ locale, number: value })}>
          <progress max='100' value={value * 100} />
        </section>
      </form>
    </>
  )
}
