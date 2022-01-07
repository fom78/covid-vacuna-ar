const fs = require('fs-extra')
const { population } = require('../public/data/bbdd.json')
const { populationCodigo } = require('../public/data/bbddco.json')
const { inicialTotalesVacunas, inicialVacunas } = require('../config/totales.json')
const { totalesVacunas } = require('lib/vacunas')

module.exports = async function crearJson(json, jsonFileName) {
  const nuevoJson = []
console.log("json que viene",json);
  let obj = {}
  let vacunasPorProvincia = {...inicialVacunas}
  const totalesVacunas = {...inicialVacunas}
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
      vacunasPorProvincia = {...inicialVacunas}
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

          vacunasPorProvincia[`${nombre}`].primeraDosisCantidad = e.primeraDosisCantidad
          vacunasPorProvincia[`${nombre}`].segundaDosisCantidad = e.segundaDosisCantidad
          vacunasPorProvincia[`${nombre}`].dosisUnicaCantidad = e.dosisUnicaCantidad
          vacunasPorProvincia[`${nombre}`].dosisAdicionalCantidad = e.dosisAdicionalCantidad
          vacunasPorProvincia[`${nombre}`].dosisRefuerzoCantidad = e.dosisRefuerzoCantidad

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

      // Sumamos el total de las dosis aplicadas para la provincia accediendo dentro de cada vacuna a la cantidad segun cada dosis
      let totalDosisAplicadasEnProvincia = 0
      for (const prop in vacunasPorProvincia) {
      for (const cantidad in vacunasPorProvincia[prop]) {
        totalDosisAplicadasEnProvincia += vacunasPorProvincia[prop][cantidad]
      }

      }

      obj = {
        ...obj,
        totalDosisAplicadas: totalDosisAplicadasEnProvincia,
        porcentajePrimeraDosis: primeraDosisCantidad / populationJurisdiccionNombre,
        porcentajeSegundaDosis: segundaDosisCantidad / populationJurisdiccionNombre,
        vacunas:vacunasPorProvincia
      }
      // console.log(vacunasPorProvincia);
      totalesPrimerasDosis = totalesPrimerasDosis + primeraDosisCantidad
      totalesSegundasDosis = totalesSegundasDosis + segundaDosisCantidad
      nuevoJson.push(obj);
    }
  }
  populationJurisdiccionNombre = population.Totales
  
// Sumar el total de vacunas aca
// const puto1 = nuevoJson.map((provincia)=> {
//   const totalesVacunas1 = {...totalesVacunas, 'astraZeneca.primeraDosisCantidad': astraZeneca.primeraDosisCantidad+ provincia.astraZeneca.primeraDosisCantidad}
//   return totalesVacunas1
// })

// console.log(puto1);


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
  // console.log("fecha: ",jsonFileName,"  ",totalesVacunas);

}
