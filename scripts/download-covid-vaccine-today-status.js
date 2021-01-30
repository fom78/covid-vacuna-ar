const download = require('download')
const fs = require('fs-extra')
const transformCvsToJson = require('./transform-cvs-to-json')
const getNameReports = require('./get-everything-name-reports')

const PREFIX_URL = 'https://sisa.msal.gov.ar/datos/descargas/covid-19/files/Covid19VacunasAgrupadas'
const SUFFIX_URL = '.csv'

const date = new Date()
const year = date.getFullYear()
const day = `${date.getDate()}`.padStart(2, '0')
const month = `${date.getMonth() + 1}`.padStart(2, '0')

const url = `${PREFIX_URL}${SUFFIX_URL}`

const filename = `${year}${month}${day}.csv`

const latestJson = require('../public/data/latest.json')

download(url, 'public/data', { filename })
  .then(async () => {
    console.log(`${url} downloaded`)
    const json = await transformCvsToJson(filename)
    // Leer si es del mismo dia ?
    const totales = json.find(({ jurisdiccionNombre }) => jurisdiccionNombre === 'Totales')
    if (totales) {
      const totalesLatest = latestJson.find(({ jurisdiccionNombre }) => jurisdiccionNombre === 'Totales')
      if (totalesLatest.primeraDosisCantidad !== totales.primeraDosisCantidad) {
        const jsonFileName = filename.replace('.csv', '.json')

        await fs.writeJson(`./public/data/${jsonFileName}`, json,'utf8')
        await getNameReports()
        await fs.copyFile(`./public/data/${jsonFileName}`, './public/data/latest.json')
        await fs.writeJson('./public/data/info.json', { lastModified: +new Date() })
      } 
    }
    
  })
  .catch(err => {
    console.error(`${url} can't be downloaded. Error:`)
    console.error(err)
  })
