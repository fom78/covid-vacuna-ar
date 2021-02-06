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

function getMedia(newReports,filter) {
  
  let vacunadosCompletos = 0
  let base = 0
  for (let i = 0; i < newReports.length; i++) {
    const element = newReports[i]
    const jurisdiccionActual = element.find(({ jurisdiccionNombre }) => jurisdiccionNombre === filter)
    if (i===0) {
      base = jurisdiccionActual.segundaDosisCantidad
    } else {
      vacunadosCompletos = vacunadosCompletos + jurisdiccionActual.segundaDosisCantidad - base
      base = jurisdiccionActual.segundaDosisCantidad
    
    }
  }
  
  const mediaOfLastsDays = vacunadosCompletos / 7 // la media es en la semana
  return mediaOfLastsDays
}

function prevision(filter,percentage,newReports) {
  const mediaOfLastsDays = getMedia(newReports,filter)
  const totalPopulationToBeVaccinated = getTotalPopulationToBeVaccinated(filter) * percentage/100
  const daysToComplete = parseInt((totalPopulationToBeVaccinated / mediaOfLastsDays))
  
  const ahora = new Date()
  const previsionCalculada = ahora.setDate(ahora.getDate() + daysToComplete)
 
  return new Date(previsionCalculada)

}


const points = [{
  color: '#dd8f01',
  percentage: 50
}, {
  color: '#a3dd01',
  percentage: 75
}, {
  color: '#41ca0d',
  percentage: 100
}]

export default function Progress ({ data, totals }) {
  const { locale } = useLocale()
  const intl = new Intl.DateTimeFormat(locale, dateTimeFormatOptions)


  return (
    <>
      <h2>Estimación población vacunada</h2>
      <small>Se toma en cuenta la media de los ultimos 7 dias.</small>
      {totals.porcentajeSegundaDosis
        ? (
          <section>
            {
          points.map(({ color, percentage }) => (
            <div className='card' key={percentage}>
              <span style={{ '--color': color }}>{percentage}%</span>
              <time>{intl.format(prevision(totals.jurisdiccionNombre,percentage,data))}</time>
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
            background: #fff;
          }

          div time {
            color: #333;
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
            background: #ffffff;
            border-radius: 8px;
            border: 2px solid #111;
            margin: 1rem 0 0;
            padding: 1rem 1.5rem 1.5rem;
            text-align: center;
            box-shadow: rgb(210,239,253) 14px 14px;
            }
            label {
              font-weight: 500;
              line-height: 150%;
              margin-right: 1rem;
              display: flex;
              align-items: center;
              border-radius: 10px;
              cursor: pointer;
              padding: 6px;
            }

            label:hover {
              background-color: #d2effd;
            }

            label input[type="checkbox"] {
              appearance: none;
              background: #ffffff;
              border: 2px solid #111;
              border-radius: 500%;
              box-shadow: rgb(210, 239, 253) 4px 4px;
              margin-right: 8px;
              padding: 6px;
              outline: 0;
            }
            label input[type="checkbox"]:checked {
              background: radial-gradient(currentcolor 50%, rgba(255, 0, 0, 0) 51%);
            }
          }
      `}
      </style>
    </>
  )
}
