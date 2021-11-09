import cheerio, { CheerioAPI } from 'cheerio'

import keepFetching from '../utils/keep-fetching.js'

interface JSON {
    list: Array<{
        ZIP_CD:string,
        C_BRNSHP_CD:string,
    }>
}

export default async (address:string):Promise<string> => { 
    
    const preResponse = await keepFetching("https://www.lotteglogis.com/home/popup/common/zipcode5", {
        "headers": {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-fetch-dest": "empty"
        },
        "body": `mode=road&scwd=${address}`,
        "method": "POST"
    })
    const responseJSON:JSON = await preResponse.json() as JSON
    const brnshpcd:string = responseJSON.list[0].C_BRNSHP_CD
    const zipcd:string = responseJSON.list[0].ZIP_CD

    const response = await keepFetching("https://www.lotteglogis.com/home/reservation/feeinfo/view", {
        "headers": {
          "content-type": "application/x-www-form-urlencoded"
        },
        "body": `snd_zipcode=138860&snd_brnshp_cd=30231&rcv_zipcode=${zipcd}&rcv_brnshp_cd=${brnshpcd}&qry_10=1&qry_20=&qry_30=`,
        "method": "POST"
    })
    const responseText:string = await response.text()
    const $:CheerioAPI = cheerio.load(responseText)

    const price:string = $(`table.tblV`).toString().replace(/\t|\n|\s|,|원|<[^>]*>?/gm, '').split("택배요금").filter(n => n != '')[2]

    return price
}