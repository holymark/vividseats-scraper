import { CheerioCrawler, ProxyConfiguration } from 'crawlee';
import { router } from './routes.js';
import { labels } from './constants.js';
import { Actor } from 'apify';

interface Input {
    startUrls: string[];
    maxRequestsPerCrawl: number;
}

await Actor.init();

const {
    startUrls,
    maxRequestsPerCrawl = 100,
} = await Actor.getInput<Input>() ?? {} as Input;

const proxyConfiguration = await Actor.createProxyConfiguration();


const crawler = new CheerioCrawler({
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,
    // Comment this option to scrape the full website.
    maxRequestsPerCrawl: 20,
    preNavigationHooks: [
        async ({ request, crawler }) => {
            if (request.headers) {
                // Mimic human-like behavior by setting headers
                request.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
                request.headers['Accept-Language'] = 'en-US,en;q=0.9';
            }
        },
    ],
    maxConcurrency: 2, // Limit the number of concurrent requests
});



startUrls.forEach(async (url) => {
    await crawler.addRequests([Object.assign(url, { label: labels.Start })])
});

console.log("Crawler Started >>>>")