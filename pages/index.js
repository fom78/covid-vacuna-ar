import { useEffect, useMemo, useState } from 'react'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import Footer from 'components/Footer.jsx'
import NumberDigits from 'components/NumberDigits'
import Progress from 'components/Progress.jsx'
import Prevision from 'components/Prevision/Prevision'
import Select from 'components/Select'
import RestoVacunas from 'components/RestoVacunas'
import ScrollToTop from 'components/ScrollToTop'
import Share from 'components/Share.jsx'
import Table from 'components/Table.jsx'
import SchemeColorSwitcher from 'components/SchemeColorSwitcher'
import Vacuna from 'components/Vacuna'

import styles from 'styles/Home.module.css'
import useSearch from 'hooks/useSearchReport'
import TimeAgo from 'components/TimeAgo.jsx'

import ProgressChart from 'components/ProgressChart'
import {
  DosisEntregadasTooltip
} from 'components/ProgressChart/tooltips'
import normalizeChartData from 'components/ProgressChart/utils/normalize-data'
import getNewReports from 'components/Prevision/utils/get-lasts-reports'
import ClientSideComponent from 'components/ClientSideComponent'

import { totalesVacunasPorDosis,totalesVacunas } from 'lib/vacunas'

import ReactGA from 'react-ga'
ReactGA.initialize('UA-192099299-1')

export default function Home ({ data, info, reports, chartDatasets, newReports }) {
  const [filter, setFilter] = useState('Totales')
  const [valueSearch, setValueSearch] = useState('')
  const [clasificacion, setClasificacion] = useState('top')

  const [mostrarTodasLasVacunas, setMostrarTodasLasVacunas] = useState(false)
  const reportFound = useSearch({ valueSearch })

  const totals = useMemo(
    () => reportFound !== undefined ? reportFound.find(({ jurisdiccionNombre }) => jurisdiccionNombre === filter) : data.find(({ jurisdiccionNombre }) => jurisdiccionNombre === filter),
    [data, filter, reportFound]
  )
  useEffect(() => {
    ReactGA.pageview('/')
  }, [])
  useEffect(() => {
    if (mostrarTodasLasVacunas) {
       setClasificacion('totales')
    }else{
      setClasificacion('top')
    }

  }, [mostrarTodasLasVacunas])

  const vacunasPrimeraDosis = totalesVacunasPorDosis(totals.vacunas,"primeraDosis")
  const vacunasSegundaDosis = totalesVacunasPorDosis(totals.vacunas,"segundaDosis")
  const vacunasTotalesDosis=totalesVacunas(vacunasPrimeraDosis,vacunasSegundaDosis)

  return (
    <>
      <Head>
        <link
          rel='alternate icon'
          href='https://covid-vacuna-ar.vercel.app/vacuna.png'
          type='image/png'
        />
        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#d2effd' />

      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Vacunación COVID-19 en {filter === 'Totales' ? 'Argentina' : filter}
          </h1>
          <small className={styles.description}>
            Datos actualizados <TimeAgo timestamp={info.lastModified} />.
            Fuente:{' '}
            <a href='http://datos.salud.gob.ar/dataset/vacunas-contra-covid-19-dosis-aplicadas-en-la-republica-argentina/archivo/b4684dd9-3cb7-45f7-9c0e-086550013e22'>
              Datos Abiertos del Ministerio de Salud
            </a>
          </small>

          <Select data={reports} onChange={setValueSearch} />
          
          <RestoVacunas mostrar={mostrarTodasLasVacunas} onClick={setMostrarTodasLasVacunas}>Ver Todas</RestoVacunas>

          <div className={styles.grid}>
            <div className={styles.card}>
              <header>
                <Image
                  className={styles.cardImage}
                  src='/mapa.png'
                  alt='Vacunas distribuidas en Argentina'
                  width={150}
                  height={150}
                  priority
                />
              </header>
              <section>
                <div>
                  <h3>Total de Dosis</h3>
                  <p>
                    <NumberDigits>{totals.primeraDosisCantidad + totals.segundaDosisCantidad}</NumberDigits>
                  </p>
                </div>
                <div>
                  {vacunasTotalesDosis[clasificacion].map(vacuna => {
                    return (
                      <Vacuna
                        key={vacuna.grupo}
                        vacuna={vacuna}
                      />
                    )
                  })}
                </div>
              </section>
            </div>

            <div className={styles.card}>
              <header>
                <Image
                  src='/vacuna.png'
                  alt='Primera dosis de Vacunas en Argentina'
                  width={150}
                  height={150}
                  priority
                />
              </header>
              <section>
                <div>
                  <h3>Primera Dosis</h3>
                  <p>
                    <NumberDigits>{totals.primeraDosisCantidad}</NumberDigits>
                  </p>
                </div>
                <div>
                  {vacunasPrimeraDosis[clasificacion].map(vacuna => {
                    return (
                      <Vacuna
                        key={vacuna.grupo}
                        vacuna={vacuna}
                      />
                    )
                  })}
                </div>
              </section>
            </div>

            <div className={styles.card}>
              <header>
                <Image
                  src='/vacunas-completas.png'
                  alt='Dosis completas subministradas'
                  width={150}
                  height={150}
                  priority
                />
              </header>
              <section>
                <div>
                  <h3>Segunda Dosis</h3>
                  <p>
                    <NumberDigits>{totals.segundaDosisCantidad}</NumberDigits>
                  </p>
                </div>
                <div>
                  {vacunasSegundaDosis[clasificacion].map(vacuna => {
                    return (
                      <Vacuna
                        key={vacuna.grupo}
                        vacuna={vacuna}
                      />
                    )
                  })}
                </div>
              </section>
            </div>
          </div>

          <Progress totals={totals} />
          <Prevision data={newReports} totals={totals} />

          <a className={styles.download} download href='/data/latest.json'>
            <Image
              width={32}
              height={32}
              src='/download.png'
              alt='Descargar datos'
            />
            Descargar últimos datos en formato JSON
          </a>

          <Link href='/como-incrustar'>
            <a className={styles.download}>
              <Image
                width={32}
                height={32}
                src='/embed.png'
                alt='Incrustar datos en una página web'
              />
              Quiero incrustar los datos de vacunación en otra página web
            </a>
          </Link>
        </main>

        <h2 className={styles.subtitle}>Por Provincias</h2>

        <Table data={data} filter={filter} setFilter={setFilter} />

        <h2 className={styles.subtitle}>Evolución de dosis aplicadas</h2>

        <ProgressChart
          dataset={chartDatasets.totalDosisAplicadas}
          tooltip={DosisEntregadasTooltip}
        />

        <h2 className={styles.subtitle}>
          Fuentes de datos y enlaces de interés
        </h2>
        <ul>
          <li>
            <a
              target='_blank'
              rel='noreferrer'
              href='https://www.argentina.gob.ar/coronavirus/vacuna'
            >
              Estrategia de Vacunación COVID-19 en Argentina
            </a>
          </li>
        </ul>

      </div>

      <dialog id='vacunas-distribuidas-dialog'>
        <h2>Sobre las vacunas distribuidas</h2>
        <p>Las vacunas distribuidas...</p>
      </dialog>

      <ScrollToTop showButtonAt={250} />

      <ClientSideComponent>
        <SchemeColorSwitcher />
      </ClientSideComponent>

      <Share />

      <Footer />
    </>
  )
}

export async function getStaticProps () {
  const data = require('../public/data/latest.json')
  const info = require('../public/data/info.json')
  const reports = require('../public/data/reports.json')

  const chartDatasets = normalizeChartData()
  const newReports = getNewReports(reports)

  return {
    props: {
      data,
      info,
      chartDatasets,
      reports,
      newReports
    }
  }
}
