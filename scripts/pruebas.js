const fs = require('fs-extra')
const getNameReports = require('./get-everything-name-reports')

const hacertran = require('./prueba1')

const crearJson = require('./nuevo-json')

const year = "2021"
const month = "03"
const day = "07"
const fecha = `${year}${month}${day}`
//const jsonFileName = `${year}${month}${day}.json`
// dado un csv, haga el json correspondiente.
hacertran(fecha)
    .then(()=>{
const jsonFileName = `${fecha}.json`
const json = fs.readJSONSync(`./public/data/${jsonFileName}`)
crearJson(json, jsonFileName)
console.log(json);
    })







//genera getNameReports.json
//getNameReports()
