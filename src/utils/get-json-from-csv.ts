import { promises as fs } from 'fs'

async function getJSONfromCSV():Promise<void> {
    const csvFile:string = (await fs.readFile(`./src/data/default.csv`, 'utf-8')).replace(/[\u200B-\u200D\uFEFF]/g, '')
    const csvFileByLine:Array<string> = csvFile.toString().split(/\r?\n/).filter(n => n != '')

    const zipCodeArray:Array<string> = []
    for (const line of csvFileByLine){
        for (let zipCode = parseInt(line.split(',')[0]); zipCode <= parseInt(line.split(',')[1]); zipCode++){
            zipCodeArray.push(zipCode.toString())
        }
    }
    
    await fs.writeFile(`./zip-codes.js`, `module.exports = { "data" : ${JSON.stringify(zipCodeArray)} }`)
}

getJSONfromCSV()