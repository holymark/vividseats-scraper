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



// const obj = {
          //     name,
          //     date: {
          //         localDate,
          //         utcDate,
          //         onsaleDate,
          //         presaleDate,
          //     },
          //     prices: {
          //         minPrice,
          //         maxPrice,
          //         avgPrice,
          //         medianPrice,
          //     },
          //     ticketCount,
          //     listingCount,
          //     dateTbd,
          //     timeTbd,
          //     ifNecessary,
          //     venue,
          //     urls: {
          //         organicUrl,
          //         webPath,
          //     },
          // };
