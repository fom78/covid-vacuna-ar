import { useLocale } from 'hooks/useLocale.js'

const { population } = require('public/data/bbdd.json')
const dataLatest = require('public/data/latest.json')
const dateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

function getTotalPopulationToBeVaccinated(filter) {
  const populationJurisdiccionNombre = population[filter]
  const vaccinatedPopuplation = dataLatest.find(({ jurisdiccionNombre }) => jurisdiccionNombre === filter)
  const totalPopulationToBeVaccinated = populationJurisdiccionNombre - vaccinatedPopuplation.segundaDosisCantidad
  return totalPopulationToBeVaccinated
}

function getMedia(newReports, filter) {

  let vacunadosCompletos = 0
  let base = 0
  for (let i = 0; i < newReports.length; i++) {
    const element = newReports[i]
    const jurisdiccionActual = element.find(({ jurisdiccionNombre }) => jurisdiccionNombre === filter)
    if (i === 0) {
      base = jurisdiccionActual.segundaDosisCantidad
    } else {
      vacunadosCompletos = vacunadosCompletos + jurisdiccionActual.segundaDosisCantidad - base
      base = jurisdiccionActual.segundaDosisCantidad

    }
  }

  const mediaOfLastsDays = vacunadosCompletos / 7 // la media es en la semana
  return mediaOfLastsDays
}

function prevision(filter, percentage, newReports) {
  const mediaOfLastsDays = getMedia(newReports, filter)
  const totalPopulationToBeVaccinated = getTotalPopulationToBeVaccinated(filter) * percentage / 100
  const daysToComplete = parseInt((totalPopulationToBeVaccinated / mediaOfLastsDays))

  const ahora = new Date()
  const previsionCalculada = ahora.setDate(ahora.getDate() + daysToComplete)

  return new Date(previsionCalculada)

}

export default function Progress({ data, totals }) {
  const { locale } = useLocale()
  const intl = new Intl.DateTimeFormat(locale, dateTimeFormatOptions)

  const points = [
    {
      color: '#dd8f01',
      percentage: 50,
      show: (totals.porcentajeSegundaDosis >= 0.50) ? false : true
    },
    {
      color: '#a3dd01',
      percentage: 75,
      show: (totals.porcentajeSegundaDosis >= 0.75) ? false : true
    },
    {
      color: '#41ca0d',
      percentage: 100,
      show: (totals.porcentajeSegundaDosis >= 1) ? false : true
    }]

  return (
    <>
      <h2>Estimación población vacunada</h2>
      <small>Se toma en cuenta la media de los ultimos 7 dias.</small>
      {totals.porcentajeSegundaDosis
        ? (
          <section>
            {
              points.map(({ color, percentage,show }) => (
                show &&
                <div className='card' key={percentage}>
                  <span style={{ '--color': color }}>{percentage}%</span>
                  <time>{intl.format(prevision(totals.jurisdiccionNombre, percentage, data))}</time>
                  {data.jurisdiccionNombre}
                </div>
              ))
            }
          </section>)
        : (
          <p>
            <b>No disponemos de datos para esa fecha.</b>
          </p>
        )}

      <style jsx>{`
        section {
          align-items: center;
          display: flex;
          display: grid;
          gap: 32px;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          justify-content: center;
          place-content: center;
          margin-bottom: 4rem;
          max-width: 1000px;
          place-content: center;
          width: 100%;
        }

        div {
          display: flex;
          flex-direction: column;
        }

        div span, div time {
          background: var(--app-background-color);
        }

        div time {
          color: var(--text-secondary-color);
          font-size: .9rem;
          font-weight: 500;
          margin-top: .7rem;
        }

        div span {
          color: var(--color);
          font-size: 5ch;
          font-weight: 500;
        }
        
        .card {
          background: var(--app-background-color);
          border-radius: 8px;
          border: 2px solid var(--app-border-color);
          margin: 1rem 0 0;
          padding: 1rem 1.5rem 1.5rem;
          text-align: center;
          box-shadow: var(--app-shadow-color) 14px 14px;
          }
        }
    `}
      </style>
    </>
  )
}
