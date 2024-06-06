import { CheerioCrawler, ProxyConfiguration } from 'crawlee';
import { router } from './routes.js';
import { labels } from './constants.js';
import { Actor } from 'apify';
import { Input } from './types.js';



await Actor.init();

const {
    startUrls,
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



startUrls.forEach(async (url) => {
    await crawler.addRequests([Object.assign(url, { label: labels.Start })])
});

console.log("Crawler Started >>>>")
Actor.exit()
console.log("Crawler Ended >>>>")



/**
 * // gotscraping
 headerOptions: {
    devices: ["desktop"],
    locales: ["en-UU"],
    operatingSytems: ["windows"]
 }

 // crawlee
 import { PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
    browserPoolOptions: {
        useFingerprints: true, // this is the default
        fingerprintOptions: {
            fingerprintGeneratorOptions: {
                browsers: [{ name: 'edge', minVersion: 96 }],
                devices: ['desktop'],
                operatingSystems: ['windows'],
            },
        },
    },
    requestHandler: async ({ page }) => {
        // use the human-like Playwright page
    }
});


 */