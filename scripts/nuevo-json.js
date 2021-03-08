
const fs = require('fs-extra')
const { population } = require('../public/data/bbdd.json')
const { populationCodigo } = require('../public/data/bbddco.json')


module.exports = async function crearJson(json,jsonFileName) {
    
let nuevoJson = []
let COVISHIELDPrimeraDosis, 
COVISHIELDSegundaDosis,sputnikPrimeraDosis,sputnikSegundaDosis,
otrasPrimeraDosis,otrasSegundaDosis,sinopharmPrimeraDosis,sinopharmSegundaDosis

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
        sinopharmPrimeraDosis=0
        sinopharmSegundaDosis=0
        otrasPrimeraDosis=0
        otrasSegundaDosis=0
        
        console.log(json);
        json.map(e => {
        
        if (Number(key) === e.jurisdiccionCodigoIndec) {
            
            switch (e.vacunaNombre.substr(0,4)) {
                case 'COVI':
                COVISHIELDPrimeraDosis += e.primeraDosisCantidad
                COVISHIELDSegundaDosis += e.segundaDosisCantidad
                break;
                case 'Sput':
                sputnikPrimeraDosis += e.primeraDosisCantidad
                sputnikSegundaDosis += e.segundaDosisCantidad
                break;
                case 'Sino':
                sinopharmPrimeraDosis += e.primeraDosisCantidad
                sinopharmSegundaDosis += e.segundaDosisCantidad
                break;
                default:
                otrasPrimeraDosis += e.primeraDosisCantidad
                otrasSegundaDosis += e.segundaDosisCantidad
                break;
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
        sinopharmPrimeraDosis,
        sinopharmSegundaDosis,
        otrasPrimeraDosis,
        otrasSegundaDosis,
        }

        obj = {
        ...obj,
        primeraDosisCantidad: COVISHIELDPrimeraDosis + sputnikPrimeraDosis + sinopharmPrimeraDosis +  otrasPrimeraDosis,
        segundaDosisCantidad: COVISHIELDSegundaDosis + sputnikSegundaDosis+ sinopharmSegundaDosis + otrasSegundaDosis,
        totalDosisAplicadas: COVISHIELDPrimeraDosis + sputnikPrimeraDosis + otrasPrimeraDosis + COVISHIELDSegundaDosis + sputnikSegundaDosis + otrasSegundaDosis,
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
    totalDosisAplicadas: totalesPrimerasDosis + totalesSegundasDosis,
    primeraDosisCantidad: totalesPrimerasDosis,
    segundaDosisCantidad: totalesSegundasDosis,
    porcentajePrimeraDosis: totalesPrimerasDosis / populationJurisdiccionNombre,
    porcentajeSegundaDosis: totalesSegundasDosis / populationJurisdiccionNombre,
}
nuevoJson.push(totales)
console.log('NuevoJson: ', nuevoJson)
await fs.writeJson(`./public/data/${jsonFileName}`, nuevoJson, 'utf8')
}

