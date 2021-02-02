import { useLocale } from 'hooks/useLocale.js'
//import getNewReports from "scripts/get-lasts-reports";

 const { population } = require('../public/data/bbdd.json')
 const dataLatest = require('../public/data/latest.json')
const MILISECONDS_DAY = 1000 * 60 * 60 * 24
const dateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

const getDaysFromStartVaccination = () => {
  return (new Date().getTime() - new Date(START_DATA_VACCINATION).getTime()) / MILISECONDS_DAY
}

function getTotalPopulationToBeVaccinated(filter) {
  const populationJurisdiccionNombre = population[filter]
  const vaccinatedPopuplation = dataLatest.find(({ jurisdiccionNombre }) => jurisdiccionNombre === filter)
  const totalPopulationToBeVaccinated = populationJurisdiccionNombre - vaccinatedPopuplation.segundaDosisCantidad
  return totalPopulationToBeVaccinated
}

function getMedia(newReports) {
  
  //const newReports = getNewReports(filter,reports)
  
  const reducer = (accumulator, currentValue) => accumulator.completos + currentValue.completos
  const suma = newReports.reduce(reducer)
  const mediaOfLastsDays = suma / newReports.length

  return mediaOfLastsDays
}

function prevision(filter,percentage,newReports) {
  const mediaOfLastsDays = getMedia(newReports)
  const totalPopulationToBeVaccinated = getTotalPopulationToBeVaccinated(filter) * percentage/100
  const ahora = new Date().getTime() 
  const previsionCalculada = (ahora - new Date(((totalPopulationToBeVaccinated / mediaOfLastsDays)* MILISECONDS_DAY)))
  console.log('previons en dias calculada: ' + previsionCalculada)
  console.log('media: ' +mediaOfLastsDays+' total vacunados: ' + totalPopulationToBeVaccinated)
  console.log('Ahora: '+ahora)
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

  // const newReports = getLastsDays(data)
 console.log('Prevision Viendo totals de  '+totals.jurisdiccionNombre)
  //const getDays = days => getDaysToAchievePercentage(days, totals.porcentajeSegundaDosis)

  return (
    <>
      <h2>Estimación población vacunada</h2>
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
          justify-items: center;
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
        }
    `}
      </style>
    </>
  )
}
