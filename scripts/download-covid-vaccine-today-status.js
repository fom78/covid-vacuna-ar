const download = require('download')
const fs = require('fs-extra')
const transformCvsToJson = require('./transform-cvs-to-json')
const getNameReports = require('./get-everything-name-reports')
const { population } = require('../public/data/bbdd.json')
const { populationCodigo } = require('../public/data/bbddco.json')

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
        //Es otro dia!
        //ver si hay datos.... sino lo hay domingo!!
        if (totales.segundaDosisCantidad !== 0) {
         
          let nuevoJson = []
          let COVISHIELDPrimeraDosis, COVISHIELDSegundaDosis,sputnikPrimeraDosis,sputnikSegundaDosis
          let obj = {}
          let vacunas = {}
          let totalesPrimerasDosis = 0
          let totalesSegundasDosis = 0
          let normalizedJurisdiccionNombre = 0
          let populationJurisdiccionNombre = 0
      

          for (var key in populationCodigo) {
            normalizedJurisdiccionNombre = populationCodigo[key]
            populationJurisdiccionNombre = population[normalizedJurisdiccionNombre]
            if (populationJurisdiccionNombre === 0) {populationJurisdiccionNombre=0}
            //console.log('populationJurisdiccionNombre',populationJurisdiccionNombre);
            if (key !== '0') {
              obj = {}
              COVISHIELDPrimeraDosis = 0
              COVISHIELDSegundaDosis = 0
              sputnikPrimeraDosis=0
              sputnikSegundaDosis=0
              json.map(e => {
                
                if (Number(key) === e.jurisdiccionCodigoIndec) {
                    if (e.vacunaNombre.substr(0,4)==='COVI') {
                      COVISHIELDPrimeraDosis = e.primeraDosisCantidad
                      COVISHIELDSegundaDosis = e.segundaDosisCantidad
                    }
                    if (e.vacunaNombre.substr(0,4)==='Sput') {
                      sputnikPrimeraDosis = e.primeraDosisCantidad
                      sputnikSegundaDosis = e.segundaDosisCantidad
                    }
  
                  
                  obj = {
                    jurisdiccionCodigoIndec: e.jurisdiccionCodigoIndec,
                    jurisdiccionNombre: e.jurisdiccionNombre,
                    primeraDosisCantidad: e.primeraDosisCantidad,
                    segundaDosisCantidad: e.segundaDosisCantidad,
                    totalDosisAplicadas: e.totalDosisAplicadas,
                  }
  
                }
  
              })
              vacunas = {
                COVISHIELDPrimeraDosis,
                COVISHIELDSegundaDosis,
                sputnikPrimeraDosis,
                sputnikSegundaDosis,
              }
        
              obj = {
                ...obj,
                primeraDosisCantidad:COVISHIELDPrimeraDosis+sputnikPrimeraDosis,
                segundaDosisCantidad:COVISHIELDSegundaDosis+sputnikSegundaDosis,
                totalDosisAplicadas:COVISHIELDPrimeraDosis+sputnikPrimeraDosis+COVISHIELDSegundaDosis+sputnikSegundaDosis,
                porcentajePrimeraDosis: obj.primeraDosisCantidad / populationJurisdiccionNombre,
                porcentajeSegundaDosis: obj.segundaDosisCantidad / populationJurisdiccionNombre,
                vacunas
              }
              totalesPrimerasDosis = totalesPrimerasDosis + obj.primeraDosisCantidad
              totalesSegundasDosis = totalesSegundasDosis + obj.segundaDosisCantidad
              nuevoJson.push(obj)
            } 

          }
          populationJurisdiccionNombre = population['Totales']
          const totales = {
            jurisdiccionCodigoIndec: 0,
            jurisdiccionNombre: "Totales",
            totalDosisAplicadas : totalesPrimerasDosis + totalesSegundasDosis,
            primeraDosisCantidad: totalesPrimerasDosis,
            segundaDosisCantidad: totalesSegundasDosis,
            porcentajePrimeraDosis: totalesPrimerasDosis / populationJurisdiccionNombre,
            porcentajeSegundaDosis:  totalesSegundasDosis / populationJurisdiccionNombre,
          }
          nuevoJson.push(totales)
          console.log('NuevoJson: ', nuevoJson)
         
          const jsonFileName = filename.replace('.csv', '.json')

          await fs.writeJson(`./public/data/${jsonFileName}`, nuevoJson, 'utf8')
          await getNameReports()
          await fs.copyFile(`./public/data/${jsonFileName}`, './public/data/latest.json')
          await fs.writeJson('./public/data/info.json', { lastModified: +new Date() })
        } else {
          console.log("No hay Data, probablmente sea Domingo.")
        }

      }
    }

  })
  .catch(err => {
    console.error(`${url} can't be downloaded. Error:`)
    console.error(err)
  })
