const fs = require('fs-extra')
const transformCvsToJson = require('./transform-cvs-to-json')
const year = "2021"
const month = "02"
const day = "25"
module.exports = async () => {
    const filename= `${year}${month}${day}.csv`
    const jsonFileName = `${year}${month}${day}.json`
    const json =  await transformCvsToJson(filename)
    await fs.writeJson(`./public/data/${jsonFileName}`, json,'utf8')
    //console.log(json)
}
