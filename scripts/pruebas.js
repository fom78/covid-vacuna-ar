const fs = require('fs-extra')
const getNameReports = require('./get-everything-name-reports')

const hacertran = require('./prueba1')

const crearJson = require('./prueba2')

const year = "2021"
const month = "02"
const day = "23"
const jsonFileName = `${year}${month}${day}.json`
const json = fs.readJSONSync(`./public/data/${jsonFileName}`)
crearJson(json, jsonFileName)


// dado un csv, haga el json correspondiente.
//hacertran()


//genera getNameReports.json
//getNameReports()
