import { promises as fs } from 'fs'
import FlexSearch from 'flexsearch'

export default async (indexType:string):Promise<FlexSearch.Index> => {
    const index = new FlexSearch.Index("performance")
    
    const adminDivArray = ['강원도', '경기도', '경상남도', '경상북도', '광주광역시', '대구광역시', '대전광역시', '부산광역시', '서울특별시', '세종특별자치시', '울산광역시', '인천광역시', '전라남도', '전라북도', '제주특별자치도', '충청남도', '충청북도']
    
    for (const adminDiv of adminDivArray){
        const zipCodeFile = (await fs.readFile(`./src/data/${indexType}-zipcode-address/${adminDiv}.csv`, 'utf-8')).replace(/[\u200B-\u200D\uFEFF]/g, '')
        const zipCodeByLine:Array<string> = zipCodeFile.toString().split(/\r?\n/).filter(n => n != '')
        
        for (const zipCodeAddress of zipCodeByLine){
            index.add(zipCodeAddress, zipCodeAddress)
        }
    }

    return index
}