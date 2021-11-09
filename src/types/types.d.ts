type set = {[value:string] : any}

type ZipCodeSet = {[value:string] : {source:string}}
type TrackDiffSet = {[value:string] : {source:string, change:string}}
type DiffCombinedSet = {[value:string] : {diffCount:number, changeSource:Array<string>}}