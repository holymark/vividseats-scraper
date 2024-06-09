import { CheerioCrawler } from 'crawlee';
import { router } from './routes.js';
import { labels } from './constants.js';
import { Actor } from 'apify';
import { Input } from './types.js';



await Actor.init();

const {
    startUrls = ["https://www.vividseats.com/ncaab"],
    maxRequestsPerCrawl = 100,
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




for await (const url of startUrls) {
    console.log("Crawler Started >>>>")
    await crawler.run(
        [
            {  url, label: labels.Start }
        ]
    );
}
await Actor.exit()
console.log("Crawler Ended >>>>")

