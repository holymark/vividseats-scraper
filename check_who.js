import {gotScraping} from "crawlee"


    async function fd(){
        try {
            const response = await gotScraping({url:"https://httpbin.org/headers",headerGeneratorOptions:{
                devices:["desktop"],
                operatingSystems:["windows"],
                locales:["en-US"],
                
            }})
            console.log( response.headers)
        } catch (error) {
         console.error(error)   
        }

    }

console.log(fd())