const fs = require('fs-extra')

const hacertran = require('./prueba1')

const crearJson = require('./nuevo-json')

const year = '2021'
const month = '10'

// Colocar de que dia a que dia del mes arriba colocado se rehace todo.
const dayInicial = 01
const dayFinal = 01
// Damos una fecha lee el csv y lo transforma a json "hacertran"
// Luego si es exitoso lee el json y genera el nuevo para tipos de vacunas.
for (let i = dayInicial; i <= dayFinal; i++) {
  const dayActual = i <= 9 ? `0${i}` : `${i}`
  console.log('hola dia: ', dayActual)
  const fecha = `${year}${month}${dayActual}`

  hacertran(fecha).then(() => {
    const jsonFileName = `${fecha}.json`
    const json = fs.readJSONSync(`./public/data/${jsonFileName}`)
    crearJson(json, jsonFileName)
    // console.log(json);
  })
}
