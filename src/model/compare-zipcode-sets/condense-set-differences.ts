export default (diffCombinedSet:DiffCombinedSet):Array<Array<number|Array<string>>> => { 
    
    const zipCodeRange:Array<Array<number|Array<string>>> = [[0,0,0,[]]]

    let count = 0
    Object.keys(diffCombinedSet).forEach(element => {
        if (zipCodeRange[count][0] == 0){
            // zipCodeRange[count][0] = difference count
            zipCodeRange[count][0] = diffCombinedSet[element].changeSource.length
            // zipCodeRange[count][1] = zip code lower range
            zipCodeRange[count][1] = parseInt(element)
            // zipCodeRange[count][2] = zip code upper range
            zipCodeRange[count][2] = parseInt(element)
            // zipCodeRange[count][3] = array of difference sources
            zipCodeRange[count][3] = diffCombinedSet[element].changeSource

        } else if (zipCodeRange[count][2] as number + 1 == parseInt(element)){

            const zipCodeSource1 = zipCodeRange[count][3] as Array<string>
            const zipCodeSource2 = diffCombinedSet[element].changeSource

            if (zipCodeSource1.length == zipCodeSource2.length && zipCodeSource1.every(function (element) {return zipCodeSource2.includes(element)})) {
                zipCodeRange[count][2] = zipCodeRange[count][2] as number + 1
            }
            
        } else {
            zipCodeRange.push([diffCombinedSet[element].changeSource.length,parseInt(element), parseInt(element), diffCombinedSet[element].changeSource])
            count++
        }
    })

    zipCodeRange.sort().reverse()

    return zipCodeRange
}