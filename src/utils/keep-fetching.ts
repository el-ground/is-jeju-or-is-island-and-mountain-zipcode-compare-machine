import fetch from 'node-fetch'

export default async (url:string, options:any) => {     
    let error
    
    for (let i = 0; i < 10; i++) {
        try {
            return await fetch(url, options);
        } catch (e) {
            error = e
        }
    }

    throw error
}