const fs = require('fs-extra')
const getNameReports = require('./get-everything-name-reports')

const hacertran = require('./prueba1')

const crearJson = require('./prueba2')

// dado un csv, haga el json correspondiente.
hacertran()
    .then(()=>{
        const year = "2021"
const month = "03"
const day = "04"
const jsonFileName = `${year}${month}${day}.json`
const json = fs.readJSONSync(`./public/data/${jsonFileName}`)
crearJson(json, jsonFileName)
console.log(json);
    })







//genera getNameReports.json
//getNameReports()
