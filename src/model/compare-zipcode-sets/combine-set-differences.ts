export default (trackDiffSetArray:Array<TrackDiffSet>):DiffCombinedSet => { 
    
    const diffCombinedSet:DiffCombinedSet = {}

    for (const trackDiffSet of trackDiffSetArray){

        Object.keys(trackDiffSet).forEach(element => {
            
            const source:string = trackDiffSet[element].source
            const change:string = trackDiffSet[element].change

            const newChangeSource:Array<string> = diffCombinedSet[element]? diffCombinedSet[element].changeSource : []
            newChangeSource.push(`${change} in ${source}`)

            diffCombinedSet[element] = {
                diffCount: diffCombinedSet[element]? diffCombinedSet[element].diffCount + 1 : 1,
                changeSource: newChangeSource
            }

        })
    }

    return diffCombinedSet
}