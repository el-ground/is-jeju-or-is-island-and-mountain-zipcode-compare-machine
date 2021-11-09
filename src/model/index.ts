import FlexSearch from 'flexsearch'

import getSetDifferences from './compare-zipcode-sets/get-set-differences.js'
import combineSetDifferences from './compare-zipcode-sets/combine-set-differences.js'
import condenseSetDifferences from './compare-zipcode-sets/condense-set-differences.js'
import readCSVToArray from './import-csv-to-set/read-csv-to-array.js'
import getCSVZipCodeSet from './import-csv-to-set/get-csv-zipcode-set.js'
import getZipCodeIndex from './get-zip-code-index.js'
import getLottePrice from './get-lotte-price.js'
import getHanjinPrice from './get-hanjin-price.js'

const main = async () => {

    const oldIndex:FlexSearch.Index = await getZipCodeIndex('old')
    const newIndex:FlexSearch.Index = await getZipCodeIndex('new')
    
    const csvDefault:string = 'default'
    const csvFileArray:Array<string> = ['domeggook', 'lotte', 'imweb', 'sycstore', 'ichibanhouse', 'novatec', 'sagein',  'goddaehee', 'gmarket', 'cafe24']
    
    const defaultSet:ZipCodeSet = getCSVZipCodeSet(await readCSVToArray(`${csvDefault}`), csvDefault, oldIndex, newIndex)

    const setDifferencesArray:Array<TrackDiffSet> = await Promise.all(csvFileArray.map(async csvSample => {
        const csvZipCodeSet:ZipCodeSet = getCSVZipCodeSet(await readCSVToArray(`${csvSample}`), csvSample, oldIndex, newIndex)
       return getSetDifferences(defaultSet, csvZipCodeSet)
    }))
    
    const diffCombinedSet:DiffCombinedSet = combineSetDifferences(setDifferencesArray)
    const condensedDiffSet:Array<Array<number|Array<string>>> = condenseSetDifferences(diffCombinedSet)

    condensedDiffSet.sort((arrA, arrB) => ((arrB[0] as number) - (arrA[0] as number)))

    for (const [sourceDiffCount, zipCodeLowerRange, zipCodeUpperRange, diffSourceArray] of condensedDiffSet) {
        
        // assumption: each source has low credibility on their own
        if(sourceDiffCount as number == 1) {
            continue
        }

        for (let zipCode = zipCodeLowerRange as number; zipCode <= zipCodeUpperRange; zipCode++){
            const searchResult:Array<string> = newIndex.search(zipCode.toString()) as Array<string>

            // not all numbers between a given range are valid zip codes
            if (searchResult.length == 0){
                continue
            }

            const address:string = searchResult[0].split(',').slice(1,).toString().replace(/,/gm,' ')

            // parallel scraping hanjin and lotte's delivery prices
            const [hanjinPrice, lottePrice] = await Promise.all([getHanjinPrice(zipCode.toString()), getLottePrice(address)])

            const isHanjinFree:boolean = parseInt(hanjinPrice) < 8000
            const isLotteFree:boolean = parseInt(lottePrice) < 8000

            // no additional price in Hanjin & Lotte, yet the default set contains the zip code
            if (isHanjinFree && isLotteFree && defaultSet[zipCode]){
                console.log(`REMOVE ZIPCODE [${zipCode}]\n`)
            } 

            // additional price in Hanjin & Lotte, yet the default set does not contain the zip code
            else if (!isHanjinFree && !isLotteFree && !defaultSet[zipCode]){
                console.log(`ADD ZIPCODE [${zipCode}]\n`)
            } 
            
            // there is a discrepency between Hanjin & Lotte's pricing scheme. Manual check required
            else if (isHanjinFree ? !isLotteFree : isLotteFree){
                const curr:string = defaultSet[zipCode] != undefined? 'Currently in default.csv' : 'Not in default.csv'
                console.log(`Zip Code [${zipCode}]: ${address}\nHanjin:${hanjinPrice}\nLotte:${lottePrice}\n${curr}\n${diffSourceArray.toString()}\n`)
            }
        }
    }
}

main()