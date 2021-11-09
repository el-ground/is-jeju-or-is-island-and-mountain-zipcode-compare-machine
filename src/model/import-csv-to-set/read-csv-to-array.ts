import { promises as fs } from 'fs'

export default async (csvFileName:string):Promise<Array<Array<string>>> => { 
    const csvFile:string = (await fs.readFile(`./src/data/${csvFileName}.csv`, 'utf-8')).replace(/[\u200B-\u200D\uFEFF]/g, '')
    const csvFileByLine:Array<string> = csvFile.toString().split(/\r?\n/).filter(n => n != '')

    const csvArray:Array<Array<string>> = []
    for (const element of csvFileByLine){
        csvArray.push(element.split(','))
    }
    return csvArray
}