// const fs = require('fs-extra')
// const path = require('path')

import fs from "fs-extra";
import path from "path";

//const reports = require('../public/data/reports.json')
// const dataLatest = require('../public/data/latest.json')
// const { population } = require('../public/data/bbdd.json')



// function getTotalPopulationToBeVaccinated(filter) {
//     const populationJurisdiccionNombre = population[filter]
//     const vaccinatedPopuplation = dataLatest.find(({ jurisdiccionNombre }) => jurisdiccionNombre === filter)
//     const totalPopulationToBeVaccinated = populationJurisdiccionNombre - vaccinatedPopuplation.segundaDosisCantidad
//     return totalPopulationToBeVaccinated
// }



//const filter = "Buenos Aires"


export default function getNewReports(reports) {
    const dataPath = path.join("public", "data");
    const QTY_REPORTS_FOR_MEDIA = -2

    const newReports = reports.slice(QTY_REPORTS_FOR_MEDIA).map((date) => {
        const fileName = date+'.json'
        const completeFile = dataPath+'/'+fileName
         
        const json = fs.readJsonSync(completeFile)
        
            //const result = json.filter(e => e.jurisdiccionNombre === filter)
            //console.log(result)
            //const totalPoblacion = getTotalPopulation(result[0].jurisdiccionCodigoIndec)
            return {
                fecha:date,
                completos:json[0].segundaDosisCantidad,
                //totalPoblacion
            }
    })
    console.log(newReports)
    return newReports
}


// function getMedia(filter) {
//     const newReports = getNewReports(filter)
    
//     const reducer = (accumulator, currentValue) => accumulator.completos + currentValue.completos
//     const suma = newReports.reduce(reducer)
//     const mediaOfLastsDays = suma / newReports.length

//     return mediaOfLastsDays
// }

// function prevision(filter) {
//     const mediaOfLastsDays = getMedia(filter)
//     const totalPopulationToBeVaccinated = getTotalPopulationToBeVaccinated(filter)
    
//     const previsionCalculada = totalPopulationToBeVaccinated / mediaOfLastsDays
//     return previsionCalculada

// }

// const previsionCalculada = prevision(filter)

// console.log('en '+filter+' se calculan; '+previsionCalculada)
