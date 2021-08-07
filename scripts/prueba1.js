const fs = require('fs-extra')
const transformCvsToJson = require('./transform-cvs-to-json')

module.exports = async (fecha) => {
  // const filename= `${year}${month}${day}.csv`
  const filename = `${fecha}.csv`
  const jsonFileName = `${fecha}.json`
  const json = await transformCvsToJson(filename)
  await fs.writeJson(`./public/data/${jsonFileName}`, json, 'utf8')
}
