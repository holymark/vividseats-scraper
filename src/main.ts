import { CheerioCrawler, log } from 'crawlee';
import { router } from './routes.js';
import { URLs_crawlable, labels } from './constants.js';
import { Actor } from 'apify';
import { Input } from './types.js';
import { configDotenv } from 'dotenv';
import { flattenURLs } from "./lib.js"

configDotenv();
const { APIFY_PROXY_HOSTNAME, APIFY_PROXY_PORT, APIFY_PROXY_PASSWORD } = process.env;
const connectionString = `http://auto:${APIFY_PROXY_PASSWORD}@${APIFY_PROXY_HOSTNAME}:${APIFY_PROXY_PORT}`;

await Actor.init();


const {
    startUrls = URLs_crawlable.sports.Basketball,
    maxRequestsPerCrawl = 800,
    proxyConfiguration: proxyConfig = {
        useApifyProxy: true,
    },
} = await Actor.getInput<Input>() ?? {} as Input;

const proxyConfiguration = await Actor.createProxyConfiguration(proxyConfig);

const crawler = new CheerioCrawler({
    proxyConfiguration,
    requestHandler: router,
    maxRequestsPerCrawl,
    useSessionPool: true,
    sessionPoolOptions: {
        maxPoolSize: 10
    },
    persistCookiesPerSession: true,

    maxConcurrency: 2,
});


// Function to start crawling a specific category
const crawlCategory = async (category: keyof typeof URLs_crawlable) => {
    const categoryURLs = flattenURLs(URLs_crawlable[category]);
    for (const { url, subcategory } of categoryURLs) {
        await crawler.run(
            [
                { url, userData: { category: `${category}/${subcategory}` }, label : labels.Start }
            ]
        );
    }
};


// for await (const url of startUrls) {
//     console.log("Crawler Started >>>>")
//     await crawler.run(
//         [
//             { url, label: labels.Start }
//         ]
//     );
// }

(async () => {
    await crawlCategory('sports');
    await crawlCategory('concerts');
    await crawlCategory('theater');

    log.info('Crawling finished. >>>>');
})();
await Actor.exit()
console.log("Crawler Ended >>>>")

