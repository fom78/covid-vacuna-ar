/* global fetch */
import { useMemo, useState } from 'react'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

//import Contributors from 'components/Contributors.jsx'
import Footer from 'components/Footer.jsx'
import NumberDigits from 'components/NumberDigits'
import NumberPercentage from 'components/NumberPercentage.jsx'
import Progress from 'components/Progress.jsx'
//import Prevision from "components/Prevision/Prevision";
import PrevisionOriginal from "components/PrevisionOriginal";
import Select from 'components/Select'
import Share from 'components/Share.jsx'
import Table from 'components/Table.jsx'
import SchemeColorSwitcher from 'components/SchemeColorSwitcher'

import styles from 'styles/Home.module.css'
import useSearch from 'hooks/useSearchReport'
import TimeAgo from 'components/TimeAgo.jsx'

import ProgressChart from 'components/ProgressChart'
import {
  DosisAdministradasTooltip,
  DosisEntregadasTooltip
} from 'components/ProgressChart/tooltips'
import normalizeChartData from 'components/ProgressChart/utils/normalize-data'
import getNewReports from 'scripts/get-lasts-reports'
import ClientSideComponent from 'components/ClientSideComponent'

export default function Home ({ contributors, data, info, reports, chartDatasets, newReports }) {
  const [filter, setFilter] = useState('Totales')
  const [valueSearch, setValueSearch] = useState('')
  const reportFound = useSearch({ valueSearch })
  // const totals = useMemo(
  //   () => data.find(({ jurisdiccionNombre }) => jurisdiccionNombre === filter),
  //   [data, filter]
  // )
  const totals = useMemo(
    () => reportFound !== undefined ? reportFound.find(({ jurisdiccionNombre }) => jurisdiccionNombre === filter) : data.find(({ jurisdiccionNombre }) => jurisdiccionNombre === filter),
    [data, filter, reportFound]
  )
const dosisAplicadas = chartDatasets.primeraDosisCantidad+chartDatasets.segundaDosisCantidad

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

          <div className={styles.grid}>
            <div className={styles.card}>
              <button
                title='Abrir diálogo con explicación sobre Dosis Distribuidas'
                onClick={() => {}}
              >
                ❔
              </button>

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
                    <NumberDigits>{totals.primeraDosisCantidad+totals.segundaDosisCantidad}</NumberDigits>
                  </p>
                </div>
                <div>
                  {/* <small>
                    <Image
                      alt='Pfizer Logo'
                      className={styles.companyLogo}
                      src='/pfizer-logo.png'
                      height={29}
                      width={72}
                      priority
                    />
                    <span>
                      <NumberDigits>
                        {totals.dosisEntregadasPfizer}
                      </NumberDigits>
                    </span>
                  </small>
                  <small>
                    <Image
                      alt='Moderna Logo'
                      className={styles.companyLogo}
                      src='/moderna-logo.png'
                      height={16.5}
                      width={72}
                      priority
                    />
                    <span>
                      <NumberDigits>
                        {totals.dosisEntregadasModerna}
                      </NumberDigits>
                    </span>
                  </small> */}
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
                  <h4>% sobre distribuidas</h4>
                  <p className={styles.secondary}>
                    <NumberPercentage>
                      {totals.primeraDosisCantidad/(totals.totalDosisAplicadas)}
                    </NumberPercentage>
                  </p>
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
                  <h4>% sobre distribuidas</h4>
                  <p className={styles.secondary}>
                    <NumberPercentage>
                      {totals.segundaDosisCantidad/(totals.totalDosisAplicadas)}
                    </NumberPercentage>
                  </p>
                </div>
              </section>
            </div>
          </div>

          <Progress totals={totals} />
          {/* <Prevision data={newReports} totals={totals} /> */}
          <PrevisionOriginal totals={totals} />

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

        {/* <h2 className={styles.subtitle}>Evolución de dosis administradas</h2>

        <ProgressChart
          dataset={chartDatasets.dosisAdministradas}
          tooltip={DosisAdministradasTooltip}
        /> */}

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
          {/* <li>
            <a
              target='_blank'
              rel='noreferrer'
              href='https://www.vacunacovid.gob.es'
            >
              Información oficial sobre la vacunación contra el nuevo
              coronavirus
            </a>
          </li> */}
        </ul>

        
        {/* <h2 className={styles.subtitle}>En los medios</h2>
        <ul>
          <li>
            <a
              className={styles.news}
              target='_blank'
              rel='noreferrer'
              href='https://www.20minutos.es/noticia/4552926/0/lanzan-una-web-con-datos-del-gobierno-que-permite-ver-como-avanza-en-espana-la-vacunacion-contra-el-coronavirus/'
            >
              Lanzan una web con datos del Gobierno que permite ver cómo avanza
              en España la vacunación contra el coronavirus (20 Minutos)
            </a>
          </li>
          <li>
            <a
              className={styles.news}
              target='_blank'
              rel='noreferrer'
              href='https://www.meneame.net/m/actualidad/web-revisar-estado-progreso-vacunacion-covid-19-espana'
            >
              Web para revisar el estado y progreso de la vacunación del
              COVID-19 en España (Menéame)
            </a>
          </li>
        </ul> */}

        {/* <h2 className={styles.subtitle}>Contribuidores</h2>
        <Contributors contributors={contributors} /> */}
      </div>

      <dialog id='vacunas-distribuidas-dialog'>
        <h2>Sobre las vacunas distribuidas</h2>
        <p>Las vacunas distribuidas...</p>
      </dialog>

      <ClientSideComponent>
        <SchemeColorSwitcher />
      </ClientSideComponent>

      <Share />

      <Footer />
    </>
  )
}

export async function getStaticProps () {
  const path =require("path")

  const fs = require("fs-extra")
  const data = require('../public/data/latest.json')
  const info = require('../public/data/info.json')
  const reports = require('../public/data/reports.json')
  
//   const dataPath = path.join("public", "data");
//   console.log(dataPath)
//   fs.readJson(dataPath+'/20210128.json')
// .then(json => {
//   console.log(json) // => 0.1.3
// })
// .catch(err => {
//   console.error(err)
// })
console.log("Hola")

  // const contributors = await fetch('https://api.github.com/repos/midudev/covid-vacuna/contributors')
  //   .then(res => res.json())
  //   .then(json =>
  //     json.map(
  //       ({ login, avatar_url: avatar, html_url: url }) => ({ login, avatar, url })
  //     )
  //   ).catch(() => [])
  
  // const medias = (reports) => {
  //   const week = -2
  //   const dataPath = path.join("public", "data");
  //   console.log(dataPath)
  
  //   return reports.slice(week).map((date) => {
  //     //console.log(date)
  //      const fileName = date+'.json'
  //      const completeFile = dataPath+'/'+fileName
  //      //console.log(fileName)
  //      fs.readFile(completeFile, (err, data) => {
  //       if (err) throw err;

  //       const json = JSON.parse(data);
  //       json.map((e)=>{
  //        // console.log(e.segundaDosisCantidad)

  //       })
  //       //console.log(json);
  //   });
  //   })
  // }
  // const temp = medias(reports)  
  // console.log(media)
  const chartDatasets = normalizeChartData()
  const newReports = getNewReports(reports)
  console.log('nuevos reportes: '+newReports)
  return {
    props: {
      data,
      info,
      chartDatasets,
      reports,
      newReports
      //temp
      //contributors
    }
  }
}
