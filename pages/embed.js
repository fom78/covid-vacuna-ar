import styles from 'styles/Embed.module.css'

import NumberDigits from 'components/NumberDigits'
import NumberPercentage from 'components/NumberPercentage.jsx'
import TimeAgo from 'components/TimeAgo'

export default function Embed ({ data, info, totalPopulation }) {
  const totals = data.find(({ jurisdiccionNombre }) => jurisdiccionNombre === 'Totales')

  return (
    <>
      <section className={styles.embedWrapper}>
        <div className={styles.embedContainer}>

          <div className={styles.card}>
            <img
              className={styles.cardImage}
              src='/mapa.png'
              alt='Dosis de la vacuna en Argentina'
              width={150}
              height={150}
            />
            <section>
              <div>
                <h3>Dosis distribuidas:</h3>
                <p>
                  <NumberDigits>{totals.primeraDosisCantidad+totals.segundaDosisCantidad}</NumberDigits>
                </p>
              </div>
              <p>Es el <strong><NumberPercentage>{totals.primeraDosisCantidad+totals.segundaDosisCantidad / totalPopulation}</NumberPercentage></strong> del total de Argentina</p>
            </section>
          </div>

          <div className={styles.card}>
            <img
              src='/vacuna.png'
              alt='Primera dosis de la Vacuna en Argentina'
              width={150}
              height={150}
            />
            <section>
              <div>
                <h3>Dosis administradas:</h3>
                <p>
                  <NumberDigits>{totals.primeraDosisCantidad}</NumberDigits>
                </p>
              </div>
              <p>
                Personas que han recibido la primer dosis de la vacuna.<br />
                Suponen un <strong><NumberPercentage>{totals.primeraDosisCantidad / (totals.primeraDosisCantidad + totals.segundaDosisCantidad)}</NumberPercentage></strong> de las dosis distribuidas.<br />Supone el <strong><NumberPercentage>{totals.primeraDosisCantidad / totalPopulation}</NumberPercentage></strong> del total de Argentina
              </p>
            </section>
          </div>

          <div className={styles.card}>
            <img
              src='/vacunas-completas.png'
              alt='Dosis completas suministradas'
              width={150}
              height={150}
            />
            <section>
              <div>
                <h3>Pauta completa:</h3>
                <p>
                  <NumberDigits>{totals.segundaDosisCantidad}</NumberDigits>
                </p>
              </div>
              <p>
                Personas que han recibido las dos dosis de la vacuna.<br />
                Suponen un <strong><NumberPercentage>{totals.segundaDosisCantidad / (totals.primeraDosisCantidad + totals.segundaDosisCantidad)}</NumberPercentage></strong> de las dosis distribuidas.<br />Supone el <strong><NumberPercentage>{totals.segundaDosisCantidad / totalPopulation}</NumberPercentage></strong> del total de Argentina
              </p>
            </section>
          </div>

          <small className={styles.description}>
            <a href='covid-vacuna-ar.vercel.app><strong>covid-vacuna-ar.vercel.app</strong></a> - Datos actualizados <TimeAgo timestamp={info.lastModified} />.
          </small>

        </div>
      </section>
    </>
  )
}

export async function getStaticProps () {
  const data = require('../public/data/latest.json')
  const info = require('../public/data/info.json')
  const { population: { Totales } } = require('../public/data/bbdd.json')

  return {
    props: {
      data,
      info,
      totalPopulation: Totales
    }
  }
}
