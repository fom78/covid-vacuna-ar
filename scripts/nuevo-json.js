
const fs = require('fs-extra')
const { population } = require('../public/data/bbdd.json')
const { populationCodigo } = require('../public/data/bbddco.json')


module.exports = async function crearJson(json,jsonFileName) {
    
let nuevoJson = []
let COVISHIELDPrimeraDosis, 
COVISHIELDSegundaDosis,sputnikPrimeraDosis,sputnikSegundaDosis,
otrasPrimeraDosis,otrasSegundaDosis,sinopharmPrimeraDosis,sinopharmSegundaDosis,astraZenecaPrimeraDosis,astraZenecaSegundaDosis

let obj = {}
let vacunas = {}
let totalesVacunas = {
    COVISHIELDPrimeraDosis:0,
    COVISHIELDSegundaDosis:0,
    sputnikPrimeraDosis:0,
    sputnikSegundaDosis:0,
    sinopharmPrimeraDosis:0,
    sinopharmSegundaDosis:0,
    astraZenecaPrimeraDosis:0,
    astraZenecaSegundaDosis:0,
    otrasPrimeraDosis:0,
    otrasSegundaDosis:0,
    }
let totalesPrimerasDosis = 0
let totalesSegundasDosis = 0
let normalizedJurisdiccionNombre = 0
let populationJurisdiccionNombre = 0
let primeraDosisCantidad = 0
let segundaDosisCantidad = 0


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
        sinopharmPrimeraDosis=0
        sinopharmSegundaDosis=0
        astraZenecaPrimeraDosis=0
        astraZenecaSegundaDosis=0
        otrasPrimeraDosis=0
        otrasSegundaDosis=0
        primeraDosisCantidad=0
        segundaDosisCantidad=0
        //console.log(json);
        json.map(e => {
        
        if (Number(key) === e.jurisdiccionCodigoIndec) {
            
            switch (e.vacunaNombre.substr(0,4)) {
                case 'COVI':
                COVISHIELDPrimeraDosis += e.primeraDosisCantidad
                COVISHIELDSegundaDosis += e.segundaDosisCantidad
                totalesVacunas.COVISHIELDPrimeraDosis += e.primeraDosisCantidad
                totalesVacunas.COVISHIELDSegundaDosis += e.segundaDosisCantidad
                break;
                case 'Sput':
                sputnikPrimeraDosis += e.primeraDosisCantidad
                sputnikSegundaDosis += e.segundaDosisCantidad
                totalesVacunas.sputnikPrimeraDosis += e.primeraDosisCantidad
                totalesVacunas.sputnikSegundaDosis += e.segundaDosisCantidad
                break;
                case 'Sino':
                sinopharmPrimeraDosis += e.primeraDosisCantidad
                sinopharmSegundaDosis += e.segundaDosisCantidad
                totalesVacunas.sinopharmPrimeraDosis += e.primeraDosisCantidad
                totalesVacunas.sinopharmSegundaDosis += e.segundaDosisCantidad
                break;
                case 'Astr':
                astraZenecaPrimeraDosis += e.primeraDosisCantidad
                astraZenecaSegundaDosis += e.segundaDosisCantidad
                totalesVacunas.astraZenecaPrimeraDosis += e.primeraDosisCantidad
                totalesVacunas.astraZenecaSegundaDosis += e.segundaDosisCantidad
                break;
                default:
                otrasPrimeraDosis += e.primeraDosisCantidad
                otrasSegundaDosis += e.segundaDosisCantidad
                totalesVacunas.otrasPrimeraDosis += e.primeraDosisCantidad
                totalesVacunas.otrasSegundaDosis += e.segundaDosisCantidad
                break;
            }

            // Sumamos cantidades a provincia
            primeraDosisCantidad += e.primeraDosisCantidad
            segundaDosisCantidad += e.segundaDosisCantidad
            
            obj = {
            jurisdiccionCodigoIndec: e.jurisdiccionCodigoIndec,
            jurisdiccionNombre: e.jurisdiccionNombre,
            primeraDosisCantidad,
            segundaDosisCantidad,
            totalDosisAplicadas: e.totalDosisAplicadas,
            }

        }

        })

        vacunas = {
        COVISHIELDPrimeraDosis,
        COVISHIELDSegundaDosis,
        sputnikPrimeraDosis,
        sputnikSegundaDosis,
        sinopharmPrimeraDosis,
        sinopharmSegundaDosis,
        astraZenecaPrimeraDosis,
        astraZenecaSegundaDosis,
        otrasPrimeraDosis,
        otrasSegundaDosis,
        }

        obj = {
        ...obj,
        //primeraDosisCantidad: COVISHIELDPrimeraDosis + sputnikPrimeraDosis + sinopharmPrimeraDosis +astraZenecaPrimeraDosis+  otrasPrimeraDosis,
        //segundaDosisCantidad: COVISHIELDSegundaDosis + sputnikSegundaDosis+ sinopharmSegundaDosis +astraZenecaSegundaDosis+ otrasSegundaDosis,
        totalDosisAplicadas: COVISHIELDPrimeraDosis + sputnikPrimeraDosis + otrasPrimeraDosis + COVISHIELDSegundaDosis + sputnikSegundaDosis + otrasSegundaDosis,
        porcentajePrimeraDosis: primeraDosisCantidad / populationJurisdiccionNombre,
        porcentajeSegundaDosis: segundaDosisCantidad / populationJurisdiccionNombre,
        vacunas
        }
        totalesPrimerasDosis = totalesPrimerasDosis + primeraDosisCantidad
        totalesSegundasDosis = totalesSegundasDosis + segundaDosisCantidad
        nuevoJson.push(obj)
    } 

}
populationJurisdiccionNombre = population['Totales']
vacunas = {
    COVISHIELDPrimeraDosis,
    COVISHIELDSegundaDosis,
    sputnikPrimeraDosis,
    sputnikSegundaDosis,
    sinopharmPrimeraDosis,
    sinopharmSegundaDosis,
    astraZenecaPrimeraDosis,
    astraZenecaSegundaDosis,
    otrasPrimeraDosis,
    otrasSegundaDosis,
    }
const totales = {
    jurisdiccionCodigoIndec: 0,
    jurisdiccionNombre: "Totales",
    totalDosisAplicadas: totalesPrimerasDosis + totalesSegundasDosis,
    primeraDosisCantidad: totalesPrimerasDosis,
    segundaDosisCantidad: totalesSegundasDosis,
    porcentajePrimeraDosis: totalesPrimerasDosis / populationJurisdiccionNombre,
    porcentajeSegundaDosis: totalesSegundasDosis / populationJurisdiccionNombre,
    vacunas: totalesVacunas
}
nuevoJson.push(totales)
//console.log('NuevoJson: ', nuevoJson)
await fs.writeJson(`./public/data/${jsonFileName}`, nuevoJson, 'utf8')
}

