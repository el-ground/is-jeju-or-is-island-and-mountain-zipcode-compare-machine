import FlexSearch from 'flexsearch'

export default (csvArray:Array<Array<string>>, csvPath:string, oldIndex:FlexSearch.Index, newIndex:FlexSearch.Index):ZipCodeSet => { 
    
    const zipCodeSet:ZipCodeSet = {}

    for (const csvLine of csvArray){
        const zipCode1:number = parseInt(csvLine[0].replace(/\D/g,''))
        const zipCode2:number = parseInt(csvLine[1].replace(/\D/g,''))

        if (zipCode1 > zipCode2){
            console.log(`${zipCode1} ~ ${zipCode2} is an invalid range`)
            continue
        }

        if (zipCode1.toString().length != zipCode2.toString().length) {
            console.log(`${zipCode1} and ${zipCode2} must be given in the same format`)
            continue
        }

        if (zipCode1.toString().length <= 4 || zipCode1.toString().length >= 7) {
            console.log(`${zipCode1} is an invalid zip code. Zip code must be of length 5 or 6`)
            continue
        }

        if (zipCode2.toString().length <= 4 || zipCode2.toString().length >= 7) {
            console.log(`${zipCode2} is an invalid zip code. Zip code must be of length 5 or 6`)
            continue
        }

        if (zipCode1.toString().length == 5 && zipCode2.toString().length == 5){
            for (let i = zipCode1; i <= zipCode2; i++) {
                zipCodeSet[i] = {source: csvPath}
            }

        } else if (zipCode1.toString().length == 6 && zipCode2.toString().length == 6){
            for (let i = zipCode1; i <= zipCode2; i++){

                const oldZipCodeAddress:Array<string> = oldIndex.search(i.toString()) as Array<string>
                if (oldZipCodeAddress.length == 0){
                    continue
                }
                
                for (const element of oldZipCodeAddress){
                    const address:string = element.split(',').slice(1,).toString()
                    const newZipCodeAddress:Array<string> = newIndex.search(address) as Array<string>
                    if (newZipCodeAddress.length == 0){
                        continue
                    }

                    for (const convertedZipCodes of newZipCodeAddress){
                        const newZipCode = convertedZipCodes.split(',')[0]
                        
                        if (newZipCode.length == 5){
                            zipCodeSet[newZipCode] = {source: csvPath}
                        } else {
                            zipCodeSet[`0${newZipCode}`] = {source: csvPath}
                        }

                    }
                }                    

            }
        }
    }
    
    return zipCodeSet
}