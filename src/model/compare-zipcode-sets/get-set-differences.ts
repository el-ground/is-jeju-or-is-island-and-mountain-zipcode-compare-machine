export default (baseSet: ZipCodeSet, compareSet: ZipCodeSet):TrackDiffSet => { 
    
    const trackDiffSet:TrackDiffSet = {}
    const compareSetSource = Object.values(compareSet)[0].source

    Object.keys(baseSet).forEach(element => {
        trackDiffSet[element] = {
            source: compareSetSource,
            change: 'discarded'
        }
    })

    Object.keys(compareSet).forEach(element => {
        if (element in trackDiffSet) {
            delete trackDiffSet[element]
        } else {
            trackDiffSet[element] = {
                source: compareSetSource,
                change: 'added'
            }
        }
    })

    return trackDiffSet
}