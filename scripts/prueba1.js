const fs = require('fs-extra')
const transformCvsToJson = require('./transform-cvs-to-json')
const year = "2021"
const month = "03"
const day = "04"
module.exports = async (fecha) => {
    // const filename= `${year}${month}${day}.csv`
    const filename= `${fecha}.csv`
    const jsonFileName = `${fecha}.json`
    // const jsonFileName = `${year}${month}${day}.json`
    const json =  await transformCvsToJson(filename)
    await fs.writeJson(`./public/data/${jsonFileName}`, json,'utf8')
    console.log(json)
}
