import {gotScraping} from "crawlee"


    async function fd(){
        try {
            const response = await gotScraping({url:"https://www.vividseats.com/sports/rodeo",headerGeneratorOptions:{
                devices:["desktop"],
                operatingSystems:["windows"],
                locales:["en-US"],
                preNavigationHooks: [({ request }) => {
                    request.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
                },]
            }})
            console.log( response.headers)
        } catch (error) {
         console.error(error)   
        }

    }

console.log(fd())