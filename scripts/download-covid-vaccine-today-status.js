const download = require('download')
const fs = require('fs-extra')
const admZip = require('adm-zip')
const transformCvsToJson = require('./transform-cvs-to-json')
const crearJson = require('./nuevo-json')
const getNameReports = require('./get-everything-name-reports')

const PREFIX_URL =
  'https://sisa.msal.gov.ar/datos/descargas/covid-19/files/Covid19VacunasAgrupadas'
const SUFFIX_URL = '.csv.zip'
const nameFileIntoZip = 'Covid19VacunasAgrupadas.csv'

const date = new Date()
const year = date.getFullYear()
const day = `${date.getDate()}`.padStart(2, '0')
const month = `${date.getMonth() + 1}`.padStart(2, '0')

const url = `${PREFIX_URL}${SUFFIX_URL}`

const filename = `${year}${month}${day}.zip`

const latestJson = require('../public/data/latest.json')

download(url, 'public/data', { filename })
  .then(async () => {
    console.log(`${url} downloaded`)
    const zip = new admZip(`public/data/${filename}`)
    const zipEntries = zip.getEntries() // an array of ZipEntry records

    const csvExtract =
      zipEntries[0].entryName === nameFileIntoZip
        ? zipEntries[0].getData().toString('utf8')
        : ''
    const csvFileName = filename.replace('.zip', '.csv')

    await fs.writeFile(`./public/data/${csvFileName}`, csvExtract, 'utf8')

    const json = await transformCvsToJson(csvFileName)

    // Leer si es del mismo dia ?
    const totales = json.find(
      ({ jurisdiccionNombre }) => jurisdiccionNombre === 'Totales'
    )

    if (totales) {
      const totalesLatest = latestJson.find(
        ({ jurisdiccionNombre }) => jurisdiccionNombre === 'Totales'
      )
      if (totalesLatest.primeraDosisCantidad !== totales.primeraDosisCantidad) {
        // Es otro dia!
        // ver si hay datos.... sino lo hay domingo!!

        const jsonFileName = filename.replace('.zip', '.json')
        crearJson(json, jsonFileName)

        await getNameReports()
        await fs.copyFile(
          `./public/data/${jsonFileName}`,
          './public/data/latest.json'
        )
        await fs.writeJson('./public/data/info.json', {
          lastModified: +new Date()
        })
      }
    }

    // Eliminar el zip.......
    await fs.remove(`./public/data/${filename}`)
  })
  .catch((err) => {
    console.error(`${url} can't be downloaded. Error:`)
    console.error(err)
  })
