const XLSX = require('xlsx')
const { population } = require('../public/data/bbdd.json')
const { populationCodigo } = require('../public/data/bbddco.json')

module.exports = async function transformCvsToJson (cvsFileName) {
  const workbook = XLSX.readFile(`./public/data/${cvsFileName}`)

  const { Sheets } = workbook
  const [firstKey] = Object.keys(Sheets)
  const sheet = Sheets[firstKey]

  const totales = {
    jurisdiccion_codigo_indec: 0,
    jurisdiccion_nombre: 'Totales',
    vacuna_nombre: 'Sputnik',
    primera_dosis_cantidad: 9999,
    segunda_dosis_cantidad: 3
  }
  const totalesPrimerasDosis = 0
  const totalesSegundasDosis = 0

  const json = XLSX.utils.sheet_to_json(sheet)
  json.push(totales)

  return json.map(element => {
    let {
      jurisdiccion_codigo_indec: jurisdiccionCodigoIndec,
      jurisdiccion_nombre: jurisdiccionNombre,
      vacuna_nombre: vacunaNombre,
      primera_dosis_cantidad: primeraDosisCantidad,
      segunda_dosis_cantidad: segundaDosisCantidad,
      dosis_unica_cantidad: dosisUnicaCantidad,
      dosis_adicional_cantidad: dosisAdicionalCantidad,
      dosis_refuerzo_cantidad: dosisRefuerzoCantidad
    } = element

    jurisdiccionNombre = populationCodigo[jurisdiccionCodigoIndec]

    const totalDosisAplicadas = primeraDosisCantidad + segundaDosisCantidad + dosisUnicaCantidad + dosisAdicionalCantidad + dosisRefuerzoCantidad
    const normalizedJurisdiccionNombre = populationCodigo[jurisdiccionCodigoIndec]
    let populationJurisdiccionNombre = population[normalizedJurisdiccionNombre]
    if (populationJurisdiccionNombre === 0) { populationJurisdiccionNombre = 0 }

    return {
      jurisdiccionNombre: jurisdiccionNombre.trim(),
      jurisdiccionCodigoIndec,
      // dosisEntregadas: dosisEntregadasDeprecated || dosisEntregadasNew,
      vacunaNombre,
      primeraDosisCantidad,
      segundaDosisCantidad,
      dosisUnicaCantidad,
      dosisAdicionalCantidad,
      dosisRefuerzoCantidad,
      totalDosisAplicadas,
      porcentajePrimeraDosis: primeraDosisCantidad / populationJurisdiccionNombre,
      porcentajeSegundaDosis: segundaDosisCantidad / populationJurisdiccionNombre
    }
  })
}
