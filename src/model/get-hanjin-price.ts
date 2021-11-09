import keepFetching from '../utils/keep-fetching.js'

interface JSON {
    result: {
        trn_fre:string
    }
}

export default async (zipcode:string):Promise<string> => { 
    
    const response = await keepFetching("https://www.hanjin.co.kr/$%7BtmplSiteCode!%7D/ajx_json/DeliveryMgr/PredictionAmount.json", {
        "headers": {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        "body": `i_box_typ=SS&i_srv=A&i_snd_zip=05740&i_rcv_zip=${zipcode}&i_prc=0&index=1`,
        "method": "POST"
    })

    const responseJSON:JSON = await response.json() as JSON
    const price:string = responseJSON.result.trn_fre

    return price
}