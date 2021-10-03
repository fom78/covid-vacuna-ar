const fs = require('fs-extra')
const { population } = require('../public/data/bbdd.json')
const { populationCodigo } = require('../public/data/bbddco.json')
const { inicialTotalesVacunas } = require('../config/totales.json')

module.exports = async function crearJson(json, jsonFileName) {
  const nuevoJson = []

  let obj = {}
  let vacunasPorProvincia = {...inicialTotalesVacunas}
  let totalesVacunas = {...inicialTotalesVacunas}
  let nombre = ''
  let totalesPrimerasDosis = 0
  let totalesSegundasDosis = 0
  let normalizedJurisdiccionNombre = 0
  let populationJurisdiccionNombre = 0
  let primeraDosisCantidad = 0
  let segundaDosisCantidad = 0

  for (var key in populationCodigo) {
    normalizedJurisdiccionNombre = populationCodigo[key]
    populationJurisdiccionNombre = population[normalizedJurisdiccionNombre]
    if (populationJurisdiccionNombre === 0) { populationJurisdiccionNombre = 0 }

    if (key !== '0') {
      obj = {}
      primeraDosisCantidad = 0
      segundaDosisCantidad = 0
      vacunasPorProvincia = {...inicialTotalesVacunas}
      json
        .filter( e =>e.jurisdiccionCodigoIndec === Number(key))
        .map(e => {
          switch (e.vacunaNombre.substr(0, 4)) {
            case 'COVI':
              nombre = 'COVISHIELD'
              break
            case 'Sput':
              nombre = 'sputnik'
              break
            case 'Sino':
              nombre = 'sinopharm'
              break
            case 'Astr':
              nombre = 'astraZeneca'
              break
            case 'Mode':
              nombre = 'moderna'
              break
            case 'Pfiz':
              nombre = 'pfizer'
              break
            case 'Cans':
              nombre = 'cansino'
              break
            default:
              nombre = 'otras'
              break
          }

  
          totalesVacunas[`${nombre}PrimeraDosis`] += e.primeraDosisCantidad
          totalesVacunas[`${nombre}SegundaDosis`] += e.segundaDosisCantidad
          vacunasPorProvincia[`${nombre}PrimeraDosis`] += e.primeraDosisCantidad
          vacunasPorProvincia[`${nombre}SegundaDosis`] += e.segundaDosisCantidad

          // Sumamos cantidades a provincia
          primeraDosisCantidad += e.primeraDosisCantidad
          segundaDosisCantidad += e.segundaDosisCantidad

          obj = {
            jurisdiccionCodigoIndec: e.jurisdiccionCodigoIndec,
            jurisdiccionNombre: e.jurisdiccionNombre,
            primeraDosisCantidad,
            segundaDosisCantidad,
            totalDosisAplicadas: e.totalDosisAplicadas
          }
      })

      // Sumamos el total de las dosis aplicadas para la provincia
      let totalDosisAplicadasEnProvincia = 0
      for (const prop in vacunasPorProvincia) {
        totalDosisAplicadasEnProvincia += vacunasPorProvincia[prop]
      }

      obj = {
        ...obj,
        totalDosisAplicadas: totalDosisAplicadasEnProvincia,
        porcentajePrimeraDosis: primeraDosisCantidad / populationJurisdiccionNombre,
        porcentajeSegundaDosis: segundaDosisCantidad / populationJurisdiccionNombre,
        vacunas:vacunasPorProvincia
      }

      totalesPrimerasDosis = totalesPrimerasDosis + primeraDosisCantidad
      totalesSegundasDosis = totalesSegundasDosis + segundaDosisCantidad
      nuevoJson.push(obj);
    }
  }
  populationJurisdiccionNombre = population.Totales
  
  const totales = {
    jurisdiccionCodigoIndec: 0,
    jurisdiccionNombre: 'Totales',
    totalDosisAplicadas: totalesPrimerasDosis + totalesSegundasDosis,
    primeraDosisCantidad: totalesPrimerasDosis,
    segundaDosisCantidad: totalesSegundasDosis,
    porcentajePrimeraDosis: totalesPrimerasDosis / populationJurisdiccionNombre,
    porcentajeSegundaDosis: totalesSegundasDosis / populationJurisdiccionNombre,
    vacunas: totalesVacunas
  }

  nuevoJson.push(totales)
  await fs.writeJson(`./public/data/${jsonFileName}`, nuevoJson, 'utf8')

  console.log('##### Fin Ejecucion #####');
  console.log("fecha: ",jsonFileName,"  ",totalesVacunas);

}
